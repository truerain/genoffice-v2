# GenOffice V2 아키텍처 개요

## 1. 전체 구조

GenOffice V2는 **pnpm workspace + Turbo** 기반 모노레포입니다. 앱은 기능 패키지를 조합하고, 기능 패키지는 UI·테마 기반 위에 쌓입니다.

```text
┌─────────────────────────────────────────────────────────┐
│  apps/demo, apps/storybook                              │
│  (라우팅, MDI, 메뉴, API, 도메인 페이지)                  │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│  feature packages                                       │
│  gen-frame, gen-datagrid-crud, gen-datagrid-chart,      │
│  gen-datagrid-pivot (설계 문서 · 구현 backlog),          │
│  mdi, gen-chart                                         │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│  gen-datagrid (core grid engine)                        │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│  ui, theme, utils                                       │
└─────────────────────────────────────────────────────────┘
```

## 2. 의존 방향 규칙

```text
apps → feature packages → gen-datagrid → ui → theme/utils
```

### 허용

- 앱 → 모든 workspace 패키지
- `gen-datagrid-crud` → `gen-datagrid`, `ui`, `utils`, `theme`
- `gen-datagrid` → `ui`, `utils`
- `ui` → `theme`, `utils`

### 금지

- `ui` → `gen-datagrid` (역방향)
- `gen-datagrid` → `gen-datagrid-crud`
- 패키지 간 순환 의존

## 3. 패키지 책임

### 기반 레이어

| 패키지 | 책임 |
| --- | --- |
| `theme` | 디자인 토큰, 글로벌 스타일, 폰트, 테마 primitive |
| `utils` | 도메인 무관 공통 유틸 |
| `ui` | 버튼, 입력, 다이얼로그, Combobox, DatePicker 등 범용 UI |

`ui`에 무거운 에디터 엔진(TipTap 등)을 계속 두지 않고, 성숙 시 `@gen-office/html-editor`로 분리하는 것을 V2 로드맵에 둡니다.

### 레이아웃

| 패키지 | 책임 |
| --- | --- |
| `gen-frame` | 앱 프레임 — layout chrome (TitleBar/LeftPanel 등), navigation 오케스트레이션, URL ↔ page 연동, MDI/단일 페이지 host |
| `mdi` | Multiple Document Interface — 탭 store·TabBar·TabPanel (gen-frame이 선택적으로 사용) |

### 그리드 스택 (V2 핵심)

| 패키지 | 책임 |
| --- | --- |
| `gen-datagrid` | div 기반 DataGrid. TanStack Table 상태 + virtualization + selection + editing |
| `gen-datagrid-crud` | CRUD 액션 바, row status, dirty 연동, Excel export, i18n 메시지 |
| `gen-datagrid-chart` | selection range → chart model, preview dialog |
| `gen-datagrid-pivot` | AG Grid식 Pivot (집계·result columns). **설계 문서만** — 구현은 Phase 4b backlog. 정본: [packages/gen-datagrid-pivot/.docs](../packages/gen-datagrid-pivot/.docs/README.md) |

`gen-datagrid-chart`는 **새 gen-chart API**(`GenChartOptions`, `CartesianChart` 등)만 사용합니다.

### 시각화 (V2 재설계)

| 패키지 | 책임 |
| --- | --- |
| `gen-chart` | headless model + composable React 차트. core=`d3-scale`, visx는 internal renderer. **V1 코드 이식 안 함** |
| `gen-datagrid-chart` | grid selection → `CartesianChartOptions` 변환, preview dialog |

#### gen-chart 내부 모듈 (계획)

```text
packages/gen-chart/src/
  types/    public 타입
  core/     createCartesianModel, domain, geometry, hit-test, warnings (React·visx 무관)
  themes/   ChartTokens, resolveChartTokens
  react/    ChartRoot, CartesianChart, PolarChart, chrome, motion
  internal/visx/   renderer adapter (deep import 금지)
```

Public API: `ChartRoot` + plot별 chart + slot primitives. V1 monolith `GenChart` / `kind` API는 채택하지 않습니다.

- 개요: [05-GEN-CHART.md](./05-GEN-CHART.md)
- 정본: [packages/gen-chart/.docs/architecture.md](../packages/gen-chart/.docs/architecture.md)

#### gen-frame (앱 프레임)

- layout mode: `leftPanel`, `titleBar`, (후속) `hybrid`, `rail`
- navigation mode: `mdi` | `single`
- 메뉴 API·componentRegistry·auth는 `apps/*` — gen-frame은 `FrameMenuItem` + `resolvePage` 주입만
- 정본: [packages/gen-frame/.docs/architecture.md](../packages/gen-frame/.docs/architecture.md)
- Gate: [packages/gen-chart/.docs/gates.md](../packages/gen-chart/.docs/gates.md)

### 공유 설정

| 패키지 | 책임 |
| --- | --- |
| `tsconfig` | workspace 공유 TypeScript 설정 |

## 4. 앱 레이어

### `apps/demo`

V2 reference 백오피스 앱입니다. V1 demo에서 이식하되 그리드 의존은 전면 교체합니다.

**정본 문서:** [apps/demo/.docs/architecture.md](../apps/demo/.docs/architecture/architecture.md) · [plan.md](../apps/demo/.docs/plan/plan.md)

구현은 **Phase D0~D3**(shell·차트) ✅, **D4~D5**(admin·range chart)는 `gen-datagrid`·`gen-datagrid-crud` 패키지 이관 완료 후 demo 연동 **진행 중**입니다.

주요 구성 요소:

| 영역 | 역할 |
| --- | --- |
| `app/App.tsx` | MDI shell, 로그인 분기, 레이아웃 모드 |
| `app/menu/` | DB/mock 메뉴 → MDI 페이지 오픈 |
| `app/config/componentRegistry.dynamic.ts` | 메뉴 componentName → lazy page 매핑 |
| `shared/api/` | backend HTTP, CSRF, auth |
| `pages/admin/*` | CRUD 관리 화면 |
| `pages/demo/*` | 컴포넌트·그리드 시연 |
| `i18n/` | 다국어 |

### `apps/storybook`

패키지별 Story를 통합해 문서화·시각 회귀 테스트에 사용합니다. `gen-datagrid`·`gen-datagrid-crud` story 포함.

## 5. GenDataGrid 아키텍처 요약

V2의 핵심인 `gen-datagrid`는 아래 계층으로 구성됩니다. 상세·Gate 정본은 V2 [`packages/gen-datagrid/.docs/`](../packages/gen-datagrid/.docs/README.md)를 참고합니다. V1 [`gen-datagrid/docs/`](../../frontend/packages/gen-datagrid/docs/)는 이관 전 참조용입니다.

```text
GenDataGrid (public)
  └─ DataGridRoot
       ├─ DataGridHeader
       ├─ DataGridBody | DataGridVirtualBody
       └─ DataGridFooterBar

features/
  active-cell, range-selection, editing, filtering,
  pinning, reorder, dirty, ...

core/
  table/ (TanStack adapter), dom/ (selectors, cellDom)
```

### DOM 계약 (고정)

- `data-gen-datagrid-root="true"`
- `data-grid-id={gridId}`
- `data-gen-datagrid-cell="true"` + `data-rowid` / `data-colid`

같은 화면에 여러 grid가 있어도 focus·selection·clipboard가 섞이지 않아야 합니다.

## 6. GenDataGrid CRUD 레이어

V1 `gen-grid-crud`가 `GenGrid`에 CRUD를 얹었다면, V2는 `GenDataGrid` API에 맞춰 **재설계**합니다.

V2 workspace 상태 (2026-06-29):

| Gate | 내용 | 상태 |
| --- | --- | --- |
| 10 | `GenDataGridCrud` thin shell, ActionBar, controller | ✅ |
| 11 | created row, validation, commit pipeline, export shell | ✅ |
| 12 | migration guide, app QA guide | ✅ (문서) |

demo admin 화면 — `UserManagement`·`Actuals` ✅, 나머지 admin **진행 중**.  
정본: [packages/gen-datagrid-crud/.docs/README.md](../packages/gen-datagrid-crud/.docs/README.md)

책임:

- CRUD toolbar / action controls
- row 추가·삭제·저장·취소 흐름
- `GenDataGrid` dirty state·row status 연동
- column meta·editor factory 패턴
- Excel export (exceljs)
- i18n 메시지 키

thin wrapper가 아니라 GenDataGrid public API(`onDataChange`, `dataVersion`, column meta 등)를 기준으로 설계합니다.

## 7. 백엔드 연동

프론트엔드만 V2로 분리하고, [`backend`](../../backend)는 그대로 사용합니다.

| 영역 | V2 대응 |
| --- | --- |
| 세션 로그인 / CSRF | V1 demo `shared/api` 이식 |
| 메뉴 API | DB 기반 동적 메뉴 유지 |
| admin CRUD API | 기존 REST 엔드포인트 재사용 |
| i18n 메시지 API | 기존 연동 유지 |

## 8. 빌드·검증 파이프라인 (계획)

| 단계 | 명령 | 목적 |
| --- | --- | --- |
| 타입체크 | `tsc --noEmit` (패키지별) | API 계약 검증 |
| 빌드 | `pnpm build` (Turbo) | dist 산출물 |
| 린트 | `pnpm lint` | 코드 스타일·규칙 |
| 테스트 | `pnpm test` | unit + interaction |
| 인코딩 | `pnpm check:encoding` | UTF-8 일관성 |
| Storybook | `pnpm storybook` | 시각·문서 검증 |

`gen-datagrid`는 V1에서 이미 vitest interaction test 패턴을 갖추고 있으므로, V2에서도 동일 gate를 유지·확장합니다.

## 9. V1 대비 아키텍처 변화 요약

| 항목 | V1 | V2 |
| --- | --- | --- |
| 그리드 렌더러 | `<table>` DOM | div `role="grid"` |
| CRUD 패키지 | `gen-grid-crud` | `gen-datagrid-crud` |
| gen-datagrid 위치 | experimental | core |
| 차트 연동 | `gen-grid-chart` | `gen-datagrid-chart` |
| demo 그리드 | `GenGrid` / `GenGridCrud` | `GenDataGrid` / `GenDataGridCrud` |
| demo 차트 | V1 monolith `GenChart` | `CartesianChart` + composable series |
| gen-chart | V1 `GenChart.tsx` 이식 | API 우선 신규 구현 |

## 10. 관련 문서

- [01-OVERVIEW.md](./01-OVERVIEW.md)
- [03-V1-RELATIONSHIP.md](./03-V1-RELATIONSHIP.md)
- [04-ROADMAP.md](./04-ROADMAP.md)
- [05-GEN-CHART.md](./05-GEN-CHART.md)

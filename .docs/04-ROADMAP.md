# GenOffice V2 로드맵

V1 [`frontend`](../../frontend)에서 `genoffice-v2`로 이전하기 위한 단계별 계획입니다.

## Phase 개요

작업은 **두 트랙**으로 병렬 진행합니다.

```text
[트랙 A — 다른 agent]  gen-datagrid Gate 8 · MVP
[트랙 B — 직접 검토]   theme → utils → ui → mdi → gen-chart → … → demo
                              (상세: 06-PACKAGE-REVIEW-PLAN.md)

합류: gen-datagrid-crud → gen-datagrid-chart → demo 그리드 화면
```

```text
Phase 0   스캐폴딩·기반 이식
   ↓
Phase 1a  gen-datagrid Gate 8          ← 트랙 A (다른 agent)
   ‖
Phase 1b  theme → utils → ui → mdi     ← 트랙 B 시작
   ‖ (병렬)
Phase 1c  gen-chart C0~C4              ← 트랙 B (ui·theme 이후)
   ↓
Phase 2   gen-datagrid-crud            ← 트랙 A·B 합류
   ‖ (병렬)
Phase 2b  gen-chart C5~C7
   ↓
Phase 3   demo admin 핵심 화면 (그리드)
   ↓
Phase 4   gen-datagrid-chart + Chart/Dashboard demo + 정리
   ↓
Phase 5   (선택) React 19, Storybook 9, E2E
```

---

## Phase 0 — 스캐폴딩

**목표**: 빌드 가능한 V2 워크스페이스 골격 확보

### 작업

- [ ] `frontend` → `genoffice-v2` 복제
- [ ] `packages/gen-grid`, `gen-grid-crud`, `gen-grid-chart` 제거
- [ ] V1 `packages/gen-chart` **코드 이식 안 함** — 빈 scaffold + types/.docs/stub만 생성
- [ ] 루트·앱 `package.json`에서 레거시 workspace 의존 제거
- [ ] 루트 `package.json` name을 `genoffice-v2`로 변경
- [ ] stale 스크립트 정리 (예: `rdg-demo` — 앱 없음)
- [ ] `pnpm install && pnpm build` 통과
- [ ] 루트 `README.md`, `.docs/` (본 문서군) 반영
- [ ] `AGENTS.md` V2 기준으로 작성 (V1에서 이식·수정)

### 완료 기준

- 레거시 그리드 패키지 없이 workspace 인식
- `theme`, `ui`, `utils`, `mdi`, `gen-datagrid` 빌드 성공
- `gen-chart` 패키지 scaffold 인식 (구현은 Phase 1b부터)

### 예상 기간

1~3일

---

## Phase 1b — 기반 패키지 소스 검토 (트랙 B)

**목표**: `theme` → `utils` → `ui` → `mdi` 순으로 V1 소스를 검토·이식

상세: [06-PACKAGE-REVIEW-PLAN.md](./06-PACKAGE-REVIEW-PLAN.md)

### 작업

- [ ] `packages/tsconfig` 이식
- [ ] `packages/theme` 검토·이식
- [ ] `packages/utils` 검토·이식
- [ ] `packages/ui` 검토·이식
- [ ] `packages/mdi` 검토·이식
- [ ] 패키지별 `.docs/review-log.md` 기록

### 완료 기준

- 위 4개 패키지 `pnpm build` 통과
- `ui` Storybook 또는 storybook-all에서 core 컴포넌트 smoke

### 예상 기간

2~3주 (검토 깊이에 따라 가변)

---

## Phase 1a — gen-datagrid Gate 8 (트랙 A)

**목표**: `gen-grid` 대체 후보로 평가 가능한 MVP 완성

**담당**: 다른 agent (본 워크스페이스에서는 소스 검토 트랙과 병렬)

Gate 정의: V1 [`mvp-test-gates.md`](../../frontend/packages/gen-datagrid/docs/plan/mvp-test-gates.md) § Gate 8

### 작업

- [ ] row number, row selection, row status (CRUD 레이어와 겹치는 부분 조율)
- [ ] imperative handle public API export 정리
- [ ] gen-grid 주요 story/demo 시나리오를 gen-datagrid Storybook으로 재현
- [ ] multiple grid page, nested grid boundary smoke test
- [ ] `pnpm -C packages/gen-datagrid test` 전체 통과
- [ ] MVP 미지원 기능 명시적 에러·문서화

### 완료 기준

- Gate 8 체크리스트 항목 충족
- table 태그 미사용 (baseline test 유지)

### 예상 기간

1~2주

---

## Phase 1c — gen-chart core + cartesian (트랙 B, ui 이후)

**목표**: headless model과 cartesian 렌더러 MVP

상세 Gate: [05-GEN-CHART.md](./05-GEN-CHART.md) §9 (C0~C4)

### 작업

- [ ] `core/createGenChartModel` — domain, visibility, warnings 단위 테스트
- [ ] `useGenChart` + layout metrics
- [ ] `CartesianChart`, `ChartGrid`, `ChartXAxis`, `ChartYAxis`
- [ ] `LineSeries`, `BarSeries`, `AreaSeries`, `ComposedSeries`
- [ ] dev warning (`GC001`~`GC005`) 일관 적용

### 완료 기준

- Gate C4 통과
- Storybook에 line/bar/area/composed 시나리오

### 예상 기간

1~2주 (`ui`·`theme` 완료 후, Phase 1a와 병렬 가능)

---

## Phase 2 — gen-datagrid-crud

**목표**: V1 `gen-grid-crud` 역할을 GenDataGrid 기준으로 재구현

### V1에서 이식할 기능 (참고)

- CRUD action controls (추가·삭제·저장·취소)
- row status column
- dirty state 연동
- Excel export (exceljs)
- i18n 메시지
- column helper / CRUD config 패턴

### 작업

- [ ] `packages/gen-datagrid-crud` 패키지 생성
- [ ] `GenDataGridCrud` (가칭) public API 설계 문서 작성
- [ ] V1 `gen-grid-crud`와 기능 gap 분석
- [ ] Storybook + interaction test
- [ ] demo에 의존성 연결 (아직 화면 포팅 전 smoke)

### 완료 기준

- UserManagement에 필요한 최소 CRUD API 제공
- `gen-datagrid`만 의존 (gen-grid 없음)

### 예상 기간

1~2주

---

## Phase 2b — gen-chart Phase 1 ✅ (2026-06-27 마감)

**목표**: pie/donut·tooltip·legend·motion enter·responsive·dashboard Storybook

### 작업

- [x] `PieSeries`, `DonutSeries`, `ChartTooltip`, `ChartLegend`
- [x] `ResponsiveChartContainer`, dashboard Storybook
- [x] motion enter (C6b), interaction test
- [x] Gate C5~C7 통과

### 완료 기준

- V1 `ChartDemoPage` / `DashboardDemoPage` 시나리오를 V2 API로 **Storybook** 재현
- **Phase 2** (C8 demo·grid 연동)는 `gen-datagrid` · `apps/demo` · `gen-datagrid-chart` 준비 후 — [phase.md](../packages/gen-chart/.docs/phase.md)

---

## Phase 3 — demo 핵심 화면 포팅

**목표**: reference CRUD·도메인 화면을 GenDataGrid로 전환

**demo 구현 Plan:** [apps/demo/.docs/plan.md](../apps/demo/.docs/plan.md) — D0~D2 shell, D4 admin (grid 선행)

### 우선 화면

| 순서 | 화면 | 패키지 |
| --- | --- | --- |
| 1 | UserManagement | gen-datagrid-crud |
| 2 | MenuManagement | gen-datagrid-crud |
| 3 | LkupManagement | gen-datagrid-crud |
| 4 | RoleManagement | gen-datagrid-crud |
| 5 | CustomerInfo | gen-datagrid (또는 crud) |

### 작업

- [ ] `apps/demo/package.json` — `gen-grid*` → `gen-datagrid*` 교체
- [ ] `*Crud.ts`, `*Columns.tsx` GenDataGrid API로 재작성
- [ ] `main.tsx` CSS import 경로 수정
- [ ] mock·실 API 모드 smoke test
- [ ] i18n 키 유지·보완

### 완료 기준

- 위 5화면 MDI에서 정상 오픈·CRUD 동작
- `apps/demo`에 `gen-grid` import 없음

### 예상 기간

2주

---

## Phase 4 — gen-chart Phase 2 · demo 차트 연동

**목표**: grid·demo 준비 후 gen-chart C8 및 연동 패키지

**선행:** gen-chart Phase 1 ✅, `gen-datagrid` MVP, `apps/demo`, `gen-datagrid-crud` smoke

### 작업

- [ ] `gen-datagrid-chart` — range → `CartesianChartOptions`, preview dialog (Gate C8)
- [ ] `ChartDemoPage`, `DashboardDemoPage` V2 composable API (`apps/demo`)
- [ ] ActualsPage + range chart 연동
- [ ] gen-chart Phase 2 backlog — motion 고급, treemap, crosshair ([phase.md](../packages/gen-chart/.docs/phase.md))
- [ ] Notice, Message, UserRole 등 나머지 admin 화면 포팅
- [ ] demo 그리드 시연 페이지 정리·대체
- [ ] `html-editor` 패키지 분리 검토
- [ ] V2 `06-BUILD_GUIDE.md` 작성
- [ ] V1 freeze 정책 README 반영

### 완료 기준

- [01-OVERVIEW.md](./01-OVERVIEW.md) MVP 체크리스트 전항목 충족
- demo에 V1 `GenChart` import 없음

### 예상 기간

2주

---

## Phase 5 — (선택) 플랫폼 업그레이드

**목표**: 그리드 MVP 안정 후 기술 스택 한 단계 업

| 항목 | 내용 |
| --- | --- |
| React 19 | Radix, Storybook, TanStack 호환성 검증 후 |
| Storybook 9 | 통합 Storybook 마이그레이션 |
| pnpm 10 / Node 22 | engines·CI 갱신 |
| Playwright | Gate 7·8 browser E2E, demo smoke |
| `html-editor` | `ui`에서 TipTap 분리 완료 |

MVP 블로커로 두지 않습니다.

### 예상 기간

1주+

---

## 리스크·완화

| 리스크 | 완화 |
| --- | --- |
| API 비호환으로 demo 포팅 지연 | Phase 1 Gate 8로 story 시나리오 선행 확보 |
| gen-datagrid-crud 범위 팽창 | UserManagement 기준 최소 API 먼저 |
| gen-chart API 재설계 지연 | Phase 1b를 그리드와 병렬. types·tests 먼저 고정 |
| V1/V2 이중 수정 | MVP 후 V1 freeze |
| Actuals chart 연동 | Phase 4 전 gen-datagrid-chart API 스파이크 |
| V1 GenChart와 API 혼동 | adapter 없음. demo는 V2 API만 사용 |

---

## 마일스톤 요약

| 마일스톤 | 산출물 |
| --- | --- |
| M0 | 빌드 가능한 genoffice-v2 스캐폴딩 |
| M1 | gen-datagrid Gate 8 pass |
| M1b | gen-chart C4 (cartesian) pass |
| M2 | gen-datagrid-crud + UserManagement 동작 |
| M2b | gen-chart C7 (pie, responsive) pass |
| M3 | admin 5+ 화면 GenDataGrid 전환 |
| M4 | **V2 MVP** — gen-grid zero, V1 GenChart zero, full demo |

---

## 관련 문서

- [01-OVERVIEW.md](./01-OVERVIEW.md)
- [02-ARCHITECTURE.md](./02-ARCHITECTURE.md)
- [03-V1-RELATIONSHIP.md](./03-V1-RELATIONSHIP.md)
- [05-GEN-CHART.md](./05-GEN-CHART.md)
- [06-PACKAGE-REVIEW-PLAN.md](./06-PACKAGE-REVIEW-PLAN.md)

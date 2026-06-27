# 패키지별 소스 검토·이식 계획

## 1. 작업 분담

GenOffice V2는 **두 갈래**로 진행합니다.

| 담당 | 범위 | 방식 |
| --- | --- | --- |
| **다른 agent** | `packages/gen-datagrid` | Gate 8 완료·MVP acceptance까지 구현 주도 |
| **직접 검토 (본 문서)** | 그 외 packages + apps | V1 소스를 **차근차근 읽고** V2에 이식·수정·재작성 |

`gen-datagrid`는 이 문서의 검토 순서에 **포함하지 않습니다.**  
다른 agent가 완성한 뒤, `gen-datagrid-crud`·`gen-datagrid-chart`·demo 연동 단계에서 합류합니다.

## 2. 검토 원칙

### 한 번에 한 패키지

- 의존 방향 아래쪽 패키지부터 완료한 뒤 상위로 올라갑니다.
- 패키지를 넘기기 전에 **빌드·Storybook(해당 시)·검토 로그**를 남깁니다.
- 상위 패키지에서 하위 패키지 API를 바꿨다면, 하위 패키지 문서와 export를 먼저 확정합니다.

### V1 대비 판단 기준

각 파일·모듈마다 아래 중 하나를 택합니다.

| 판단 | 설명 |
| --- | --- |
| **이식** | V1과 동일 또는 최소 수정으로 V2에 포함 |
| **수정 이식** | 구조는 유지하나 API·스타일·의존 정리 |
| **재작성** | V2 요구에 맞게 처음부터 다시 작성 |
| **제외** | V2에 넣지 않음 |
| **보류** | 후속 패키지·앱 단계에서 결정 |

### 패키지 완료 기준 (공통)

- [ ] `pnpm -C packages/<name> build` 통과
- [ ] public `index.ts` export가 의도와 일치
- [ ] 패키지 `.docs/` 또는 구현 로그에 검토 결과 기록
- [ ] 하위 workspace 패키지에만 의존 (역방향·순환 없음)
- [ ] V2에서 제외하기로 한 V1 코드가 남아 있지 않음

## 3. 검토 순서 (의존성 기준)

의존 그래프 아래 → 위 순서입니다.

```text
tsconfig
   ↓
theme ──┐
        ├──→ ui ──→ mdi
utils ──┘      │
                 ├──→ gen-chart (재작성)
                 │
gen-datagrid ────┼──→ gen-datagrid-crud   ← 다른 agent
 (병렬, 외부)    │
                 └──→ gen-datagrid-chart
                           ↓
              apps/storybook-all → apps/demo
```

### 권장 진행 순서

| 순서 | 패키지 | V1 대비 | 비고 |
| --- | --- | --- | --- |
| 0 | `packages/tsconfig` | 이식 | 공유 TS 설정. 소스 검토는 가볍게 |
| 1 | `packages/theme` | 수정 이식 | 토큰·폰트·ThemeProvider. **시작점** |
| 2 | `packages/utils` | 이식 | `clsx` 등. React 무관 |
| 3 | `packages/ui` | 수정 이식 | Radix 래퍼·composed. TipTap 분리는 보류 가능 |
| 4 | `packages/mdi` | 수정 이식 | Zustand store·탭·창 |
| 5 | `packages/gen-chart` | **재작성** | V1 monolith 이식 안 함. [05-GEN-CHART.md](./05-GEN-CHART.md) |
| — | `packages/gen-datagrid` | **다른 agent** | 본 순서에서 제외 |
| 6 | `packages/gen-datagrid-crud` | 신규 | gen-datagrid API 확정 후 착수 |
| 7 | `packages/gen-datagrid-chart` | 신규/포팅 | gen-chart + gen-datagrid 준비 후 |
| 8 | `apps/storybook-all` | 수정 이식 | 패키지 Story 통합 |
| 9 | `apps/demo` | 수정 이식 | shell·메뉴·API 먼저, 화면은 마지막 |

`theme` → `utils` → `ui` 흐름은 `ui`가 `theme`·`utils`에 의존하기 때문입니다.  
`utils`를 `theme` 직후에 두면 `ui` 검토 시 기반 API가 이미 고정되어 있습니다.

## 4. 패키지별 검토 포인트

### 0. `tsconfig`

- [ ] `base.json` / `react.json` 등 V2 패키지 경로에 맞는지
- [ ] strict 옵션·path alias 정책
- [ ] React 18 vs 19 타겟 (스택 확정 시 한 번에 반영)

### 1. `theme`

- [ ] 디자인 토큰 구조 (CSS 변수·JS token 객체)
- [ ] `ThemeProvider`·`useTheme` public API
- [ ] `index.css` / `global.css` export 경로
- [ ] `pretendard` 등 폰트 로딩 방식
- [ ] gen-chart·ui가 참조하는 token 이름 안정성

**V1 참조**: [`frontend/packages/theme`](../../frontend/packages/theme)

### 2. `utils`

- [ ] public export 목록·도메인 중립성
- [ ] ui·grid에만 쓰이는 함수는 utils에 남길지 상위로 올릴지
- [ ] React 의존 추가 금지

**V1 참조**: [`frontend/packages/utils`](../../frontend/packages/utils)

### 3. `ui`

- [x] `core` vs `composed` 경계 — `composed/` 단일 (panels 분리 롤백)
- [x] Radix 래퍼·`forwardRef`·CSS module 패턴 — Wave Gate 완료
- [x] `RichTextEditor` — **`@gen-office/html-editor` 별도** (`ui` 미포함)
- [x] Storybook — `apps/storybook-all` 통합 + 패키지 stories
- [x] V1 composed C1~C9 이관 마감 — [packages/ui/.docs/review-log.md](../packages/ui/.docs/review-log.md)

**V1 참조**: [`frontend/packages/ui`](../../frontend/packages/ui)

### 4. `mdi`

- [x] `useMDIStore`(Zustand) 상태 모델 — singleton + `MDIStoreProvider` (2026-06-27)
- [x] `MDIContainer`·TabBar·창 포커스 계약 — P0~P2, Storybook Gate
- [ ] demo `App.tsx` 연동 props (`onOpenPage`, `maxTabs` 등) — **apps/demo** 트랙; mdi 패키지 선행 조건 충족
- [x] `ui`·`theme` 의존 최소화 — `@gen-office/ui` Button, theme CSS side-effect

**V1 참조**: [`frontend/packages/mdi`](../../frontend/packages/mdi)  
**마감 로그**: [`packages/mdi/.docs/review-log.md`](../../packages/mdi/.docs/review-log.md) — 2026-06-27 패키지 리뷰 1차 마감

### 5. `gen-chart` (재작성)

- [ ] V1 `GenChart.tsx` **복사하지 않음**
- [x] 아키텍처·Gate 문서 — [packages/gen-chart/.docs/architecture.md](../packages/gen-chart/.docs/architecture.md), [gates.md](../packages/gen-chart/.docs/gates.md)
- [ ] [05-GEN-CHART.md](./05-GEN-CHART.md) API·Gate C0~C8 순서대로 구현
- [ ] `ChartTokens` — gen-chart `themes/` (theme D4 정렬은 후속)

**V1 참조 (설계·수용 기준)**: [`frontend/docs/gen-chart/`](../../frontend/docs/gen-chart/), `frontend/packages/gen-chart` (코드 이식 금지)

### 6. `gen-datagrid-crud` (합류 시점)

**선행 조건**: 다른 agent의 `gen-datagrid` public API·Gate 8 안정

- [ ] V1 `gen-grid-crud` 기능 gap 분석
- [ ] `GenDataGridCrud` API 설계 문서
- [ ] Excel·i18n·CRUD toolbar 범위

### 7. `gen-datagrid-chart` (합류 시점)

**선행 조건**: `gen-datagrid` + `gen-chart` MVP

- [ ] V1 `gen-grid-chart` 동작을 수용 기준으로만 참고
- [ ] `rangeToChartModel` 등 grid-agnostic 변환 계층

### 8. `apps/storybook-all`

- [ ] V2 패키지 목록에 맞게 story 수집 경로
- [ ] `gen-grid` story 제거
- [ ] 패키지별 검토가 끝난 컴포넌트부터 story 연결

### 9. `apps/demo`

- [ ] shell 우선: `main.tsx`, providers, auth, menu, MDI
- [ ] `gen-grid*` import 제거
- [ ] admin·demo 페이지는 `gen-datagrid-crud` 준비 후 일괄 전환

## 5. 패키지 검토 로그 템플릿

각 패키지 완료 시 `packages/<name>/.docs/review-log.md` (또는 `packages/<name>/.docs/implementation-log.md`)에 기록합니다.

```markdown
## YYYY-MM-DD — <패키지명> 검토 완료

### 판단 요약
- 이식: ...
- 수정 이식: ...
- 재작성: ...
- 제외: ...

### public API 변경
- (없음 / 목록)

### 미결·보류
- ...

### 검증
- [ ] build
- [ ] storybook (해당 시)
- [ ] 하위 패키지 의존 확인
```

## 6. 다른 agent(gen-datagrid)와의 합류

| 시점 | 본 트랙 (패키지 검토) | gen-datagrid 트랙 |
| --- | --- | --- |
| 초기 | theme → utils → ui → mdi 진행 | Gate 8·API 안정화 |
| 중기 | gen-chart 재작성 (병렬 가능) | gen-datagrid-crud 설계 입력 제공 |
| 후기 | gen-datagrid-crud 구현 | gen-datagrid-chart·demo 그리드 화면 연동 |

합류 전에 맞춰야 할 계약:

- `GenDataGrid` public props·`GenDataGridHandle`
- column meta 타입명 (`GenDataGridColumnMeta`)
- CSS export 경로 (`@gen-office/gen-datagrid/index.css`)

## 7. 로드맵과의 관계

- 전체 Phase 일정: [04-ROADMAP.md](./04-ROADMAP.md)
- 본 문서는 **Phase 0~4 중 패키지 이식·검토 트랙**의 상세 순서입니다.
- `gen-datagrid` Phase 1a는 다른 agent 담당으로 [04-ROADMAP.md](./04-ROADMAP.md)와 병렬 표기합니다.

## 8. 관련 문서

- [03-V1-RELATIONSHIP.md](./03-V1-RELATIONSHIP.md) — 이식·제외 매트릭스
- [05-GEN-CHART.md](./05-GEN-CHART.md) — gen-chart 재작성
- [02-ARCHITECTURE.md](./02-ARCHITECTURE.md) — 패키지 책임·의존 방향

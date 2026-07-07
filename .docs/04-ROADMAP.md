# GenOffice V2 로드맵

V1 [`frontend`](../../frontend)에서 `genoffice-v2`로 이전하기 위한 단계별 계획입니다.

## Phase 개요

작업은 **두 트랙**으로 병렬 진행합니다.

```text
[트랙 A — gen-datagrid]  gen-datagrid Gate 0~9 ✅ · gen-datagrid-crud Gate 10~11 ✅
[트랙 B — 직접 검토]       theme → utils → ui → mdi → gen-chart → gen-frame → demo shell/chart

합류: demo D4 admin (진행 중) → gen-datagrid-chart → D5 Actuals
```

```text
Phase 0   스캐폴딩·기반 이식                    ✅
   ↓
Phase 1a  gen-datagrid Gate 0~9               ✅ (V2 workspace)
   ‖
Phase 1b  theme → utils → ui → mdi           ✅
   ‖ (병렬)
Phase 1c  gen-chart C0~C4                     ✅
   ↓
Phase 2   gen-datagrid-crud Gate 10~11        ✅
   ‖ (병렬)
Phase 2b  gen-chart C5~C7                     ✅
   ↓
Phase 3   demo admin 핵심 화면 (그리드)         ← 진행 중 (D4)
   ↓
Phase 4   gen-datagrid-chart + D5 + 정리
   ↓
Phase 5   (선택) React 19, Storybook 10, E2E
```

---

## Phase 0 — 스캐폴딩

**목표**: 빌드 가능한 V2 워크스페이스 골격 확보

### 작업

- [x] `frontend` → `genoffice-v2` 복제
- [x] `packages/gen-grid`, `gen-grid-crud`, `gen-grid-chart` 제거
- [x] V1 `packages/gen-chart` **코드 이식 안 함** — V2 재작성
- [x] 루트·앱 `package.json`에서 레거시 workspace 의존 제거
- [x] 루트 `package.json` name을 `genoffice-v2`로 변경
- [x] `pnpm install && pnpm build` 통과
- [x] 루트 `README.md`, `.docs/` (본 문서군) 반영
- [x] `AGENTS.md` V2 기준으로 작성

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

- [x] `packages/tsconfig` 이식
- [x] `packages/theme` 검토·이식
- [x] `packages/utils` 검토·이식
- [x] `packages/ui` 검토·이식
- [x] `packages/mdi` 검토·이식
- [x] 패키지별 `.docs/review-log.md` 기록

### 완료 기준

- 위 4개 패키지 `pnpm build` 통과
- `ui` Storybook 또는 `apps/storybook`에서 core 컴포넌트 smoke

### 예상 기간

2~3주 (검토 깊이에 따라 가변)

---

## Phase 1a — gen-datagrid Gate 0~9 ✅

**목표**: `gen-grid` 대체 후보로 평가 가능한 MVP 완성

**상태**: V2 workspace 이관 완료 (2026-06-29). Gate 0~8 MVP 표면 + Gate 9 `GenDataGridHandle` API.

Gate 정의: [packages/gen-datagrid/.docs/README.md](../packages/gen-datagrid/.docs/README.md), [remaining-work-plan.md](../packages/gen-datagrid/.docs/plan/remaining-work-plan.md)

### 작업

- [x] div renderer contract, keyboard, selection, editing, pinning, filter/footer, virtualization
- [x] master-detail, tree, merge/span, system columns 등 Gate 8.x 표면
- [x] `GenDataGridHandle` — `getData`, `getChangeSet`, `acceptChanges`, `flushEditing`
- [x] `pnpm -C packages/gen-datagrid test` — baseline 17 + interaction 181
- [ ] demo·Storybook 시나리오를 gen-grid 주요 story와 parity 수준으로 재현 (일부 진행)

### 완료 기준

- [x] Gate 0~9 체크리스트 항목 충족
- [x] table 태그 미사용 (baseline test 유지)

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

## Phase 2 — gen-datagrid-crud ✅ (Gate 10~11)

**목표**: V1 `gen-grid-crud` 역할을 GenDataGrid 기준으로 재구현

**상태**: V2 workspace 이관 완료. Gate 12 문서(migration·QA guide) ✅. demo admin 연동은 Phase 3.

### 작업

- [x] `packages/gen-datagrid-crud` 패키지 생성·이관
- [x] `GenDataGridCrud` public API — [gen-datagrid-crud-package-design.md](../packages/gen-datagrid-crud/.docs/gen-datagrid-crud-package-design.md)
- [x] Gate 10 thin shell, Gate 11 mutation workflow
- [x] Storybook + interaction test (9 tests)
- [ ] demo `package.json` 의존성·admin 페이지 연동 (Phase 3)

### 완료 기준

- [x] UserManagement에 필요한 최소 CRUD API 제공
- [x] `gen-datagrid`만 의존 (gen-grid 없음)

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

## Phase 3 — demo 핵심 화면 포팅 ← **현재**

**목표**: reference CRUD·도메인 화면을 GenDataGrid로 전환

**선행 완료:** `gen-datagrid` Gate 0~9 ✅, `gen-datagrid-crud` Gate 10~11 ✅  
**블로커 해소:** 패키지 이관 완료. demo `package.json`에 grid dep·admin 페이지 이관 **미착수**.

**demo 구현 Plan:** [apps/demo/.docs/plan.md](../apps/demo/.docs/plan/plan.md) — D0~D3 ✅, D4 admin (진행 중)

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
| M0 | 빌드 가능한 genoffice-v2 스캐폴딩 | ✅ |
| M1 | gen-datagrid Gate 0~9 pass | ✅ |
| M1b | gen-chart C4 (cartesian) pass | ✅ |
| M2 | gen-datagrid-crud Gate 10~11 | ✅ |
| M2b | gen-chart C7 (pie, responsive) pass | ✅ |
| M3 | admin 5+ 화면 GenDataGrid 전환 | ← 진행 중 |
| M4 | **V2 MVP** — gen-grid zero, V1 GenChart zero, full demo | |

---

## 관련 문서

- [01-OVERVIEW.md](./01-OVERVIEW.md)
- [02-ARCHITECTURE.md](./02-ARCHITECTURE.md)
- [03-V1-RELATIONSHIP.md](./03-V1-RELATIONSHIP.md)
- [05-GEN-CHART.md](./05-GEN-CHART.md)
- [06-PACKAGE-REVIEW-PLAN.md](./06-PACKAGE-REVIEW-PLAN.md)

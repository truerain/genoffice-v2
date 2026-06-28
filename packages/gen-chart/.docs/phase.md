<!--
 @file packages/gen-chart/.docs/phase.md
 @description Package Phase 1 closure and Phase 2 backlog for @gen-office/gen-chart.

 @created 2026-06-27

 @remark
 - Phase 1 = Gate C0~C7 (차트 엔진 MVP)
 - Phase 2 = C8 + 연동·고급 기능 — 다른 패키지 완료 후 착수
-->
# gen-chart 구현 Phase

패키지 리뷰 트랙 기준 **Phase 1을 여기서 마감**합니다. 이후 작업은 **Phase 2**로 묶고, `gen-datagrid` · `gen-datagrid-crud` · `apps/demo` · `gen-datagrid-chart` 등 선행 패키지가 준비된 뒤 합류합니다.

## Phase 1 — 차트 엔진 MVP ✅ (2026-06-27 마감)

**범위:** headless core + composable React + Storybook 수용 기준. **demo 앱·grid 연동 없음.**

| Gate | 내용 | 상태 |
| --- | --- | --- |
| C0 | scaffold, export, CSS | ✅ |
| C1 | cartesian core (domain, geometry, hit-test) | ✅ |
| C1.5 | polar core | ✅ |
| C2 | `useGenChart`, layout, context | ✅ |
| C3 | grid, axis, empty state | ✅ |
| C4 | line, bar, area, grouped/stacked | ✅ |
| C5 | pie, donut | ✅ |
| C6 | tooltip, legend toggle | ✅ |
| C6b | lifecycle motion enter | ✅ |
| C7 | `ResponsiveChartContainer`, dashboard Storybook | ✅ |

**검증 (마감 시점):**

```bash
pnpm -C packages/gen-chart test   # 78 tests
pnpm -C packages/gen-chart build
```

**Storybook:** `GenChart/CartesianPrimitives`, `CartesianSeries`, `PolarSeries`, `Interaction`, `Motion`, `Responsive`, `Dashboard`

**V1 수용 기준 (Storybook으로 대체):**

| V1 demo 페이지 | Phase 1 대응 |
| --- | --- |
| `ChartDemoPage` (line/bar/area/composed/pie/donut) | `GenChart/CartesianSeries`, `PolarSeries`, `Interaction`, `Motion` |
| `DashboardDemoPage` (카드 내 responsive) | `GenChart/Dashboard`, `GenChart/Responsive` |

---

## Phase 2 — 연동·확장 (보류)

**착수 조건 (모두 충족 후):**

1. `gen-datagrid` public API · Gate 8 안정
2. `gen-datagrid-crud` (또는 demo 그리드 화면) 최소 smoke
3. `apps/demo` scaffold 존재
4. `gen-datagrid-chart` 패키지 scaffold

**합류 순서 (권장):**

```text
gen-datagrid MVP
  → gen-datagrid-crud + apps/demo (grid 화면)
  → gen-datagrid-chart (rangeToChartOptions)
  → gen-chart Phase 2 (C8 + backlog)
```

### 2.1 Gate C8 — demo · grid 연동

| 항목 | 패키지 | 비고 |
| --- | --- | --- |
| `rangeToChartOptions` | `gen-datagrid-chart` | grid selection → `CartesianChartOptions` |
| preview dialog | `gen-datagrid-chart` | `ChartRoot` + composable preset |
| `ChartDemoPage` | `apps/demo` | V2 composable API |
| `DashboardDemoPage` | `apps/demo` | C7 Storybook 패턴 재사용 |
| Actuals 등 range chart | `apps/demo` | grid + chart 통합 |

상세: [gates.md §C8](./gates.md#c8--demo-통합-phase-2)

### 2.2 Motion · interaction (Phase 2)

상세: [motion.md](./motion.md)

| 항목 | 계층 |
| --- | --- |
| line point hover 확대 | `interactive.emphasis` |
| bar click 강조 | `interactive.selection` |
| legend toggle fade/scale | `interactive.visibilityMotion` |
| `staggerMs`, path morph, exit, `y-tween` | lifecycle / visibility |

### 2.3 차트 종류·기능 backlog

| 항목 | 비고 |
| --- | --- |
| `treemap` | `@visx/hierarchy`, `TreemapChart` |
| `crosshair` | `interactive.crosshair` |
| dual Y axis | `yAxisId` 타입 reserved |
| bar `overlay` layout | C4 backlog |
| `SimpleCartesianChart` | L3 convenience (필요 시) |
| ChartTokens ↔ theme D4 정렬 | 수동 정렬 → 자동화 검토 |
| downsampling (10k+) | 오픈 이슈 |

---

## 패키지 리뷰 상태

| Phase | 패키지 리뷰 | 다음 액션 |
| --- | --- | --- |
| **Phase 1** | **마감** — C0~C7, Storybook 수용 기준 충족 | 다른 패키지 리뷰 계속 (`gen-chart` 코드 변경 최소화) |
| **Phase 2** | 보류 | grid·demo·`gen-datagrid-chart` 준비 후 C8부터 재개 |

관련: [`.docs/06-PACKAGE-REVIEW-PLAN.md`](../../../.docs/06-PACKAGE-REVIEW-PLAN.md) · [`.docs/04-ROADMAP.md`](../../../.docs/04-ROADMAP.md) Phase 4

---

## Gate ↔ Phase 매핑

```text
Phase 1 (마감)  → C0, C1, C1.5, C2, C3, C4, C5, C6, C6b, C7
Phase 2 (보류)  → C8, motion 고급, treemap, crosshair, …
```

이전 문서의 “구현 Phase 0~5”(스캐폴드→core→render→…)는 **Phase 1 내부 일정**이었습니다. 이후 문서에서는 **패키지 Phase 1 / Phase 2** 용어를 우선합니다.

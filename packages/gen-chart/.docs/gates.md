<!--
 @file packages/gen-chart/.docs/gates.md
 @description Quality gates C0~C8 for @gen-office/gen-chart implementation.

 @created 2026-06-27

 @remark
 - Pattern: gen-datagrid Gate, mdi review-plan Gate
 - C1 green 전까지 SVG 렌더 착수 금지
-->
# @gen-office/gen-chart 품질 Gate

gen-datagrid Gate 패턴을 따릅니다. **Gate는 순서를 강제합니다.** 이전 Gate 통과 전 다음 단계 착수를 하지 않습니다.

## Phase 상태 (2026-06-27)

| Phase | Gate | 상태 |
| --- | --- | --- |
| **Phase 1** — 차트 엔진 MVP | C0 ~ C7 | ✅ **마감** |
| **Phase 2** — 연동·확장 | C8 + backlog | ⏸ 보류 (선행 패키지 완료 후) |

상세: [phase.md](./phase.md)

## 공통 검증 명령

| 단계 | 명령 | 통과 기준 |
| --- | --- | --- |
| 단위 test | `pnpm -C packages/gen-chart test` | 해당 Gate 범위 green |
| 빌드 | `pnpm -C packages/gen-chart build` | `dist/`, d.ts, `index.css`, TS error 0 |
| Storybook | `pnpm -C apps/storybook-all dev` | 해당 Gate story 체크리스트 |
| monorepo | `pnpm build` | turbo chain gen-chart 포함 |

---

## Gate 요약

| Gate | 목표 | 선행 |
| --- | --- | --- |
| **C0** | 패키지 scaffold, public export stub, CSS | — |
| **C1** | `createCartesianModel` — domain, visibility, warnings, hit-test | C0 |
| **C1.5** | `createPolarModel` + polar hit-test | C1 |
| **C2** | `useGenChart`, `computePlotArea`, legend reserve | C1 |
| **C3** | Cartesian grid / axis, empty state | C2 |
| **C4** | Line, Bar, Area (+ stacked / grouped) | C3 |
| **C5** | Pie, Donut | C1.5, C2 |
| **C6** | Tooltip, legend toggle → domain 재계산 | C4 |
| **C6b** | Motion enter + reduced-motion + changeKey | C6 |
| **C7** | ResponsiveChartContainer, dashboard 카드 시나리오 | C6 |
| **C8** | demo Chart + Dashboard · `gen-datagrid-chart` | Phase 2 — C7, grid MVP, demo |

---

## C0 — Scaffold

**완료 조건**

- [x] `packages/gen-chart` vite lib build, vitest, tsconfig
- [x] `src/index.ts` public export stub (types + placeholder components)
- [x] `src/index.css` side-effect import
- [x] `.docs/architecture.md`, `gates.md` 존재

**검증:** `pnpm -C packages/gen-chart build` · `pnpm -C packages/gen-chart test` — 2026-06-27 통과

---

## C1 — Cartesian core (SVG 없음)

**완료 조건**

- [x] `core/warnings.ts` — `GC001`~`GC005`
- [x] `normalizeSeries` — duplicate id, empty finite y
- [x] `computeXDomain` / `computeYDomain` — auto, dataMin/Max, Date
- [x] `createXScale` / `createYScale` — d3-scale (`createCartesianScales`), React·visx 무관
- [x] `geometry/cartesian/*` — line, bar, area 순수 geometry
- [x] `hit-test/cartesianNearest`
- [x] `createCartesianModel` — `toggleSeries` / `setSeriesVisibility` 시 `visibleSeries`·domain 즉시 재계산
- [x] `getNearestDatum` — null이 아닌 실제 결과 (V1 pending D1 해소)

**검증:** `pnpm -C packages/gen-chart test` (core 16 tests) — 2026-06-27 통과

**규칙:** C1 미통과 시 `internal/visx`, series 컴포넌트 착수 금지.

---

## C1.5 — Polar core

**완료 조건**

- [x] `geometry/polar/pieArcs`
- [x] `createPolarModel`
- [x] polar `getNearestDatum`

**검증:** `pnpm -C packages/gen-chart test` (core 23 tests) — 2026-06-27 통과

---

## C2 — Hook + layout

**완료 조건**

- [x] `useGenChart` — options + width/height → model + layout metrics
- [x] `computePlotArea` — padding, legend reserve
- [x] `ChartContext` / `PlotContext` provider

**검증:** `pnpm -C packages/gen-chart test` (hook + layout tests) — 2026-06-27 통과

---

## C3 — Cartesian primitives

**완료 조건**

- [x] `ChartRoot`, `CartesianChart`, `CartesianPlot`
- [x] `ChartGrid`, `ChartXAxis`, `ChartYAxis`
- [x] 빈 series / invalid size dev warning Storybook

**검증:** `GenChart/CartesianPrimitives` Storybook · `pnpm -C packages/gen-chart test` — 2026-06-27 통과

---

## C4 — Series

**완료 조건**

- [x] `LineSeries`, `BarSeries`, `AreaSeries`
- [x] composed — 시리즈별 `type` (chart-level `kind` 없음)
- [x] bar `grouped` / `stacked` (overlay는 C4 후반 또는 backlog 명시)
- [x] geometry 단위 테스트와 Storybook 시각 일치

**검증:** `GenChart/CartesianSeries` Storybook · `pnpm -C packages/gen-chart test` — 2026-06-27 통과

**backlog:** bar `overlay` layout

---

## C5 — Polar render

**완료 조건**

- [x] `PolarChart`, `PieSeries`, `DonutSeries`
- [x] Storybook pie / donut

---

## C6 — Interaction

**완료 조건**

- [x] `ChartTooltip` — `getNearestDatum` 기반
- [x] `ChartLegend` — toggle → model visibility → yDomain 재계산
- [x] interaction test (legend toggle, tooltip pointer)

---

## C6b — Motion

**완료 조건**

- [x] `ChartMotionOptions` — `mode: enter | reset-on-change | none`
- [x] CSS enter keyframes (`index.css`) — line, bar, area, pie
- [x] `prefers-reduced-motion` → 비활성
- [x] 대용량(시리즈 포인트 합 ≥ 2000) 자동 비활성 + `GC006` dev warn
- [x] hit-test는 **목표 geometry** 기준 (motion 중 tooltip 안정)

**제외 (Phase 2):** emphasis, selection, visibility motion — [motion.md](./motion.md)

**검증:** Storybook motion + reduced-motion story

---

## Motion · interaction animation (Phase 2)

상세: [motion.md](./motion.md) · [phase.md §2.2](./phase.md#22-motion--interaction-phase-2)

| 항목 | 계층 | 비고 |
| --- | --- | --- |
| line point hover 확대 | `interactive.emphasis` | tooltip nearest 공유 |
| bar click 강조 / dim | `interactive.selection` | core geometry 불변 |
| legend toggle fade·scale | `interactive.visibilityMotion` | C6 instant 기본 유지 |
| `staggerMs` | lifecycle `motion` | pie 30ms 하드코딩 통합 |
| path morph, exit, `y-tween` | lifecycle / visibility | 연구 스파이크 후 결정 |

---

## C7 — Responsive + dashboard

**완료 조건**

- [x] `ResponsiveChartContainer` (ResizeObserver)
- [x] dashboard 카드 레이아웃 내 cartesian Storybook (V1 `DashboardDemoPage` 수용 기준)

**검증:** `GenChart/Responsive`, `GenChart/Dashboard` Storybook · `resolveResponsiveSize` + container test

---

## C8 — Demo 통합 (Phase 2)

**상태:** ⏸ 보류 — `apps/demo`, `gen-datagrid` MVP, `gen-datagrid-chart` 선행 필요

**선행:**

- `gen-datagrid` public API · Gate 8 안정
- `gen-datagrid-chart` scaffold
- `apps/demo` scaffold

**완료 조건**

- [ ] `rangeToChartOptions` (`gen-datagrid-chart`)
- [ ] demo `ChartDemoPage`, `DashboardDemoPage` V2 API 전환
- [ ] treemap — Phase 2 backlog (C8 본문 제외)

**참고:** Phase 1에서 V1 수용 기준은 Storybook (`GenChart/Dashboard` 등)으로 검증 완료.

---

## Dev warning 코드

prefix: `[gen-chart]` · development only

| Code | 조건 |
| --- | --- |
| `GC001_EMPTY_SERIES` | `series.length === 0` |
| `GC002_INVALID_WIDTH` | `width <= 0` |
| `GC003_INVALID_HEIGHT` | `height <= 0` |
| `GC004_DUPLICATE_SERIES_ID` | 중복 `series.id` |
| `GC005_NO_FINITE_Y` | cartesian 시리즈에 유효 y 없음 |
| `GC006_MOTION_DISABLED_LARGE_DATA` | 포인트 합 ≥ 2000으로 motion 자동 비활성 |

---

## 구현 Phase ↔ Gate 매핑

**패키지 Phase (정본):** [phase.md](./phase.md)

```text
Phase 1 (마감)  → C0 ~ C7
Phase 2 (보류)  → C8, motion 고급, treemap, crosshair, …
```

<details>
<summary>Phase 1 내부 일정 (참고)</summary>

```text
C0 scaffold → C1/C1.5 core → C2~C4 cartesian render → C5~C6 polar+chrome → C6b~C7 motion+responsive
```

</details>

상세 일정: [`.docs/04-ROADMAP.md`](../../../.docs/04-ROADMAP.md)

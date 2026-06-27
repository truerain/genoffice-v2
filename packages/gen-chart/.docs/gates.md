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
| **C8** | demo Chart + Dashboard 페이지 전환 | C7, gen-datagrid-chart |

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

- [ ] `geometry/polar/pieArcs`
- [ ] `createPolarModel`
- [ ] polar `getNearestDatum`

**검증:** vitest core

---

## C2 — Hook + layout

**완료 조건**

- [ ] `useGenChart` — options + width/height → model + layout metrics
- [ ] `computePlotArea` — padding, legend reserve
- [ ] `ChartContext` / `PlotContext` provider

**검증:** hook unit test

---

## C3 — Cartesian primitives

**완료 조건**

- [ ] `ChartRoot`, `CartesianChart`, `CartesianPlot`
- [ ] `ChartGrid`, `ChartXAxis`, `ChartYAxis`
- [ ] 빈 series / invalid size dev warning Storybook

**검증:** Storybook cartesian primitives

---

## C4 — Series

**완료 조건**

- [ ] `LineSeries`, `BarSeries`, `AreaSeries`
- [ ] composed — 시리즈별 `type` (chart-level `kind` 없음)
- [ ] bar `grouped` / `stacked` (overlay는 C4 후반 또는 backlog 명시)
- [ ] geometry 단위 테스트와 Storybook 시각 일치

**검증:** vitest geometry + Storybook line/bar/area/composed/stacked

---

## C5 — Polar render

**완료 조건**

- [ ] `PolarChart`, `PieSeries`, `DonutSeries`
- [ ] Storybook pie / donut

---

## C6 — Interaction

**완료 조건**

- [ ] `ChartTooltip` — `getNearestDatum` 기반
- [ ] `ChartLegend` — toggle → model visibility → yDomain 재계산
- [ ] interaction test (legend toggle, tooltip pointer)

---

## C6b — Motion

**완료 조건**

- [ ] `ChartMotionOptions` — `mode: enter | reset-on-change | none`
- [ ] CSS enter keyframes (`index.css`) — line, bar, area, pie
- [ ] `prefers-reduced-motion` → 비활성
- [ ] 대용량(시리즈 포인트 합 ≥ 2000) 자동 비활성 + `GC006` dev warn
- [ ] hit-test는 **목표 geometry** 기준 (motion 중 tooltip 안정)

**제외 (Phase 2):** update path morph, exit animation, legend toggle yDomain tween

**검증:** Storybook motion + reduced-motion story

---

## C7 — Responsive + dashboard

**완료 조건**

- [ ] `ResponsiveChartContainer` (ResizeObserver)
- [ ] dashboard 카드 레이아웃 내 cartesian Storybook (V1 `DashboardDemoPage` 수용 기준)

---

## C8 — Demo 통합

**선행:** `gen-datagrid-chart` scaffold, grid MVP

**완료 조건**

- [ ] `rangeToChartOptions` (gen-datagrid-chart)
- [ ] demo `ChartDemoPage`, `DashboardDemoPage` V2 API 전환
- [ ] treemap — **본 Gate 제외** (차트 Phase 2)

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

```text
Phase 0 (기반)     → C0
Phase 1 (core)     → C1, C1.5
Phase 2 (cartesian render) → C2, C3, C4
Phase 3 (polar + chrome)   → C5, C6
Phase 4 (motion + responsive) → C6b, C7
Phase 5 (통합)     → C8
```

상세 일정: [`.docs/04-ROADMAP.md`](../../../.docs/04-ROADMAP.md)

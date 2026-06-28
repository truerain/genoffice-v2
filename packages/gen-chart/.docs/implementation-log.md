<!--
 @file packages/gen-chart/.docs/implementation-log.md
 @description Implementation and design change log for @gen-office/gen-chart.

 @created 2026-06-27
-->
# @gen-office/gen-chart 구현 로그

## 2026-06-27

### Motion · interaction animation 계층 정의

- **lifecycle** (`motion`) — C6b enter; core 무관
- **emphasis** (`interactive.emphasis`) — hover overlay; Phase 2
- **selection** (`interactive.selection`) — click 유지 강조; Phase 2
- **visibility** (`interactive.visibilityMotion`) — legend toggle 연출; C6은 instant 재계산만
- **`ChartMotionOptions`에 상호작용 모션 통합 금지** — 정책·트리거 분리
- **지금 구현:** 없음 (문서만); C7 responsive 우선
- 문서: `packages/gen-chart/.docs/motion.md`, `architecture.md` §7

### Gate C6b — Motion enter

- **요약:** CSS enter keyframes (line dash, bar scaleY, area fade, pie scale), `resolveChartMotion` / `useChartMotion`, `reset-on-change` via render key
- **정책:** `prefers-reduced-motion` 비활성, 포인트 ≥ 2000 → `GC006` + motion off; hit-test는 core geometry 유지
- **모듈:** `react/motion/*`, series motion classes, `index.css` keyframes
- **Storybook:** `GenChart/Motion` (enter, reset-on-change, disabled, pie)
- **검증:** motion test 7건, 전체 73건 통과
- **다음:** Gate C7 — responsive + dashboard

### Gate C6 — Tooltip / legend interaction

- **요약:** `ChartTooltip` (`getNearestDatum` + plot hit layer), `ChartLegend` (toggle → visibility → yDomain 재계산)
- **모듈:** `react/components/chrome/*`, `useInteractiveChart`, `resolveInteractiveOptions`
- **수정:** `ChartRoot`/`PolarChart` hook options `useMemo` — legend toggle 시 model 재생성 방지
- **tooltip 위치:** `resolveTooltipPosition` — 측정 후 flip/clamp (우·하 overflow 시 좌·상)
- **tooltip hit layer:** 전체 차트 영역(`inset: 0`) + legend absolute 배치 — x축 구간에서 사라지던 문제 수정
- **Storybook:** `GenChart/Interaction`
- **검증:** interaction + position test, 전체 65건 통과
- **다음:** Gate C6b — motion

### Gate C5 — Polar series render

- **요약:** `PolarChart` + `usePolarChart` + `PolarPlot` + `PieSeries`/`DonutSeries` SVG render from core arc geometry
- **모듈:** `react/hooks/usePolarChart.ts`, `react/context/PolarChartContext.tsx`, `react/components/polar/*`, `resolveSliceColor`
- **모델:** `PolarChartModel`에 `geometries`, `polarLayout` 노출
- **Storybook:** `GenChart/PolarSeries` (pie, donut, thin ring)
- **검증:** polar series test 추가, test/build green
- **다음:** Gate C6 — tooltip/legend interaction

### Area baseline — x축 정렬 수정

- **요약:** y domain에 0이 없을 때 area fill baseline을 `yScale(0)` → `yDomain min`(x축)으로 변경
- **모듈:** `core/geometry/cartesian/areaPath.ts` — `resolveAreaBaselineY`
- **검증:** geometry test 추가, test green

### Gate C4 — Cartesian series render

- **요약:** `LineSeries`, `BarSeries`, `AreaSeries` SVG render from core geometry; composed; bar grouped/stacked
- **모듈:** `react/components/cartesian/*Series.tsx`, `resolveSeriesColor`, `CartesianChartModel.geometries`
- **domain:** visible bar 시 y domain에 0 baseline 포함 (min 미지정 시)
- **Storybook:** `GenChart/CartesianSeries` (line, bar grouped/stacked, area, composed)
- **검증:** test 48건 통과, build green
- **다음:** Gate C5 — polar render
- **backlog:** bar `overlay` layout

### Y축 domain nice 기본 정책

- **요약:** `applyAxisBounds` 기본값을 5% padding → d3-scale `.nice()` tick-aligned domain으로 변경
- **API:** `ChartAxisOptions.min/max`에 `'nice'` 추가; `'auto'`·미지정과 동일; `'dataMin'`/`'dataMax'`/숫자는 exact bound
- **미포함:** bar `min: 0` 자동 — Gate C4
- **검증:** test 43건 통과

### Gate C3 — Cartesian primitives

- **요약:** `CartesianPlot` SVG shell, `ChartGrid` / `ChartXAxis` / `ChartYAxis` (visx internal), empty state, Storybook
- **모듈:** `internal/visx/*`, `react/components/cartesian/*`, `CartesianChartModel`에 `scales`/`xDomain`/`yDomain` 노출
- **의존성:** `@visx/axis`, `@visx/grid`, `@visx/group`
- **후속:** visx axis/grid — `createPlotLocalScales` plot-local 좌표 (core geometry는 절대 좌표 유지)
- **검증:** test 39건 통과, build green, Storybook `GenChart/CartesianPrimitives`
- **다음:** Gate C4 — Line, Bar, Area series render

### Gate C2 — Hook + layout

- **요약:** `useGenChart`, legend reserve in `computePlotArea`, `ChartContext` / `PlotContext` provider
- **모듈:** `core/layout/computePlotArea` (legend reserve), `react/hooks/useGenChart`, `react/context/*`, `ChartRoot` / `CartesianChart` wiring
- **검증:** test 34건 통과, build green
- **다음:** Gate C3 — cartesian primitives (grid, axis)

### Gate C1.5 — Polar headless core

- **요약:** `createPolarModel` 구현 — normalize, polar layout, pie/donut arc geometry, polar hit-test, visibility toggle
- **모듈:** `core/normalizePolarSeries`, `core/layout/computePolarLayout`, `core/geometry/polar/pieArcs`, `core/hit-test/polarNearest`, `core/model/computePolarState`
- **타입:** `PolarChartModel`에 `visibleSeries`, `plotArea` 추가 (cartesian과 동일 패턴)
- **검증:** test 23건 통과, build green
- **다음:** Gate C2 — `useGenChart`, legend reserve

### gen-chart 파일 헤더 @remark 섹션 추가

- AGENTS.md 규칙: `@remark` 섹션을 내용 유무와 관계없이 모든 소스·테스트·config 헤더에 추가 (47파일)
- 기존 4파일(`index.ts`, `createCartesianModel.ts`, `vite.config.ts`, `index.css`)은 내용 유지

### Gate C1 — Cartesian headless core

- **요약:** `createCartesianModel` 구현 — normalize, domain, d3-scale, geometry, hit-test, visibility toggle
- **의존성:** `d3-scale`, `d3-array`, `d3-shape`
- **모듈:** `core/domain`, `core/scale`, `core/geometry/cartesian`, `core/hit-test`, `core/model/computeCartesianState`
- **검증:** test 16건 통과, build green
- **다음:** Gate C2 — `useGenChart`, legend reserve

### Gate C0 — 패키지 scaffold

- **요약:** `@gen-office/gen-chart` C0 완료 — types, themes, stub core/react, vitest 6건, build green
- **변경 영역:** `packages/gen-chart/src/`, `test/`, `package.json`, vite/vitest/tsconfig
- **파일:** public export `index.ts`, `ChartRoot` stub shell, `ResponsiveChartContainer`, `createCartesianModel`/`useGenChart` Gate throw stub
- **검증:** `pnpm -C packages/gen-chart build`, `pnpm -C packages/gen-chart test` (6 passed)
- **다음:** Gate C1 — `createCartesianModel` core (SVG 없음)

### V2 아키텍처·Gate 설계 문서화

- **요약:** 재사용 차트 엔진 방향으로 패키지 아키텍처·품질 Gate·구현 Phase를 문서에 고정
- **변경 영역:** 패키지 `.docs/` 신규, 저장소 `05-GEN-CHART.md`·`02-ARCHITECTURE.md` 갱신
- **파일:**
  - `packages/gen-chart/.docs/README.md`
  - `packages/gen-chart/.docs/architecture.md`
  - `packages/gen-chart/.docs/gates.md`
  - `packages/gen-chart/.docs/implementation-log.md`
  - `.docs/05-GEN-CHART.md`
  - `.docs/02-ARCHITECTURE.md`
  - `.docs/06-PACKAGE-REVIEW-PLAN.md`
  - `.docs/logs/work-log.md`
- **핵심 결정:**
  - headless core (`d3-scale`) + composable React + visx internal only
  - monolith `GenChart` / `kind` API 미채택; plot별 `CartesianChart` / `PolarChart`
  - motion — core 분리, C6b에서 enter 구현
  - C1 green 전 SVG 렌더 착수 금지
- **다음:** Phase 0 scaffold (C0)

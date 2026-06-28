<!--
 @file packages/gen-chart/.docs/implementation-log.md
 @description Implementation and design change log for @gen-office/gen-chart.

 @created 2026-06-27
-->
# @gen-office/gen-chart 구현 로그

## 2026-06-27

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

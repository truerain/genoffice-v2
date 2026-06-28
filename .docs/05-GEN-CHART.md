# GenChart V2 재설계

## 1. 문서 목적

V2에서 `@gen-office/gen-chart`를 **V1 코드를 이식하지 않고 처음부터 다시 만듭니다.**

목표는 **재사용 가능한 차트 엔진**입니다.

- headless model (L0) — `gen-datagrid-chart`, 단위 테스트
- composable React (L2) — demo·대시보드
- visx는 **internal renderer**만; core는 `d3-scale`

**상세 아키텍처·Gate·구현 Phase**는 패키지 문서를 정본으로 합니다.

| 문서 | 내용 |
| --- | --- |
| [`packages/gen-chart/.docs/phase.md`](../packages/gen-chart/.docs/phase.md) | **Phase 1 마감 / Phase 2 backlog** |
| [`packages/gen-chart/.docs/architecture.md`](../packages/gen-chart/.docs/architecture.md) | 모듈 구조, 상태 모델, Public API, motion, 연동 |
| [`packages/gen-chart/.docs/gates.md`](../packages/gen-chart/.docs/gates.md) | C0~C8, C1.5, C6b 완료 조건 |
| [`packages/gen-chart/.docs/README.md`](../packages/gen-chart/.docs/README.md) | 패키지 문서 목록·V1 참조 경로 |

---

## 2. V1에서 배운 것

### 2.1 문서·구현·소스의 불일치

| 출처 | API 형태 | 상태 |
| --- | --- | --- |
| [`api-draft.md`](../../frontend/docs/gen-chart/api-draft.md) | `CartesianChart` + slot primitives, headless | 설계 초안; scaffold **미구현** |
| [`visx-rewrite-plan.md`](../../frontend/docs/gen-chart/visx-rewrite-plan.md) | `GenChart` + `kind` union | 전환 계획 |
| V1 `GenChart.tsx` | visx monolith (~1,700줄) | demo 사용 중; **CSS enter motion 있음** |

V2는 **api-draft의 composable 방향**을 공식 API로 채택하고, monolith `GenChart`는 채택하지 않습니다.

### 2.2 V1 headless·motion 정정

| 항목 | `api-draft` 기록 | V1 monolith 실제 |
| --- | --- | --- |
| `createGenChartModel` / hit-test | pending (null 반환) | **없음** (monolith) |
| motion | 타입만, runtime 없음 | **CSS enter runtime 있음** (`index.css`) |

V2는 headless를 **처음부터 완성**하고, motion은 **core와 분리**해 재구현합니다.

### 2.3 V2 참고 자료 (코드 이식 X)

| V1 자료 | V2 활용 |
| --- | --- |
| `api-draft.md` | composable API, warning, motion 타입 |
| `chart-tokens.md` | ChartTokens 구조 |
| `visx-rewrite-plan.md` | visx 의존 범위, 차트 kind 목록 |
| demo Chart/Dashboard | **수용 기준** |
| `GenChart.tsx` | axis 옵션, bar layout, enter motion **정책** 참고 |

---

## 3. V2 설계 원칙 (요약)

| 원칙 | 내용 |
| --- | --- |
| API first | 타입·Storybook stub → C1 core 테스트 → SVG 렌더 |
| Headless + composable | `core/` (React·visx 무관) + `react/` + `themes/` |
| Plot 분리 | `CartesianChart` / `PolarChart` — chart-level `kind` 없음 |
| visx internal | `@visx/*`는 `internal/visx`만; core는 `d3-scale` |
| Token-aware | `ChartTokens` — gen-chart 소유, theme CSS와 D4 정렬 예정 |
| C1 before SVG | domain·hit-test green 전 series 렌더 착수 금지 |

### Explicit non-goals

- V1 `GenChart` API 호환
- Recharts 기반 렌더러
- 3D, map, sankey
- 애니메이션 편집기
- 10k+ downsampling (오픈 이슈로만 문서화)

---

## 4. 패키지 구조 (목표)

```text
packages/gen-chart/src/
  types/          public 타입
  core/           domain, scale, geometry, hit-test, model
  themes/         resolveChartTokens, presets
  react/          ChartRoot, plots, chrome, motion
  internal/visx/  renderer adapter (deep import 금지)
```

전체 트리: [architecture.md §3](../packages/gen-chart/.docs/architecture.md#3-디렉터리-구조)

---

## 5. Public API (V2)

### 5.1 Export 계층

| 계층 | 용도 |
| --- | --- |
| L0 Headless | `createCartesianModel`, `CartesianChartOptions` |
| L1 Hook | `useGenChart` |
| L2 Composable | `ChartRoot`, `CartesianChart`, `LineSeries`, … |

### 5.2 Core (Cartesian)

```ts
export interface CartesianChartModel<TDatum> {
  options: CartesianChartOptions<TDatum>;
  visibleSeries: ChartSeries<TDatum>[];
  plotArea: { x: number; y: number; width: number; height: number };
  toggleSeries: (seriesId: string) => void;
  setSeriesVisibility: (seriesId: string, visible: boolean) => void;
  getNearestDatum: (xPx: number, yPx: number) => NearestDatumResult<TDatum> | null;
}

export function createCartesianModel<TDatum>(
  options: CartesianChartOptions<TDatum>,
  layout: { width: number; height: number },
): CartesianChartModel<TDatum>;
```

visibility toggle 시 `visibleSeries`·domain·geometry **즉시 재계산** (V1 pending D1 해소).

### 5.3 React (composable)

```ts
export function ChartRoot<TDatum>(props: ChartRootProps<TDatum>): JSX.Element;
export function ResponsiveChartContainer(props: ResponsiveChartContainerProps): JSX.Element;
export function CartesianChart<TDatum>(props: CartesianChartProps<TDatum>): JSX.Element;
export function PolarChart<TDatum>(props: PolarChartProps<TDatum>): JSX.Element;

// Primitives
export function ChartGrid(): JSX.Element;
export function ChartXAxis(): JSX.Element;
export function ChartYAxis(): JSX.Element;
export function ChartTooltip<T>(): JSX.Element;
export function ChartLegend(): JSX.Element;

// Series
export function LineSeries(props: { seriesId: string }): JSX.Element;
export function BarSeries(props: { seriesId: string }): JSX.Element;
export function AreaSeries(props: { seriesId: string }): JSX.Element;
export function PieSeries(props: { seriesId: string }): JSX.Element;
export function DonutSeries(props: { seriesId: string }): JSX.Element;
```

### 5.4 사용 예

```tsx
<ResponsiveChartContainer minHeight={240}>
  {({ width, height, ready }) =>
    ready ? (
      <ChartRoot
        width={width}
        height={height}
        options={{
          series: [
            { id: 'revenue', type: 'line', data, x: (d) => d.date, y: (d) => d.revenue },
            { id: 'cost', type: 'bar', data, x: (d) => d.date, y: (d) => d.cost },
          ],
          interactive: { tooltip: true, legend: true },
          motion: { mode: 'enter' },
        }}
      >
        <CartesianChart>
          <ChartGrid />
          <ChartXAxis />
          <ChartYAxis />
          <BarSeries seriesId="cost" />
          <LineSeries seriesId="revenue" />
          <ChartTooltip />
          <ChartLegend />
        </CartesianChart>
      </ChartRoot>
    ) : null
  }
</ResponsiveChartContainer>
```

**composed:** chart-level `type` 없음 — 시리즈별 `type: 'line' | 'bar' | 'area'`.

### 5.5 treemap

Phase 2 — `TreemapChart` + `createTreemapModel` (`@visx/hierarchy`).

---

## 6. Dev warning

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

## 7. gen-datagrid-chart

| 패키지 | 책임 |
| --- | --- |
| `gen-chart` | 차트 엔진 |
| `gen-datagrid-chart` | `rangeToChartOptions` → preview dialog |

```ts
export function rangeToChartOptions<T>(input: RangeChartInput<T>): CartesianChartOptions<T>;
```

---

## 8. MVP 범위 (Phase 1 ✅)

**Phase 1 (C0~C7)에 포함·완료.** demo 연동·고급 기능은 [Phase 2](../packages/gen-chart/.docs/phase.md).

| Phase 1 포함 | Phase 2로 이관 |
| --- | --- |
| `line`, `bar`, `area`, composed | `treemap` |
| `pie`, `donut` | dual Y axis |
| tooltip, legend toggle | crosshair |
| `ResponsiveChartContainer` | update morph / exit motion (고급) |
| motion enter (C6b) | emphasis / selection / visibility motion |
| Storybook 수용 기준 | demo `ChartDemoPage` / `DashboardDemoPage` (C8) |
| | `gen-datagrid-chart` 연동 (C8) |

### 수용 기준

| V1 demo | Phase 1 대응 |
| --- | --- |
| `ChartDemoPage` | Storybook `GenChart/CartesianSeries`, `PolarSeries`, … |
| `DashboardDemoPage` | Storybook `GenChart/Dashboard`, `Responsive` |

---

## 9. 품질 Gate

| Gate | 목표 | Phase |
| --- | --- | --- |
| C0 ~ C7 | scaffold → responsive + dashboard Storybook | **Phase 1 ✅** |
| C8 | demo + gen-datagrid-chart | **Phase 2** |

완료 조건·검증 명령: [gates.md](../packages/gen-chart/.docs/gates.md) · Phase 정리: [phase.md](../packages/gen-chart/.docs/phase.md)

---

## 10. 로드맵 내 위치

```text
[완료] gen-chart Phase 1 (C0~C7) — 2026-06-27
[대기] gen-datagrid MVP → crud/demo → gen-datagrid-chart → gen-chart Phase 2 (C8+)
```

상세: [04-ROADMAP.md](./04-ROADMAP.md) · [phase.md](../packages/gen-chart/.docs/phase.md)

---

## 11. 합의된 오픈 이슈 (2026-06-27)

| 이슈 | 결정 |
| --- | --- |
| Date 축 | 기본 `Intl.DateTimeFormat`; `tickFormat` override |
| composed | 시리즈별 `type`; chart-level `type` 없음 |
| dual Y축 | MVP 제외; `yAxisId` reserved |
| motion | C6b — enter + `reset-on-change`; morph는 Phase 2 |
| bar 용어 | API `bar`, 문서 `column` 허용 |
| ChartTokens | gen-chart `themes/` 소유 |

---

## 12. 관련 문서

- [packages/gen-chart/.docs/architecture.md](../packages/gen-chart/.docs/architecture.md)
- [packages/gen-chart/.docs/gates.md](../packages/gen-chart/.docs/gates.md)
- [02-ARCHITECTURE.md](./02-ARCHITECTURE.md)
- [04-ROADMAP.md](./04-ROADMAP.md)
- V1 [`api-draft.md`](../../frontend/docs/gen-chart/api-draft.md)
- V1 [`visx-rewrite-plan.md`](../../frontend/docs/gen-chart/visx-rewrite-plan.md)

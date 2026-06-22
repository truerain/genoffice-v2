# GenChart V2 재설계

## 1. 문서 목적

V2에서 `@gen-office/gen-chart`를 **V1 코드를 이식하지 않고 처음부터 다시 만듭니다.**

V1은 visx 전환 과정에서 API 설계보다 동작 구현을 우선했고, 초안 문서와 실제 구현이 갈라진 상태입니다. V2는 API·headless 모델·패키지 경계를 먼저 고정한 뒤 렌더러를 구현합니다.

## 2. V1에서 배운 것 (이식하지 않을 것)

### 2.1 문서와 구현의 불일치

V1에는 두 가지 API 방향이 동시에 존재했습니다.

| 출처 | API 형태 | 상태 |
| --- | --- | --- |
| [`api-draft.md`](../../frontend/docs/gen-chart/api-draft.md) | `CartesianChart` + `LineSeries` / `BarSeries` + slot primitives | 설계 초안, 구현 미완 |
| [`visx-rewrite-plan.md`](../../frontend/docs/gen-chart/visx-rewrite-plan.md) | `GenChart` 단일 컴포넌트 + `kind` discriminated union | 전환 계획 |
| 실제 `GenChart.tsx` | visx 기반 단일 파일 (~1,700줄) monolith | demo에서 사용 중 |

초안은 **headless + composable**을 목표로 했지만, 실제 코드는 **`GenChart` 단일 진입점**으로 수렴했습니다. V2에서는 이 분기를 해소하고 **하나의 공식 API만** 유지합니다.

### 2.2 미완성 headless 계약

V1 `api-draft.md`의 Phase 1 pending 항목:

- `createGenChartModel`의 `getNearestDatum`이 항상 `null` 반환
- `toggleSeries` / `setSeriesVisibility`가 `visibleSeries`, domain을 재계산하지 않음
- motion 옵션 타입만 있고 runtime 동작 없음

headless API를 공개했다면 동작까지 완성해야 하는데, V1은 공개 surface와 runtime이 맞지 않았습니다.

### 2.3 구조적 부채

- 렌더링·스케일·tooltip·legend·motion이 한 파일에 집중
- `core` / `react` / `themes` 모듈 분리가 문서에만 있고 패키지 구조에 반영되지 않음
- dev warning 표준(`GC001` 등)이 문서화만 되고 일관 적용되지 않음
- 테스트·Storybook gate가 gen-datagrid 대비 얕음

### 2.3 V2에서 가져올 참고 자료 (코드 X)

| V1 자료 | V2 활용 |
| --- | --- |
| `api-draft.md` | headless 타입·composable API·warning code 초안 |
| `visx-rewrite-plan.md` | visx 의존 범위, 차트 kind 목록 |
| `chart-tokens.md` | theme/token 연동 정책 |
| demo `ChartDemoPage`, `DashboardDemoPage` | **수용 기준** — 어떤 시나리오를 다시 지원할지 |
| V1 `GenChart.tsx` | 구현 참고만. **복사 이식 금지** |

## 3. V2 설계 원칙

### API first

1. Public 타입·컴포넌트 시그니처를 문서와 Storybook stub으로 먼저 고정
2. `createGenChartModel` / `useGenChart` 계약을 테스트로 검증한 뒤 SVG 렌더링 착수
3. breaking change는 V2 초기에만 허용. npm 미배포라도 패키지 내부 semver(`0.x`)로 gate 관리

### Headless + composable

- **데이터 계층**: scale, domain, series visibility, hit-test → `core` (React 무관)
- **상태 훅**: `useGenChart` → core model + layout size
- **프레젠테이션**: `CartesianChart`, `ChartGrid`, `LineSeries` 등 → `react`
- **토큰**: `@gen-office/theme` 우선, `ChartTokens` override → `themes`

gen-datagrid가 “TanStack 상태 + div renderer 분리”와 같은 패턴을 따릅니다.

### visx primitives first

- scale / shape / axis / grid / tooltip / group은 visx 조합
- GenChart 고유 로직은 정규화·도메인·legend layout·warning에 집중
- Canvas renderer·서버 export는 MVP 비범위

### Token-aware

- 색상·타이포·spacing은 `packages/theme` 토큰에서 파생
- `theme` prop + `tokens` deep partial override 지원

### Explicit non-goals

- V1 `GenChart` API 호환 레이어
- 3D, map, sankey 등 특수 차트
- 애니메이션 편집기
- 10k+ downsampling (오픈 이슈로 문서화만)

## 4. 목표 패키지 구조

```text
packages/gen-chart/
  src/
    core/           # createGenChartModel, scales, domains, hit-test, warnings
    react/          # CartesianChart, series, primitives, ResponsiveChartContainer
    themes/         # resolveChartTokens, presets
    index.ts        # public export only
  docs/             # API reference, implementation log, chart gates
  test/             # core unit + react interaction
  stories/          # Storybook (또는 storybook-all 연동)
```

Public export는 `index.ts` 한 곳에서만 합니다. renderer 내부 모듈은 deep import 금지.

## 5. 목표 Public API (V2 초안)

V2는 V1 초안(`api-draft.md`)의 **composable 방향**을 공식 채택합니다. V1 monolith `GenChart` 단일 컴포넌트 API는 채택하지 않습니다.

### 5.1 Core

```ts
export type ChartType = 'line' | 'bar' | 'area' | 'pie' | 'donut' | 'composed';

export interface ChartSeriesBase<TDatum> {
  id: string;
  label?: string;
  color?: string;
  data: TDatum[];
  x: (datum: TDatum, index: number) => string | number | Date;
  y: (datum: TDatum, index: number) => number | null | undefined;
  hidden?: boolean;
}

export interface GenChartOptions<TDatum> {
  type?: ChartType;
  series: ChartSeries<TDatum>[];
  xAxis?: ChartAxisOptions;
  yAxis?: ChartAxisOptions;
  padding?: ChartPadding;
  theme?: ChartTheme;
  tokens?: DeepPartial<ChartTokens>;
  interactive?: ChartInteractiveOptions;
}

export interface GenChartModel<TDatum> {
  options: GenChartOptions<TDatum>;
  visibleSeries: ChartSeries<TDatum>[];
  xDomain: [unknown, unknown];
  yDomain: [number, number];
  toggleSeries: (seriesId: string) => void;
  setSeriesVisibility: (seriesId: string, visible: boolean) => void;
  getNearestDatum: (xPx: number, yPx: number) => NearestDatumResult<TDatum> | null;
}

export function createGenChartModel<TDatum>(
  options: GenChartOptions<TDatum>,
): GenChartModel<TDatum>;
```

`createGenChartModel`은 **순수 함수형 snapshot**이 아니라, visibility toggle 시 domain/visibleSeries가 즉시 재계산되는 **동작하는 headless model**이어야 합니다. (V1 pending D1을 V2에서 반드시 해소)

### 5.2 React

```ts
export function useGenChart<TDatum>(
  options: UseGenChartOptions<TDatum>,
): GenChartModel<TDatum> & ChartLayoutMetrics;

export function ResponsiveChartContainer(props: {
  children: (size: { width: number; height: number; ready: boolean }) => React.ReactNode;
  minWidth?: number;
  minHeight?: number;
  aspectRatio?: number;
}): JSX.Element;

export function CartesianChart<TDatum>(props: CartesianChartProps<TDatum>): JSX.Element;

// Primitives (slots)
export function ChartGrid(): JSX.Element;
export function ChartXAxis(): JSX.Element;
export function ChartYAxis(): JSX.Element;
export function ChartTooltip<T>(): JSX.Element;
export function ChartLegend(): JSX.Element;

// Series
export function LineSeries<T>(props: { seriesId: string }): JSX.Element;
export function BarSeries<T>(props: { seriesId: string }): JSX.Element;
export function AreaSeries<T>(props: { seriesId: string }): JSX.Element;
export function PieSeries<T>(props: { seriesId: string }): JSX.Element;
export function DonutSeries<T>(props: { seriesId: string }): JSX.Element;
```

### 5.3 사용 예 (MVP)

```tsx
<ResponsiveChartContainer>
  {({ width, height, ready }) =>
    ready ? (
      <CartesianChart<SalesPoint>
        width={width}
        height={height}
        series={[
          { id: 'revenue', type: 'line', data, x: (d) => d.date, y: (d) => d.revenue, label: 'Revenue' },
          { id: 'cost', type: 'bar', data, x: (d) => d.date, y: (d) => d.cost, label: 'Cost' },
        ]}
        interactive={{ tooltip: true, legend: true }}
      >
        <ChartGrid />
        <ChartXAxis />
        <ChartYAxis />
        <BarSeries seriesId="cost" />
        <LineSeries seriesId="revenue" />
        <ChartTooltip />
        <ChartLegend />
      </CartesianChart>
    ) : null
  }
</ResponsiveChartContainer>
```

### 5.4 treemap

`treemap`은 Cartesian MVP 이후 **Phase 2**로 분리합니다. API는 V1 `TreemapChartProps`를 참고하되 V2 타입으로 재정의합니다.

## 6. Dev warning 표준 (V1 계승·강제 적용)

prefix: `[gen-chart]` · development only

| Code | 조건 |
| --- | --- |
| `GC001_EMPTY_SERIES` | `series.length === 0` |
| `GC002_INVALID_WIDTH` | `width <= 0` |
| `GC003_INVALID_HEIGHT` | `height <= 0` |
| `GC004_DUPLICATE_SERIES_ID` | 중복 `series.id` |
| `GC005_NO_FINITE_Y` | cartesian 시리즈에 유효 y 없음 |

V2에서는 warning helper를 `core/warnings.ts`에 두고, model·render 경로 모두에서 호출합니다.

## 7. gen-datagrid-chart와의 관계

| 패키지 | 책임 |
| --- | --- |
| `gen-chart` | 차트 엔진. grid 무관 |
| `gen-datagrid-chart` | grid selection range → chart model 변환, preview dialog |

`gen-datagrid-chart`는 **새 GenChart API**만 바라봅니다. V1 `gen-grid-chart` / monolith `GenChart` props에 의존하지 않습니다.

변환 계층 예:

```ts
export function rangeToChartModel<T>(input: RangeChartInput<T>): GenChartOptions<T>;
```

## 8. MVP 범위

### V2 Chart MVP (gen-chart)

| 포함 | 제외 |
| --- | --- |
| `line`, `bar`, `area`, `composed` | `treemap` (차트 Phase 2) |
| `pie`, `donut` | motion runtime (타입·hook만 준비 가능) |
| 단일 X/Y axis | dual Y axis |
| tooltip, legend toggle | crosshair (Phase 1.5) |
| `ResponsiveChartContainer` | Canvas renderer |
| SVG 렌더 | server image export |
| theme/token 연동 | 3D·map |

### 수용 기준 (demo)

V1 demo를 reference로 아래 시나리오를 V2 API로 재현:

- `ChartDemoPage`: line, bar, area, composed, pie, donut, (treemap은 Phase 2)
- `DashboardDemoPage`: 카드 레이아웃 내 responsive cartesian charts

## 9. 품질 Gate (초안)

gen-datagrid의 gate 패턴을 차트에도 적용합니다.

| Gate | 목표 |
| --- | --- |
| C0 | 패키지 scaffold, public export, CSS |
| C1 | `createGenChartModel` — domain, visibility, warnings 단위 테스트 |
| C2 | `useGenChart` + layout metrics |
| C3 | Cartesian primitives (grid, axis) Storybook |
| C4 | Line / Bar / Area series |
| C5 | Pie / Donut |
| C6 | Tooltip + Legend interaction |
| C7 | ResponsiveChartContainer + dashboard 시나리오 |
| C8 | demo Chart + Dashboard 페이지 전환 |

## 10. V2 로드맵 내 위치

차트 재작성은 그리드와 **병렬**로 진행할 수 있으나, demo 통합은 그리드 CRUD 이후가 효율적입니다.

```text
Phase 0   gen-chart 패키지 scaffold (빈 API + types + tests)
Phase 1a  gen-datagrid Gate 8        ← 그리드 우선
Phase 1b  gen-chart C1~C4 (core + cartesian)  ← 병렬 가능
Phase 2   gen-datagrid-crud
Phase 2b  gen-chart C5~C7 (pie, responsive)
Phase 3   demo admin 화면 (그리드)
Phase 4   gen-datagrid-chart + Chart/Dashboard demo (C8)
```

상세 일정: [04-ROADMAP.md](./04-ROADMAP.md)

## 11. 오픈 이슈 (V2 착수 전 합의)

1. **Date 축 포맷**: `Intl.DateTimeFormat` 기본 정책 vs 커스텀 formatter only
2. **composed 시리즈**: 별도 `ComposedSeries` vs `type: 'composed'` + `renderAs`
3. **다중 Y축**: MVP 제외 확정 여부
4. **motion**: MVP에서 타입만 vs enter animation 최소 구현
5. **bar layout 용어**: public API는 `bar`, UI 문서에서 column 표현 허용 (V1 계승)

## 12. 관련 문서

- [01-OVERVIEW.md](./01-OVERVIEW.md)
- [02-ARCHITECTURE.md](./02-ARCHITECTURE.md)
- [03-V1-RELATIONSHIP.md](./03-V1-RELATIONSHIP.md)
- [04-ROADMAP.md](./04-ROADMAP.md)
- V1 [`api-draft.md`](../../frontend/docs/gen-chart/api-draft.md)
- V1 [`visx-rewrite-plan.md`](../../frontend/docs/gen-chart/visx-rewrite-plan.md)

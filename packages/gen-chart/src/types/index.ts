/**
 * @file packages/gen-chart/src/types/index.ts
 * @description Public type re-exports for @gen-office/gen-chart.
 * @created 2026-06-27
 *
 * @remark
 */

export type { DeepPartial, Accessor, ChartPadding, ChartTheme } from './common';
export type {
  ChartColorTokens,
  ChartTypographyTokens,
  ChartSpacingTokens,
  ChartBorderTokens,
  ChartMotionTokens,
  ChartTokens,
} from './tokens';
export type {
  CartesianSeriesType,
  ChartSeriesBase,
  LineSeriesDef,
  BarSeriesDef,
  AreaSeriesDef,
  CartesianChartSeries,
  PieSeriesDef,
  DonutSeriesDef,
} from './series';
export type {
  ChartLegendOptions,
  ChartTooltipFormatterContext,
  ChartTooltipOptions,
  ChartInteractiveOptions,
  ChartMotionOptions,
  ChartAxisOptions,
} from './interaction';
export type {
  CartesianChartOptions,
  PolarChartOptions,
  GenChartOptions,
} from './options';
export type {
  PlotArea,
  NearestDatumResult,
  CartesianChartModel,
  PolarChartModel,
  ChartLayoutMetrics,
  UseGenChartResult,
  UsePolarChartResult,
} from './model';

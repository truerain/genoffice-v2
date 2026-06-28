/**
 * @file packages/gen-chart/src/index.ts
 * @description Public entry barrel exports for @gen-office/gen-chart.
 * @created 2026-06-27
 *
 * @remark
 * - Gate C0: types, theme tokens, stub core/react exports
 * - Side-effect: ./index.css
 */
import './index.css';

export { createCartesianModel, createPolarModel } from './core';
export type { CreateCartesianModelLayout, CreatePolarModelLayout } from './core';
export {
  warnEmptySeries,
  warnInvalidWidth,
  warnInvalidHeight,
  warnDuplicateSeriesId,
  warnNoFiniteY,
  warnMotionDisabledLargeData,
} from './core';

export { resolveChartTokens } from './themes/resolveChartTokens';
export { lightChartTokens } from './themes/lightChartTokens';
export { darkChartTokens } from './themes/darkChartTokens';

export { useGenChart } from './react/hooks/useGenChart';
export type { UseGenChartOptions } from './react/hooks/useGenChart';
export { useChartContext } from './react/context/ChartContext';
export type { ChartContextValue } from './react/context/ChartContext';
export { usePlotContext } from './react/context/PlotContext';
export type { PlotContextValue } from './react/context/PlotContext';

export {
  ChartRoot,
  ResponsiveChartContainer,
  CartesianChart,
  CartesianPlot,
  PolarChart,
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
  ChartTooltip,
  ChartLegend,
  LineSeries,
  BarSeries,
  AreaSeries,
  PieSeries,
  DonutSeries,
} from './react/components';

export type {
  ChartRootProps,
  ResponsiveChartContainerProps,
  ResponsiveChartSize,
  CartesianChartProps,
  CartesianPlotProps,
  SeriesProps,
  PolarChartProps,
  PolarSeriesProps,
} from './react/components';

export type {
  DeepPartial,
  Accessor,
  ChartPadding,
  ChartTheme,
  ChartTokens,
  ChartColorTokens,
  ChartTypographyTokens,
  ChartSpacingTokens,
  ChartBorderTokens,
  ChartMotionTokens,
  CartesianSeriesType,
  ChartSeriesBase,
  LineSeriesDef,
  BarSeriesDef,
  AreaSeriesDef,
  CartesianChartSeries,
  PieSeriesDef,
  DonutSeriesDef,
  ChartLegendOptions,
  ChartTooltipFormatterContext,
  ChartTooltipOptions,
  ChartInteractiveOptions,
  ChartMotionOptions,
  ChartAxisOptions,
  CartesianChartOptions,
  PolarChartOptions,
  GenChartOptions,
  PlotArea,
  NearestDatumResult,
  CartesianChartModel,
  PolarChartModel,
  ChartLayoutMetrics,
  UseGenChartResult,
} from './types';

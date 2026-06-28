/**
 * @file packages/gen-chart/src/react/components/index.ts
 * @description React component barrel exports.
 * @created 2026-06-27
 *
 * @remark
 */

export { ChartRoot } from './ChartRoot';
export type { ChartRootProps } from './ChartRoot';
export {
  ResponsiveChartContainer,
} from './ResponsiveChartContainer';
export type {
  ResponsiveChartContainerProps,
  ResponsiveChartSize,
} from './ResponsiveChartContainer';
export {
  CartesianChart,
  CartesianPlot,
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
  LineSeries,
  BarSeries,
  AreaSeries,
} from './cartesian';
export type { CartesianChartProps, CartesianPlotProps, SeriesProps } from './cartesian';
export { PolarChart, PieSeries, DonutSeries } from './polar';
export type { PolarChartProps, PolarSeriesProps } from './polar';
export { ChartTooltip, ChartLegend } from './chrome';

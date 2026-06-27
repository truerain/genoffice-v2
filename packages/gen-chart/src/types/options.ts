/**
 * @file packages/gen-chart/src/types/options.ts
 * @description Top-level chart options for cartesian and polar plots.
 * @created 2026-06-27
 *
 * @remark
 */

import type { ChartPadding, ChartTheme, DeepPartial } from './common';
import type {
  ChartInteractiveOptions,
  ChartMotionOptions,
  ChartAxisOptions,
} from './interaction';
import type { CartesianChartSeries, DonutSeriesDef, PieSeriesDef } from './series';
import type { ChartTokens } from './tokens';

export interface CartesianChartOptions<TDatum> {
  series: CartesianChartSeries<TDatum>[];
  xAxis?: ChartAxisOptions;
  yAxis?: ChartAxisOptions;
  padding?: ChartPadding;
  theme?: ChartTheme;
  tokens?: DeepPartial<ChartTokens>;
  motion?: boolean | ChartMotionOptions;
  interactive?: ChartInteractiveOptions<TDatum>;
}

export interface PolarChartOptions<TDatum> {
  series: Array<PieSeriesDef<TDatum> | DonutSeriesDef<TDatum>>;
  theme?: ChartTheme;
  tokens?: DeepPartial<ChartTokens>;
  motion?: boolean | ChartMotionOptions;
  interactive?: ChartInteractiveOptions<TDatum>;
}

/** @deprecated Use CartesianChartOptions — kept for gen-datagrid-chart naming transition */
export type GenChartOptions<TDatum> = CartesianChartOptions<TDatum>;

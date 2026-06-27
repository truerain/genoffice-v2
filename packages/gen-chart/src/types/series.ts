/**
 * @file packages/gen-chart/src/types/series.ts
 * @description Chart series definition types.
 * @created 2026-06-27
 *
 * @remark
 */

import type { Accessor } from './common';

export type CartesianSeriesType = 'line' | 'bar' | 'area';

export interface ChartSeriesBase<TDatum> {
  id: string;
  label?: string;
  color?: string;
  data: TDatum[];
  x: Accessor<TDatum, string | number | Date>;
  y: Accessor<TDatum, number | null | undefined>;
  hidden?: boolean;
}

export interface LineSeriesDef<TDatum> extends ChartSeriesBase<TDatum> {
  type: 'line';
  curve?: 'linear' | 'monotoneX' | 'step';
  connectNulls?: boolean;
  strokeDasharray?: string;
}

export interface BarSeriesDef<TDatum> extends ChartSeriesBase<TDatum> {
  type: 'bar';
  stackId?: string;
  maxBarWidth?: number;
  layout?: 'grouped' | 'stacked' | 'overlay';
  opacity?: number;
}

export interface AreaSeriesDef<TDatum> extends ChartSeriesBase<TDatum> {
  type: 'area';
  connectNulls?: boolean;
}

export type CartesianChartSeries<TDatum> =
  | LineSeriesDef<TDatum>
  | BarSeriesDef<TDatum>
  | AreaSeriesDef<TDatum>;

export interface PieSeriesDef<TDatum> {
  id: string;
  label?: string;
  color?: string;
  data: TDatum[];
  value: Accessor<TDatum, number | null | undefined>;
  labelKey?: Accessor<TDatum, string>;
  hidden?: boolean;
}

export interface DonutSeriesDef<TDatum> extends PieSeriesDef<TDatum> {
  innerRadiusRatio?: number;
}

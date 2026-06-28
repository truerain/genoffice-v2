/**
 * @file packages/gen-chart/src/types/model.ts
 * @description Headless chart model contracts.
 * @created 2026-06-27
 *
 * @remark
 */

import type { CartesianChartOptions, PolarChartOptions } from './options';
import type { CartesianChartSeries, DonutSeriesDef, PieSeriesDef } from './series';

export interface PlotArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NearestDatumResult<TDatum> {
  seriesId: string;
  datum: TDatum;
  index: number;
  x: string | number | Date;
  value: number | null;
}

export interface CartesianChartModel<TDatum> {
  options: CartesianChartOptions<TDatum>;
  visibleSeries: CartesianChartSeries<TDatum>[];
  plotArea: PlotArea;
  toggleSeries: (seriesId: string) => void;
  setSeriesVisibility: (seriesId: string, visible: boolean) => void;
  getNearestDatum: (xPx: number, yPx: number) => NearestDatumResult<TDatum> | null;
}

export interface PolarChartModel<TDatum> {
  options: PolarChartOptions<TDatum>;
  visibleSeries: Array<PieSeriesDef<TDatum> | DonutSeriesDef<TDatum>>;
  plotArea: PlotArea;
  toggleSeries: (seriesId: string) => void;
  setSeriesVisibility: (seriesId: string, visible: boolean) => void;
  getNearestDatum: (xPx: number, yPx: number) => NearestDatumResult<TDatum> | null;
}

export interface ChartLayoutMetrics {
  width: number;
  height: number;
}

export type UseGenChartResult<TDatum> = CartesianChartModel<TDatum> & ChartLayoutMetrics;

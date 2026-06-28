/**
 * @file packages/gen-chart/src/react/hooks/useInteractiveChart.ts
 * @description Unified cartesian/polar chart context for chrome components (Gate C6).
 * @created 2026-06-27
 *
 * @remark
 * - Exports: useInteractiveChart, InteractiveChartContext
 */

import { useContext } from 'react';
import { ChartContext } from '../context/ChartContext';
import { PolarChartContext } from '../context/PolarChartContext';
import type { NearestDatumResult, PlotArea, UseGenChartResult, UsePolarChartResult } from '../../types/model';
import type { CartesianChartOptions, PolarChartOptions } from '../../types/options';
import type { ChartTokens } from '../../types/tokens';

export type InteractiveChartKind = 'cartesian' | 'polar';

interface InteractiveChartBase<TDatum> {
  kind: InteractiveChartKind;
  plotArea: PlotArea;
  width: number;
  height: number;
  tokens: ChartTokens;
  toggleSeries: (seriesId: string) => void;
  getNearestDatum: (xPx: number, yPx: number) => NearestDatumResult<TDatum> | null;
  isSeriesVisible: (seriesId: string) => boolean;
}

export interface InteractiveCartesianChart<TDatum> extends InteractiveChartBase<TDatum> {
  kind: 'cartesian';
  options: CartesianChartOptions<TDatum>;
  visibleSeries: UseGenChartResult<TDatum>['visibleSeries'];
  yDomain: [number, number];
}

export interface InteractivePolarChart<TDatum> extends InteractiveChartBase<TDatum> {
  kind: 'polar';
  options: PolarChartOptions<TDatum>;
  visibleSeries: UsePolarChartResult<TDatum>['visibleSeries'];
}

export type InteractiveChartContext<TDatum = unknown> =
  | InteractiveCartesianChart<TDatum>
  | InteractivePolarChart<TDatum>;

function fromCartesian<TDatum>(
  chart: UseGenChartResult<TDatum>,
  tokens: ChartTokens,
): InteractiveCartesianChart<TDatum> {
  const visibleIds = new Set(chart.visibleSeries.map((series) => series.id));

  return {
    kind: 'cartesian',
    options: chart.options,
    visibleSeries: chart.visibleSeries,
    plotArea: chart.plotArea,
    width: chart.width,
    height: chart.height,
    yDomain: chart.yDomain,
    tokens,
    toggleSeries: (seriesId) => chart.toggleSeries(seriesId),
    getNearestDatum: (xPx, yPx) => chart.getNearestDatum(xPx, yPx),
    isSeriesVisible: (seriesId) => visibleIds.has(seriesId),
  };
}

function fromPolar<TDatum>(
  chart: UsePolarChartResult<TDatum>,
  tokens: ChartTokens,
): InteractivePolarChart<TDatum> {
  const visibleIds = new Set(chart.visibleSeries.map((series) => series.id));

  return {
    kind: 'polar',
    options: chart.options,
    visibleSeries: chart.visibleSeries,
    plotArea: chart.plotArea,
    width: chart.width,
    height: chart.height,
    tokens,
    toggleSeries: (seriesId) => chart.toggleSeries(seriesId),
    getNearestDatum: (xPx, yPx) => chart.getNearestDatum(xPx, yPx),
    isSeriesVisible: (seriesId) => visibleIds.has(seriesId),
  };
}

export function useInteractiveChart<TDatum = unknown>(): InteractiveChartContext<TDatum> {
  const cartesian = useContext(ChartContext);
  const polar = useContext(PolarChartContext);

  if (cartesian) {
    return fromCartesian(
      (cartesian as { chart: UseGenChartResult<TDatum>; tokens: ChartTokens }).chart,
      (cartesian as { chart: UseGenChartResult<TDatum>; tokens: ChartTokens }).tokens,
    );
  }

  if (polar) {
    return fromPolar(
      (polar as { chart: UsePolarChartResult<TDatum>; tokens: ChartTokens }).chart,
      (polar as { chart: UsePolarChartResult<TDatum>; tokens: ChartTokens }).tokens,
    );
  }

  throw new Error('useInteractiveChart must be used within ChartRoot or PolarChart');
}

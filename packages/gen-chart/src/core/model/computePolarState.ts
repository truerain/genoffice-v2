/**
 * @file packages/gen-chart/src/core/model/computePolarState.ts
 * @description Internal polar model snapshot from options and visibility.
 * @created 2026-06-27
 *
 * @remark
 */

import type { PolarChartOptions } from '../../types/options';
import type { PlotArea } from '../../types/model';
import type { PolarChartSeriesDef } from '../normalizePolarSeries';
import { buildPolarGeometries } from '../geometry/polar/pieArcs';
import type { PolarGeometries } from '../geometry/polar/types';
import { computePolarLayout, type PolarLayout } from '../layout/computePolarLayout';
import { normalizePolarSeries, type NormalizedPolarSeries } from '../normalizePolarSeries';

export interface PolarModelState<TDatum> {
  normalizedSeries: NormalizedPolarSeries<TDatum>[];
  visibleSeries: PolarChartSeriesDef<TDatum>[];
  plotArea: PlotArea;
  polarLayout: PolarLayout;
  geometries: PolarGeometries<TDatum>;
}

export function isPolarSeriesVisible<TDatum>(
  series: NormalizedPolarSeries<TDatum>,
  visibility: ReadonlyMap<string, boolean>,
): boolean {
  if (series.excluded) return false;
  const explicit = visibility.get(series.id);
  if (explicit === false) return false;
  if (explicit === true) return true;
  return !series.hidden;
}

export function computePolarState<TDatum>(
  options: PolarChartOptions<TDatum>,
  layout: { width: number; height: number },
  visibility: ReadonlyMap<string, boolean>,
): PolarModelState<TDatum> {
  const normalizedSeries = normalizePolarSeries(options.series);
  const activeSeries = normalizedSeries.filter((s) => isPolarSeriesVisible(s, visibility));
  const visibleSeries: PolarChartSeriesDef<TDatum>[] = activeSeries.map(
    ({ excluded: _e, isDonut: _d, ...series }) => series,
  );

  const polarLayout = computePolarLayout(layout.width, layout.height);
  const geometries = buildPolarGeometries(activeSeries, polarLayout);

  return {
    normalizedSeries,
    visibleSeries,
    plotArea: polarLayout.plotArea,
    polarLayout,
    geometries,
  };
}

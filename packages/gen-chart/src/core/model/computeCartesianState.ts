/**
 * @file packages/gen-chart/src/core/model/computeCartesianState.ts
 * @description Internal cartesian model snapshot from options and visibility.
 * @created 2026-06-27
 *
 * @remark
 */

import type { CartesianChartOptions } from '../../types/options';
import type { PlotArea } from '../../types/model';
import type { CartesianChartSeries } from '../../types/series';
import { computeXDomain } from '../domain/computeXDomain';
import { computeYDomain } from '../domain/computeYDomain';
import { buildCartesianGeometries } from '../geometry/cartesian/buildGeometries';
import type { CartesianGeometries } from '../geometry/cartesian/types';
import { computePlotArea } from '../layout/computePlotArea';
import { normalizeSeries, type NormalizedCartesianSeries } from '../normalizeSeries';
import { createCartesianScales, type CartesianScales } from '../scale/createCartesianScales';

export interface CartesianModelState<TDatum> {
  normalizedSeries: NormalizedCartesianSeries<TDatum>[];
  visibleSeries: CartesianChartSeries<TDatum>[];
  plotArea: PlotArea;
  xDomain: ReturnType<typeof computeXDomain>;
  yDomain: [number, number];
  scales: CartesianScales;
  geometries: CartesianGeometries<TDatum>;
}

export function isSeriesVisible<TDatum>(
  series: NormalizedCartesianSeries<TDatum>,
  visibility: ReadonlyMap<string, boolean>,
): boolean {
  if (series.excluded) return false;
  const explicit = visibility.get(series.id);
  if (explicit === false) return false;
  if (explicit === true) return true;
  return !series.hidden;
}

export function computeCartesianState<TDatum>(
  options: CartesianChartOptions<TDatum>,
  layout: { width: number; height: number },
  visibility: ReadonlyMap<string, boolean>,
): CartesianModelState<TDatum> {
  const normalizedSeries = normalizeSeries(options.series);
  const activeSeries = normalizedSeries.filter((s) => isSeriesVisible(s, visibility));
  const visibleSeries: CartesianChartSeries<TDatum>[] = activeSeries.map(
    ({ excluded: _excluded, ...series }) => series,
  );

  const plotArea = computePlotArea(layout.width, layout.height, options.padding);
  const xDomain = computeXDomain(activeSeries);
  const yDomain = computeYDomain(activeSeries, options.yAxis);
  const scales = createCartesianScales(xDomain, yDomain, plotArea);
  const geometries = buildCartesianGeometries(activeSeries, scales);

  return {
    normalizedSeries,
    visibleSeries,
    plotArea,
    xDomain,
    yDomain,
    scales,
    geometries,
  };
}

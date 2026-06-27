/**
 * @file packages/gen-chart/src/core/domain/computeYDomain.ts
 * @description Compute cartesian Y domain from visible series.
 * @created 2026-06-27
 *
 * @remark
 */

import type { ChartAxisOptions } from '../../types/interaction';
import type { NormalizedCartesianSeries } from '../normalizeSeries';
import { applyAxisBounds } from './applyAxisBounds';
import { collectFiniteYValues } from './collectValues';

export function computeYDomain<TDatum>(
  series: NormalizedCartesianSeries<TDatum>[],
  yAxis?: ChartAxisOptions,
): [number, number] {
  const values = collectFiniteYValues(series);

  if (values.length === 0) {
    return applyAxisBounds(0, 1, yAxis);
  }

  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  return applyAxisBounds(dataMin, dataMax, yAxis);
}

/**
 * @file packages/gen-chart/src/core/normalizeSeries.ts
 * @description Series normalization — duplicate ids, finite y validation.
 * @created 2026-06-27
 *
 * @remark
 * - CartesianChartSeries는 union이라 interface extends가 불가하다. intersection type으로 둔다.
 */

import type { CartesianChartSeries } from '../types/series';
import { warnDuplicateSeriesId, warnNoFiniteY } from './warnings';
import { isFiniteNumber } from './utils/isFiniteNumber';

export type NormalizedCartesianSeries<TDatum> = CartesianChartSeries<TDatum> & {
  /** True when the series has no finite y values (excluded from domain/geometry). */
  excluded: boolean;
};

export function seriesHasFiniteY<TDatum>(series: CartesianChartSeries<TDatum>): boolean {
  return series.data.some((datum, index) => isFiniteNumber(series.y(datum, index)));
}

export function normalizeSeries<TDatum>(
  series: CartesianChartSeries<TDatum>[],
): NormalizedCartesianSeries<TDatum>[] {
  const seen = new Set<string>();
  const result: NormalizedCartesianSeries<TDatum>[] = [];

  for (const item of series) {
    if (seen.has(item.id)) {
      warnDuplicateSeriesId(item.id);
      continue;
    }
    seen.add(item.id);

    const hasFiniteY = seriesHasFiniteY(item);
    if (!hasFiniteY) {
      warnNoFiniteY(item.id);
    }

    result.push({
      ...item,
      excluded: !hasFiniteY,
    });
  }

  return result;
}

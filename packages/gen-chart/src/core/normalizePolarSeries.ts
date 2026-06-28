/**
 * @file packages/gen-chart/src/core/normalizePolarSeries.ts
 * @description Polar (pie/donut) series normalization.
 * @created 2026-06-27
 *
 * @remark
 */

import type { DonutSeriesDef, PieSeriesDef } from '../types/series';
import { warnDuplicateSeriesId, warnNoFiniteY } from './warnings';
import { isFiniteNumber } from './utils/isFiniteNumber';

export type PolarChartSeriesDef<TDatum> = PieSeriesDef<TDatum> | DonutSeriesDef<TDatum>;

export interface NormalizedPolarSeries<TDatum> extends PolarChartSeriesDef<TDatum> {
  excluded: boolean;
  isDonut: boolean;
}

export function seriesHasFiniteValue<TDatum>(series: PolarChartSeriesDef<TDatum>): boolean {
  return series.data.some((datum, index) => {
    const value = series.value(datum, index);
    return isFiniteNumber(value) && value > 0;
  });
}

export function isDonutSeries<TDatum>(
  series: PolarChartSeriesDef<TDatum>,
): series is DonutSeriesDef<TDatum> {
  return (
    'innerRadiusRatio' in series &&
    series.innerRadiusRatio != null &&
    series.innerRadiusRatio > 0
  );
}

export function normalizePolarSeries<TDatum>(
  series: PolarChartSeriesDef<TDatum>[],
): NormalizedPolarSeries<TDatum>[] {
  const seen = new Set<string>();
  const result: NormalizedPolarSeries<TDatum>[] = [];

  for (const item of series) {
    if (seen.has(item.id)) {
      warnDuplicateSeriesId(item.id);
      continue;
    }
    seen.add(item.id);

    const hasFiniteValue = seriesHasFiniteValue(item);
    if (!hasFiniteValue) {
      warnNoFiniteY(item.id);
    }

    result.push({
      ...item,
      excluded: !hasFiniteValue,
      isDonut: isDonutSeries(item),
    });
  }

  return result;
}

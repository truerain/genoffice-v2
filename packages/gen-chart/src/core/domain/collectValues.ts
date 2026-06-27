/**
 * @file packages/gen-chart/src/core/domain/collectValues.ts
 * @description Collect x/y values from visible cartesian series.
 * @created 2026-06-27
 *
 * @remark
 */

import type { NormalizedCartesianSeries } from '../normalizeSeries';
import { isFiniteNumber } from '../utils/isFiniteNumber';

export function collectXValues<TDatum>(
  series: NormalizedCartesianSeries<TDatum>[],
): Array<string | number | Date> {
  const keys = new Set<string>();
  const ordered: Array<string | number | Date> = [];

  for (const s of series) {
    s.data.forEach((datum, index) => {
      const x = s.x(datum, index);
      const key = x instanceof Date ? x.toISOString() : String(x);
      if (!keys.has(key)) {
        keys.add(key);
        ordered.push(x);
      }
    });
  }

  return ordered;
}

export function collectFiniteYValues<TDatum>(
  series: NormalizedCartesianSeries<TDatum>[],
): number[] {
  const values: number[] = [];

  for (const s of series) {
    s.data.forEach((datum, index) => {
      const y = s.y(datum, index);
      if (isFiniteNumber(y)) values.push(y);
    });
  }

  return values;
}

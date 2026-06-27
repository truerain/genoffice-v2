/**
 * @file packages/gen-chart/src/core/hit-test/cartesianNearest.ts
 * @description Nearest datum hit-test for cartesian charts.
 * @created 2026-06-27
 *
 * @remark
 */

import type { NearestDatumResult } from '../../types/model';
import type { SeriesHitPoint } from '../geometry/cartesian/types';

export function cartesianNearest<TDatum>(
  hitPoints: SeriesHitPoint<TDatum>[],
  xPx: number,
  yPx: number,
): NearestDatumResult<TDatum> | null {
  if (hitPoints.length === 0) return null;

  let best: SeriesHitPoint<TDatum> | null = null;
  let bestDistance = Infinity;

  for (const point of hitPoints) {
    const dx = point.px - xPx;
    const dy = point.py - yPx;
    const distance = dx * dx + dy * dy;
    if (distance < bestDistance) {
      bestDistance = distance;
      best = point;
    }
  }

  if (!best) return null;

  return {
    seriesId: best.seriesId,
    datum: best.datum,
    index: best.datumIndex,
    x: best.x,
    value: best.value,
  };
}

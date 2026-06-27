/**
 * @file packages/gen-chart/src/core/geometry/cartesian/linePoints.ts
 * @description Line series point geometry.
 * @created 2026-06-27
 *
 * @remark
 */

import type { LineSeriesDef } from '../../../types/series';
import type { CartesianScales } from '../../scale/createCartesianScales';
import { scaleXPosition as toX } from '../../scale/createCartesianScales';
import { isFiniteNumber } from '../../utils/isFiniteNumber';
import type { ChartPoint, LineGeometry, SeriesHitPoint } from './types';

export function buildLineGeometry<TDatum>(
  series: LineSeriesDef<TDatum>,
  scales: CartesianScales,
): { geometry: LineGeometry; hitPoints: SeriesHitPoint<TDatum>[] } {
  const points: ChartPoint[] = [];
  const hitPoints: SeriesHitPoint<TDatum>[] = [];

  series.data.forEach((datum, index) => {
    const y = series.y(datum, index);
    if (!isFiniteNumber(y)) return;

    const xRaw = series.x(datum, index);
    const px = toX(scales, xRaw);
    if (px == null || !Number.isFinite(px)) return;

    const py = scales.yScale(y);
    points.push({ x: px, y: py, datumIndex: index });
    hitPoints.push({
      seriesId: series.id,
      datum,
      datumIndex: index,
      x: xRaw,
      value: y,
      px,
      py,
    });
  });

  return {
    geometry: { seriesId: series.id, points },
    hitPoints,
  };
}

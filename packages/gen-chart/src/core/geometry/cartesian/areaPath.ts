/**
 * @file packages/gen-chart/src/core/geometry/cartesian/areaPath.ts
 * @description Area series path geometry.
 * @created 2026-06-27
 *
 * @remark
 * - Baseline: y=0 when zero is inside y domain; otherwise y domain min (x-axis)
 */

import { area, curveLinear } from 'd3-shape';
import type { AreaSeriesDef } from '../../../types/series';
import type { CartesianScales } from '../../scale/createCartesianScales';
import { scaleXPosition as toX } from '../../scale/createCartesianScales';
import { isFiniteNumber } from '../../utils/isFiniteNumber';
import type { AreaGeometry, ChartPoint, SeriesHitPoint } from './types';

/** Area fill baseline in data space. */
export function resolveAreaBaselineY(yDomain: [number, number]): number {
  const [yMin, yMax] = yDomain;
  if (yMin <= 0 && yMax >= 0) return 0;
  return yMin;
}

export function buildAreaGeometry<TDatum>(
  series: AreaSeriesDef<TDatum>,
  scales: CartesianScales,
): { geometry: AreaGeometry; hitPoints: SeriesHitPoint<TDatum>[] } {
  const points: ChartPoint[] = [];
  const hitPoints: SeriesHitPoint<TDatum>[] = [];
  const linePoints: { px: number; py: number }[] = [];

  series.data.forEach((datum, index) => {
    const y = series.y(datum, index);
    if (!isFiniteNumber(y)) return;

    const xRaw = series.x(datum, index);
    const px = toX(scales, xRaw);
    if (px == null || !Number.isFinite(px)) return;

    const py = scales.yScale(y);
    points.push({ x: px, y: py, datumIndex: index });
    linePoints.push({ px, py });
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

  const yDomain = scales.yScale.domain() as [number, number];
  const baseline = scales.yScale(resolveAreaBaselineY(yDomain));
  const path =
    linePoints.length >= 2
      ? area<{ px: number; py: number }>()
          .x((d) => d.px)
          .y1((d) => d.py)
          .y0(baseline)
          .curve(curveLinear)(linePoints) ?? ''
      : '';

  return {
    geometry: { seriesId: series.id, path, points },
    hitPoints,
  };
}

/**
 * @file packages/gen-chart/src/core/hit-test/polarNearest.ts
 * @description Nearest datum hit-test for polar (pie/donut) charts.
 * @created 2026-06-27
 *
 * @remark
 */

import type { NearestDatumResult } from '../../types/model';
import type { PolarArc } from '../geometry/polar/types';

/** d3 pie convention: 0 rad at 12 o'clock, clockwise. */
export function pointAngleRad(cx: number, cy: number, xPx: number, yPx: number): number {
  const dx = xPx - cx;
  const dy = yPx - cy;
  return (Math.atan2(dx, -dy) + 2 * Math.PI) % (2 * Math.PI);
}

export function isPointInArc(
  radius: number,
  angle: number,
  arcSlice: Pick<PolarArc<unknown>, 'startAngle' | 'endAngle' | 'innerRadius' | 'outerRadius'>,
): boolean {
  if (radius < arcSlice.innerRadius || radius > arcSlice.outerRadius) {
    return false;
  }

  let start = arcSlice.startAngle;
  let end = arcSlice.endAngle;
  let theta = angle;

  if (end < start) end += 2 * Math.PI;
  if (theta < start) theta += 2 * Math.PI;

  return theta >= start && theta <= end;
}

export function polarNearest<TDatum>(
  arcs: PolarArc<TDatum>[],
  xPx: number,
  yPx: number,
): NearestDatumResult<TDatum> | null {
  if (arcs.length === 0) return null;

  const cx = arcs[0]!.cx;
  const cy = arcs[0]!.cy;
  const dx = xPx - cx;
  const dy = yPx - cy;
  const radius = Math.hypot(dx, dy);
  const angle = pointAngleRad(cx, cy, xPx, yPx);

  const matches = arcs.filter((slice) => isPointInArc(radius, angle, slice));
  if (matches.length === 0) return null;

  matches.sort((a, b) => {
    const da = Math.abs(angle - a.midAngle);
    const db = Math.abs(angle - b.midAngle);
    return da - db;
  });

  const best = matches[0]!;

  return {
    seriesId: best.seriesId,
    datum: best.datum,
    index: best.index,
    x: best.label ?? best.index,
    value: best.value,
  };
}

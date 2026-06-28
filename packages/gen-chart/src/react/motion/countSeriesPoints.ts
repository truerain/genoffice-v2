/**
 * @file packages/gen-chart/src/react/motion/countSeriesPoints.ts
 * @description Count total data points across chart series (Gate C6b).
 * @created 2026-06-27
 *
 * @remark
 */

export const MOTION_LARGE_DATA_THRESHOLD = 2000;

export function countSeriesPoints(
  series: ReadonlyArray<{ data: ReadonlyArray<unknown> }>,
): number {
  return series.reduce((sum, item) => sum + item.data.length, 0);
}

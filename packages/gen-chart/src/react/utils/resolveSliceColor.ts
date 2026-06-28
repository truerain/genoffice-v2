/**
 * @file packages/gen-chart/src/react/utils/resolveSliceColor.ts
 * @description Resolve fill color for a polar chart slice.
 * @created 2026-06-27
 *
 * @remark
 */

import type { ChartTokens } from '../../types/tokens';

export function resolveSliceColor(
  seriesColor: string | undefined,
  sliceIndex: number,
  tokens: ChartTokens,
): string {
  if (seriesColor) return seriesColor;
  const palette = tokens.color.seriesPalette;
  return palette[sliceIndex % palette.length] ?? '#2563eb';
}

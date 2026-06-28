/**
 * @file packages/gen-chart/src/react/utils/resolveSeriesColor.ts
 * @description Resolve stroke/fill color for a chart series.
 * @created 2026-06-27
 *
 * @remark
 */

import type { ChartTokens } from '../../types/tokens';

interface SeriesColorSource {
  id: string;
  color?: string;
}

export function resolveSeriesColor(
  seriesList: SeriesColorSource[],
  seriesId: string,
  tokens: ChartTokens,
): string {
  const index = seriesList.findIndex((s) => s.id === seriesId);
  const series = seriesList[index];
  if (series?.color) return series.color;
  const palette = tokens.color.seriesPalette;
  return palette[index >= 0 ? index % palette.length : 0] ?? '#2563eb';
}

/**
 * @file packages/gen-chart/src/react/utils/resolveSeriesColor.ts
 * @description Resolve stroke/fill color for a cartesian series.
 * @created 2026-06-27
 *
 * @remark
 */

import type { CartesianChartSeries } from '../../types/series';
import type { ChartTokens } from '../../types/tokens';

export function resolveSeriesColor(
  visibleSeries: CartesianChartSeries<unknown>[],
  seriesId: string,
  tokens: ChartTokens,
): string {
  const index = visibleSeries.findIndex((s) => s.id === seriesId);
  const series = visibleSeries[index];
  if (series?.color) return series.color;
  const palette = tokens.color.seriesPalette;
  return palette[index >= 0 ? index % palette.length : 0] ?? '#2563eb';
}

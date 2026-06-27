/**
 * @file packages/gen-chart/src/themes/lightChartTokens.ts
 * @description Default light ChartTokens preset for gen-chart.
 * @created 2026-06-27
 *
 * @remark
 */

import type { ChartTokens } from '../types/tokens';

export const lightChartTokens: ChartTokens = {
  color: {
    background: '#ffffff',
    textPrimary: '#111827',
    textMuted: '#6b7280',
    axis: '#6b7280',
    grid: '#e5e7eb',
    crosshair: '#9ca3af',
    tooltipBg: '#ffffff',
    tooltipBorder: '#d1d5db',
    tooltipText: '#111827',
    legendText: '#111827',
    legendTextMuted: '#9ca3af',
    seriesPalette: ['#2563eb', '#16a34a', '#f59e0b', '#db2777', '#7c3aed', '#0891b2'],
  },
  typography: {
    fontFamily: 'var(--font-family-primary, system-ui, sans-serif)',
    axisTickFontSize: 11,
    legendFontSize: 11,
    tooltipFontSize: 11,
  },
  spacing: {
    paddingTop: 12,
    paddingRight: 16,
    paddingBottom: 30,
    paddingLeft: 42,
    axisTickGap: 4,
    legendItemGap: 12,
    legendMarkerSize: 10,
    tooltipPaddingX: 8,
    tooltipPaddingY: 6,
  },
  border: {
    tooltipRadius: 6,
    tooltipBorderWidth: 1,
    seriesStrokeWidth: 2,
    seriesStrokeColor: 'currentColor',
    gridWidth: 1,
    axisWidth: 1,
  },
  motion: {
    enabled: true,
    durationMs: 240,
    easing: 'easeOut',
  },
};

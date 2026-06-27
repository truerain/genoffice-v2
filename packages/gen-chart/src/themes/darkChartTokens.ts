/**
 * @file packages/gen-chart/src/themes/darkChartTokens.ts
 * @description Default dark ChartTokens preset for gen-chart.
 * @created 2026-06-27
 *
 * @remark
 */

import type { ChartTokens } from '../types/tokens';

export const darkChartTokens: ChartTokens = {
  color: {
    background: '#0f172a',
    textPrimary: '#f8fafc',
    textMuted: '#94a3b8',
    axis: '#94a3b8',
    grid: '#334155',
    crosshair: '#64748b',
    tooltipBg: '#1e293b',
    tooltipBorder: '#475569',
    tooltipText: '#f8fafc',
    legendText: '#f8fafc',
    legendTextMuted: '#64748b',
    seriesPalette: ['#60a5fa', '#4ade80', '#fbbf24', '#f472b6', '#a78bfa', '#22d3ee'],
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

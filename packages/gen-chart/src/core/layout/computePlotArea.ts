/**
 * @file packages/gen-chart/src/core/layout/computePlotArea.ts
 * @description Plot area from chart size, padding, and legend reserve.
 * @created 2026-06-27
 *
 * @remark
 * - Exports: resolvePadding, resolveLegendOptions, computeLegendReserveHeight, computePlotArea
 * - Legend reserve uses fixed row height estimate (see architecture §11)
 */

import type { ChartPadding } from '../../types/common';
import type { ChartLegendOptions } from '../../types/interaction';
import type { PlotArea } from '../../types/model';
import type { ChartSpacingTokens, ChartTypographyTokens } from '../../types/tokens';
import { lightChartTokens } from '../../themes/lightChartTokens';

export function resolvePadding(padding?: ChartPadding) {
  const defaults = lightChartTokens.spacing;
  return {
    top: padding?.top ?? defaults.paddingTop,
    right: padding?.right ?? defaults.paddingRight,
    bottom: padding?.bottom ?? defaults.paddingBottom,
    left: padding?.left ?? defaults.paddingLeft,
  };
}

export function resolveLegendOptions(
  legend?: boolean | ChartLegendOptions,
): Required<Pick<ChartLegendOptions, 'enabled' | 'position' | 'reserveSpace'>> {
  if (legend === false || legend === undefined) {
    return { enabled: false, position: 'bottom', reserveSpace: false };
  }

  const resolved = typeof legend === 'object' ? legend : {};
  const enabled = resolved.enabled !== false;

  return {
    enabled,
    position: resolved.position ?? 'bottom',
    reserveSpace: enabled && resolved.reserveSpace !== false,
  };
}

export function computeLegendReserveHeight(
  tokens: {
    spacing: Pick<ChartSpacingTokens, 'legendItemGap' | 'legendMarkerSize'>;
    typography: Pick<ChartTypographyTokens, 'legendFontSize'>;
  } = lightChartTokens,
): number {
  const rowHeight = Math.max(
    tokens.typography.legendFontSize,
    tokens.spacing.legendMarkerSize,
  );
  return rowHeight + tokens.spacing.legendItemGap;
}

export interface ComputePlotAreaOptions {
  padding?: ChartPadding;
  legend?: boolean | ChartLegendOptions;
  legendReserveHeight?: number;
}

export function computePlotArea(
  width: number,
  height: number,
  options?: ComputePlotAreaOptions,
): PlotArea {
  const resolved = resolvePadding(options?.padding);
  let top = resolved.top;
  let bottom = resolved.bottom;

  const legend = resolveLegendOptions(options?.legend);
  const reserveHeight = options?.legendReserveHeight ?? 0;
  const shouldReserve =
    legend.enabled && legend.reserveSpace && reserveHeight > 0;

  if (shouldReserve) {
    if (legend.position === 'top') {
      top += reserveHeight;
    } else {
      bottom += reserveHeight;
    }
  }

  const plotWidth = Math.max(0, width - resolved.left - resolved.right);
  const plotHeight = Math.max(0, height - top - bottom);

  return {
    x: resolved.left,
    y: top,
    width: plotWidth,
    height: plotHeight,
  };
}

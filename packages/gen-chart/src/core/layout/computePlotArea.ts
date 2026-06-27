/**
 * @file packages/gen-chart/src/core/layout/computePlotArea.ts
 * @description Plot area from chart size and padding.
 * @created 2026-06-27
 *
 * @remark
 */

import type { ChartPadding } from '../../types/common';
import type { PlotArea } from '../../types/model';
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

export function computePlotArea(
  width: number,
  height: number,
  padding?: ChartPadding,
): PlotArea {
  const resolved = resolvePadding(padding);
  const plotWidth = Math.max(0, width - resolved.left - resolved.right);
  const plotHeight = Math.max(0, height - resolved.top - resolved.bottom);

  return {
    x: resolved.left,
    y: resolved.top,
    width: plotWidth,
    height: plotHeight,
  };
}

/**
 * @file packages/gen-chart/src/core/layout/computePolarLayout.ts
 * @description Polar plot center and radius from chart layout.
 * @created 2026-06-27
 *
 * @remark
 */

import type { ChartPadding } from '../../types/common';
import type { PlotArea } from '../../types/model';
import { computePlotArea } from './computePlotArea';

export interface PolarLayout {
  plotArea: PlotArea;
  cx: number;
  cy: number;
  outerRadius: number;
}

export function computePolarLayout(
  width: number,
  height: number,
  padding?: ChartPadding,
): PolarLayout {
  const plotArea = computePlotArea(width, height, padding);
  const size = Math.min(plotArea.width, plotArea.height);
  const outerRadius = Math.max(0, (size / 2) * 0.9);

  return {
    plotArea,
    cx: plotArea.x + plotArea.width / 2,
    cy: plotArea.y + plotArea.height / 2,
    outerRadius,
  };
}

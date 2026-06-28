/**
 * @file packages/gen-chart/src/react/components/chrome/resolveTooltipPosition.ts
 * @description Tooltip anchor flip/clamp within chart bounds (Gate C6).
 * @created 2026-06-27
 *
 * @remark
 * - Exports: resolveTooltipPosition, TOOLTIP_POSITION_DEFAULTS
 */

export const TOOLTIP_POSITION_DEFAULTS = {
  padding: 8,
  offset: 12,
} as const;

export interface TooltipAnchor {
  x: number;
  y: number;
}

export interface TooltipSize {
  width: number;
  height: number;
}

export interface ChartBounds {
  width: number;
  height: number;
}

export interface TooltipPositionOptions {
  padding?: number;
  offset?: number;
}

export function resolveTooltipPosition(
  anchor: TooltipAnchor,
  tooltipSize: TooltipSize,
  chart: ChartBounds,
  options?: TooltipPositionOptions,
): TooltipAnchor {
  const padding = options?.padding ?? TOOLTIP_POSITION_DEFAULTS.padding;
  const offset = options?.offset ?? TOOLTIP_POSITION_DEFAULTS.offset;
  const { width: tooltipWidth, height: tooltipHeight } = tooltipSize;

  let left = anchor.x + offset;
  let top = anchor.y + offset;

  if (left + tooltipWidth > chart.width - padding) {
    left = anchor.x - offset - tooltipWidth;
  }

  if (top + tooltipHeight > chart.height - padding) {
    top = anchor.y - offset - tooltipHeight;
  }

  const maxLeft = Math.max(padding, chart.width - tooltipWidth - padding);
  const maxTop = Math.max(padding, chart.height - tooltipHeight - padding);

  return {
    x: Math.min(maxLeft, Math.max(padding, left)),
    y: Math.min(maxTop, Math.max(padding, top)),
  };
}

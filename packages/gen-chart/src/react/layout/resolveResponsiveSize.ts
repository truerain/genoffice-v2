/**
 * @file packages/gen-chart/src/react/layout/resolveResponsiveSize.ts
 * @description Clamp and derive chart pixel size from container measurements (Gate C7).
 * @created 2026-06-27
 *
 * @remark
 * - Exports: resolveResponsiveSize
 * - Used by ResponsiveChartContainer; not part of public package API
 */

export interface ResolveResponsiveSizeInput {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  aspectRatio?: number;
}

export interface ResolvedResponsiveSize {
  width: number;
  height: number;
}

export function resolveResponsiveSize({
  width,
  height,
  minWidth,
  minHeight,
  aspectRatio,
}: ResolveResponsiveSizeInput): ResolvedResponsiveSize {
  const safeWidth = Math.max(minWidth, Math.floor(width));
  let safeHeight = Math.max(minHeight, Math.floor(height));

  if (typeof aspectRatio === 'number' && Number.isFinite(aspectRatio) && aspectRatio > 0) {
    safeHeight = Math.max(minHeight, Math.floor(safeWidth / aspectRatio));
  }

  return { width: safeWidth, height: safeHeight };
}

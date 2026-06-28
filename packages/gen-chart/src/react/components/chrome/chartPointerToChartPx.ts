/**
 * @file packages/gen-chart/src/react/components/chrome/chartPointerToChartPx.ts
 * @description Map pointer event on chart hit layer to chart pixel coordinates.
 * @created 2026-06-27
 *
 * @remark
 */

import type { PointerEvent as ReactPointerEvent } from 'react';

export function chartPointerToChartPx(
  event: ReactPointerEvent<HTMLDivElement>,
  chart: { width: number; height: number },
): { xPx: number; yPx: number } {
  const rect = event.currentTarget.getBoundingClientRect();
  const localX = Number.isFinite(event.nativeEvent.offsetX)
    ? event.nativeEvent.offsetX
    : Math.max(0, event.clientX - rect.left);
  const localY = Number.isFinite(event.nativeEvent.offsetY)
    ? event.nativeEvent.offsetY
    : Math.max(0, event.clientY - rect.top);
  const width = rect.width > 0 ? rect.width : chart.width;
  const height = rect.height > 0 ? rect.height : chart.height;

  return {
    xPx: (localX / width) * chart.width,
    yPx: (localY / height) * chart.height,
  };
}

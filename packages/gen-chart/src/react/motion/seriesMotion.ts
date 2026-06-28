/**
 * @file packages/gen-chart/src/react/motion/seriesMotion.ts
 * @description Motion className/style helpers for series renderers (Gate C6b).
 * @created 2026-06-27
 *
 * @remark
 */

import type { CSSProperties } from 'react';
import type { ResolvedChartMotion } from './resolveChartMotion';

export type SeriesMotionKind = 'line' | 'bar' | 'area' | 'pie';

export function motionEasingToCss(easing: ResolvedChartMotion['easing']): string {
  switch (easing) {
    case 'linear':
      return 'linear';
    case 'easeInOut':
      return 'ease-in-out';
    default:
      return 'ease-out';
  }
}

export function polylineLength(points: ReadonlyArray<{ x: number; y: number }>): number {
  let total = 0;
  for (let index = 1; index < points.length; index += 1) {
    const start = points[index - 1]!;
    const end = points[index]!;
    total += Math.hypot(end.x - start.x, end.y - start.y);
  }
  return Math.max(total, 1);
}

export interface SeriesMotionProps {
  key: string;
  className?: string;
  style?: CSSProperties;
}

export function buildSeriesMotionProps(
  motion: ResolvedChartMotion,
  kind: SeriesMotionKind,
  seriesId: string,
  extras?: Record<string, string | number>,
): SeriesMotionProps {
  if (!motion.enabled || motion.mode === 'none') {
    return { key: seriesId };
  }

  const key =
    motion.mode === 'reset-on-change' ? `${seriesId}-${motion.renderKey}` : seriesId;

  return {
    key,
    className: `gen-chart-motion-${kind}-enter`,
    style: {
      ['--gen-chart-motion-duration' as string]: `${motion.durationMs}ms`,
      ['--gen-chart-motion-easing' as string]: motionEasingToCss(motion.easing),
      ...extras,
    },
  };
}

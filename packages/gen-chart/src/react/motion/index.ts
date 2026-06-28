/**
 * @file packages/gen-chart/src/react/motion/index.ts
 * @description Motion module exports (Gate C6b).
 * @created 2026-06-27
 *
 * @remark
 */

export { MOTION_LARGE_DATA_THRESHOLD, countSeriesPoints } from './countSeriesPoints';
export {
  resolveChartMotion,
  resolveMotionInput,
} from './resolveChartMotion';
export type {
  ChartMotionDisableReason,
  ChartMotionMode,
  ResolvedChartMotion,
  ResolveChartMotionInput,
} from './resolveChartMotion';
export {
  buildSeriesMotionProps,
  motionEasingToCss,
  polylineLength,
} from './seriesMotion';
export type { SeriesMotionKind, SeriesMotionProps } from './seriesMotion';
export { useChartMotion } from './useChartMotion';
export { usePrefersReducedMotion } from './usePrefersReducedMotion';

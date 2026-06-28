/**
 * @file packages/gen-chart/src/react/motion/useChartMotion.ts
 * @description Resolved motion state for chart chrome/series (Gate C6b).
 * @created 2026-06-27
 *
 * @remark
 */

import { useEffect, useMemo, useRef } from 'react';
import { warnMotionDisabledLargeData } from '../../core/warnings';
import type { ChartMotionOptions } from '../../types/interaction';
import type { ChartMotionTokens } from '../../types/tokens';
import { countSeriesPoints } from './countSeriesPoints';
import { resolveChartMotion, resolveMotionInput } from './resolveChartMotion';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export function useChartMotion(
  motion: boolean | ChartMotionOptions | undefined,
  series: ReadonlyArray<{ data: ReadonlyArray<unknown> }>,
  tokenMotion: ChartMotionTokens,
) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const pointCount = useMemo(() => countSeriesPoints(series), [series]);
  const warnedLargeDataRef = useRef(false);

  const resolved = useMemo(() => {
    const input = resolveMotionInput(motion, tokenMotion);
    return resolveChartMotion(input, { prefersReducedMotion, pointCount });
  }, [motion, tokenMotion, prefersReducedMotion, pointCount]);

  useEffect(() => {
    if (resolved.disabledReason !== 'large-data' || warnedLargeDataRef.current) {
      return;
    }
    warnMotionDisabledLargeData(pointCount);
    warnedLargeDataRef.current = true;
  }, [resolved.disabledReason, pointCount]);

  return resolved;
}

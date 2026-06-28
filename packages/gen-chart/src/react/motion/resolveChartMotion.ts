/**
 * @file packages/gen-chart/src/react/motion/resolveChartMotion.ts
 * @description Resolve chart motion options for presentation layer (Gate C6b).
 * @created 2026-06-27
 *
 * @remark
 * - Exports: resolveMotionInput, resolveChartMotion, ResolvedChartMotion
 */

import type { ChartMotionOptions } from '../../types/interaction';
import type { ChartMotionTokens } from '../../types/tokens';

export type ChartMotionMode = 'enter' | 'reset-on-change' | 'none';
export type ChartMotionDisableReason = 'options' | 'reduced-motion' | 'large-data';

export interface ResolvedChartMotion {
  enabled: boolean;
  mode: ChartMotionMode;
  durationMs: number;
  easing: 'linear' | 'easeOut' | 'easeInOut';
  changeKey: string | number | undefined;
  renderKey: string;
  disabledReason?: ChartMotionDisableReason;
}

export interface ResolveChartMotionInput {
  optionEnabled: boolean;
  mode: ChartMotionMode;
  durationMs: number;
  easing: 'linear' | 'easeOut' | 'easeInOut';
  changeKey: string | number | undefined;
}

export function resolveMotionInput(
  motion: boolean | ChartMotionOptions | undefined,
  tokenMotion: ChartMotionTokens,
): ResolveChartMotionInput {
  if (motion === false) {
    return {
      optionEnabled: false,
      mode: 'none',
      durationMs: tokenMotion.durationMs,
      easing: tokenMotion.easing,
      changeKey: undefined,
    };
  }

  const resolved = typeof motion === 'object' ? motion : {};
  const optionEnabled =
    motion === undefined ? tokenMotion.enabled !== false : resolved.enabled !== false;
  const mode = resolved.mode ?? (optionEnabled ? 'enter' : 'none');

  return {
    optionEnabled: optionEnabled && mode !== 'none',
    mode: mode === 'none' ? 'none' : mode,
    durationMs: resolved.durationMs ?? tokenMotion.durationMs,
    easing: resolved.easing ?? tokenMotion.easing,
    changeKey: resolved.changeKey,
  };
}

export function resolveChartMotion(
  input: ResolveChartMotionInput,
  options: { prefersReducedMotion: boolean; pointCount: number; largeDataThreshold?: number },
): ResolvedChartMotion {
  const threshold = options.largeDataThreshold ?? 2000;
  let enabled = input.optionEnabled;
  let disabledReason: ChartMotionDisableReason | undefined;

  if (!enabled) {
    disabledReason = 'options';
  } else if (options.prefersReducedMotion) {
    enabled = false;
    disabledReason = 'reduced-motion';
  } else if (options.pointCount >= threshold) {
    enabled = false;
    disabledReason = 'large-data';
  }

  const activeMode: ChartMotionMode = enabled ? input.mode : 'none';
  const renderKey =
    activeMode === 'reset-on-change' && input.changeKey != null
      ? String(input.changeKey)
      : 'static';

  return {
    enabled,
    mode: activeMode,
    durationMs: input.durationMs,
    easing: input.easing,
    changeKey: input.changeKey,
    renderKey,
    disabledReason: enabled ? undefined : disabledReason,
  };
}

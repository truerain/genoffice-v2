/**
 * @file packages/gen-chart/src/react/utils/resolveAxisOptions.ts
 * @description Resolve axis visibility from chart options.
 * @created 2026-06-27
 *
 * @remark
 */

import type { ChartAxisOptions } from '../../types/interaction';

export interface ResolvedAxisOptions {
  show: boolean;
  showTicks: boolean;
  tickCount?: number;
  tickFormat?: (value: unknown) => string;
}

export function resolveAxisOptions(axis?: ChartAxisOptions): ResolvedAxisOptions {
  return {
    show: axis?.show !== false,
    showTicks: axis?.showTicks !== false,
    tickCount: axis?.tickCount,
    tickFormat: axis?.tickFormat,
  };
}

/**
 * @file packages/gen-chart/src/react/hooks/useGenChart.ts
 * @description Chart model + layout hook (Gate C2).
 * @created 2026-06-27
 *
 * @remark
 */

import type { CartesianChartOptions } from '../../types/options';
import type { UseGenChartResult } from '../../types/model';
import { notImplemented } from '../../core/notImplemented';

export interface UseGenChartOptions<TDatum> extends CartesianChartOptions<TDatum> {
  width: number;
  height: number;
}

export function useGenChart<TDatum>(
  _options: UseGenChartOptions<TDatum>,
): UseGenChartResult<TDatum> {
  notImplemented('useGenChart', 'Gate C2');
}

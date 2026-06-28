/**
 * @file packages/gen-chart/src/react/utils/resolveInteractiveOptions.ts
 * @description Resolve tooltip/legend options from ChartInteractiveOptions.
 * @created 2026-06-27
 *
 * @remark
 */

import type {
  ChartInteractiveOptions,
  ChartLegendOptions,
  ChartTooltipOptions,
} from '../../types/interaction';

export interface ResolvedTooltipOptions<TDatum> extends ChartTooltipOptions<TDatum> {
  enabled: boolean;
}

export type ResolvedLegendOptions = Required<
  Pick<ChartLegendOptions, 'enabled' | 'position' | 'align' | 'reserveSpace'>
>;

export function resolveTooltipOptions<TDatum>(
  tooltip?: boolean | ChartTooltipOptions<TDatum>,
): ResolvedTooltipOptions<TDatum> {
  if (tooltip === false) {
    return { enabled: false };
  }

  const resolved = typeof tooltip === 'object' ? tooltip : {};
  return {
    enabled: resolved.enabled !== false,
    titleFormatter: resolved.titleFormatter,
    valueFormatter: resolved.valueFormatter,
  };
}

export function resolveLegendOptionsFromInteractive(
  legend?: boolean | ChartLegendOptions,
): ResolvedLegendOptions {
  if (legend === false) {
    return { enabled: false, position: 'bottom', align: 'center', reserveSpace: false };
  }

  const resolved = typeof legend === 'object' ? legend : {};
  const enabled = resolved.enabled !== false;

  return {
    enabled,
    position: resolved.position ?? 'bottom',
    align: resolved.align ?? 'center',
    reserveSpace: enabled && resolved.reserveSpace !== false,
  };
}

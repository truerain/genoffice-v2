/**
 * @file packages/gen-chart/src/core/domain/applyAxisBounds.ts
 * @description Apply axis min/max options to numeric domains.
 * @created 2026-06-27
 *
 * @remark
 * - Default (min/max omitted or 'auto'/'nice'): d3-scale `.nice()` tick-aligned domain
 * - 'dataMin' / 'dataMax' / explicit number: exact bound, no nice expansion on that side
 * - Bar zero baseline: deferred to Gate C4
 */

import { scaleLinear } from 'd3-scale';
import type { ChartAxisOptions } from '../../types/interaction';

const DEFAULT_NICE_TICK_COUNT = 5;

function resolveNiceTickCount(axis?: ChartAxisOptions): number {
  const count = axis?.tickCount;
  if (typeof count === 'number' && count > 0) return count;
  return DEFAULT_NICE_TICK_COUNT;
}

function niceLinearDomain(min: number, max: number, tickCount: number): [number, number] {
  const scale = scaleLinear().domain([min, max]).nice(tickCount);
  const domain = scale.domain();
  return [domain[0]!, domain[1]!];
}

function isAutoBound(value: ChartAxisOptions['min'] | ChartAxisOptions['max']): boolean {
  return value === undefined || value === 'auto' || value === 'nice';
}

function expandDegenerateDomain(dataMin: number, dataMax: number): [number, number] {
  if (dataMin === dataMax) {
    if (dataMin === 0) return [0, 1];
    const pad = Math.abs(dataMin) * 0.1 || 1;
    return [dataMin - pad, dataMax + pad];
  }
  return [dataMin, dataMax];
}

export function applyAxisBounds(
  dataMin: number,
  dataMax: number,
  axis?: ChartAxisOptions,
): [number, number] {
  let [min, max] = expandDegenerateDomain(dataMin, dataMax);

  const minOpt = axis?.min;
  const maxOpt = axis?.max;

  if (minOpt === 'dataMin') min = dataMin;
  else if (typeof minOpt === 'number') min = minOpt;

  if (maxOpt === 'dataMax') max = dataMax;
  else if (typeof maxOpt === 'number') max = maxOpt;

  const niceMin = isAutoBound(minOpt);
  const niceMax = isAutoBound(maxOpt);

  if (niceMin || niceMax) {
    const [nicedMin, nicedMax] = niceLinearDomain(min, max, resolveNiceTickCount(axis));
    if (niceMin) min = nicedMin;
    if (niceMax) max = nicedMax;
  }

  if (min > max) [min, max] = [max, min];
  return [min, max];
}

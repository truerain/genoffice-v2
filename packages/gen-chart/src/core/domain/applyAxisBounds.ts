/**
 * @file packages/gen-chart/src/core/domain/applyAxisBounds.ts
 * @description Apply axis min/max options to numeric domains.
 * @created 2026-06-27
 *
 * @remark
 */

import type { ChartAxisOptions } from '../../types/interaction';

export function applyAxisBounds(
  dataMin: number,
  dataMax: number,
  axis?: ChartAxisOptions,
): [number, number] {
  let min = dataMin;
  let max = dataMax;

  if (dataMin === dataMax) {
    if (dataMin === 0) {
      min = 0;
      max = 1;
    } else {
      const pad = Math.abs(dataMin) * 0.1 || 1;
      min = dataMin - pad;
      max = dataMax + pad;
    }
  }

  const minOpt = axis?.min;
  const maxOpt = axis?.max;

  if (minOpt === 'dataMin') min = dataMin;
  else if (typeof minOpt === 'number') min = minOpt;
  else if (minOpt === 'auto' || minOpt === undefined) {
    const span = max - min;
    min = min - span * 0.05;
  }

  if (maxOpt === 'dataMax') max = dataMax;
  else if (typeof maxOpt === 'number') max = maxOpt;
  else if (maxOpt === 'auto' || maxOpt === undefined) {
    const span = max - min;
    max = max + span * 0.05;
  }

  if (min > max) [min, max] = [max, min];
  return [min, max];
}

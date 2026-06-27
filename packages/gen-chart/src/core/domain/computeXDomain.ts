/**
 * @file packages/gen-chart/src/core/domain/computeXDomain.ts
 * @description Compute cartesian X domain from visible series.
 * @created 2026-06-27
 *
 * @remark
 */

import type { NormalizedCartesianSeries } from '../normalizeSeries';
import { xToKey, xValueKind, type XValueKind } from '../utils/xValue';
import { collectXValues } from './collectValues';

export interface XDomainResult {
  kind: XValueKind;
  /** band: string keys; linear: [min, max]; time: [Date, Date] */
  domain: string[] | [number, number] | [Date, Date];
}

export function computeXDomain<TDatum>(
  series: NormalizedCartesianSeries<TDatum>[],
): XDomainResult {
  const values = collectXValues(series);

  if (values.length === 0) {
    return { kind: 'band', domain: [] };
  }

  const kind = xValueKind(values);

  if (kind === 'band') {
    return { kind: 'band', domain: values.map((value) => xToKey(value)) };
  }

  if (kind === 'time') {
    const dates = values as Date[];
    const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
    return { kind: 'time', domain: [sorted[0]!, sorted[sorted.length - 1]!] };
  }

  const numbers = values as number[];
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  return { kind: 'linear', domain: min === max ? [min - 1, max + 1] : [min, max] };
}

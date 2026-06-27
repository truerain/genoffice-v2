/**
 * @file packages/gen-chart/src/core/utils/xValue.ts
 * @description X-axis value classification and key helpers.
 * @created 2026-06-27
 *
 * @remark
 */

export type XValueKind = 'time' | 'linear' | 'band';

export function xValueKind(values: Array<string | number | Date>): XValueKind {
  if (values.length === 0) return 'band';
  if (values.every((v) => v instanceof Date)) return 'time';
  if (values.every((v) => typeof v === 'number' && Number.isFinite(v))) return 'linear';
  return 'band';
}

export function xToKey(value: string | number | Date): string {
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

export function compareXValues(a: string | number | Date, b: string | number | Date): number {
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return xToKey(a).localeCompare(xToKey(b));
}

/**
 * @file packages/gen-chart/src/core/utils/isFiniteNumber.ts
 * @description Finite numeric guard for chart accessors.
 * @created 2026-06-27
 *
 * @remark
 */

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

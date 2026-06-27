/**
 * @file packages/gen-chart/src/core/notImplemented.ts
 * @description Shared stub error for pre-Gate implementations.
 * @created 2026-06-27
 *
 * @remark
 */

export function notImplemented(symbol: string, gate: string): never {
  throw new Error(`[gen-chart] ${symbol} is not implemented (${gate}).`);
}

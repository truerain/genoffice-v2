/**
 * @file packages/gen-chart/test/core/normalizeSeries.test.ts
 * @description normalizeSeries unit tests.
 * @created 2026-06-27
 *
 * @remark
 */
import { describe, expect, it, vi } from 'vitest';
import { normalizeSeries } from '../../src/core/normalizeSeries';

describe('normalizeSeries', () => {
  it('deduplicates series ids and warns', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = normalizeSeries([
      { id: 'a', type: 'line', data: [{ v: 1 }], x: (d) => d.v, y: () => 1 },
      { id: 'a', type: 'bar', data: [{ v: 2 }], x: (d) => d.v, y: () => 2 },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0]?.type).toBe('line');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('GC004'));
    spy.mockRestore();
  });

  it('marks series without finite y as excluded', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = normalizeSeries([
      { id: 'empty', type: 'line', data: [{ v: 1 }], x: (d) => d.v, y: () => null },
    ]);
    expect(result[0]?.excluded).toBe(true);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('GC005'));
    spy.mockRestore();
  });
});

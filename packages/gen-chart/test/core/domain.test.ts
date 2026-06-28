/**
 * @file packages/gen-chart/test/core/domain.test.ts
 * @description Domain computation unit tests.
 * @created 2026-06-27
 *
 * @remark
 */
import { describe, expect, it } from 'vitest';
import { computeXDomain } from '../../src/core/domain/computeXDomain';
import { computeYDomain } from '../../src/core/domain/computeYDomain';
import { normalizeSeries } from '../../src/core/normalizeSeries';

describe('computeXDomain', () => {
  it('uses band domain for string categories', () => {
    const series = normalizeSeries([
      {
        id: 's1',
        type: 'line',
        data: [{ cat: 'b' }, { cat: 'a' }],
        x: (d) => d.cat,
        y: () => 10,
      },
    ]);
    const result = computeXDomain(series);
    expect(result.kind).toBe('band');
    expect(result.domain).toEqual(['b', 'a']);
  });

  it('uses time domain for Date values', () => {
    const d1 = new Date('2024-01-01');
    const d2 = new Date('2024-06-01');
    const series = normalizeSeries([
      {
        id: 's1',
        type: 'line',
        data: [{ d: d2 }, { d: d1 }],
        x: (d) => d.d,
        y: () => 5,
      },
    ]);
    const result = computeXDomain(series);
    expect(result.kind).toBe('time');
    expect(result.domain).toEqual([d1, d2]);
  });
});

describe('computeYDomain', () => {
  it('computes y extent from visible finite values', () => {
    const series = normalizeSeries([
      {
        id: 'a',
        type: 'line',
        data: [{ x: 1 }, { x: 2 }],
        x: (d) => d.x,
        y: (d) => (d.x === 1 ? 10 : 50),
      },
    ]);
    const [min, max] = computeYDomain(series);
    expect(min).toBeLessThanOrEqual(10);
    expect(max).toBeGreaterThanOrEqual(50);
  });

  it('uses d3 nice domain by default for revenue-like ranges', () => {
    const series = normalizeSeries([
      {
        id: 'revenue',
        type: 'line',
        data: [
          { month: 'Jan', revenue: 120 },
          { month: 'May', revenue: 210 },
        ],
        x: (d) => d.month,
        y: (d) => d.revenue,
      },
    ]);

    const [min, max] = computeYDomain(series);

    expect(min).toBeLessThanOrEqual(120);
    expect(max).toBeGreaterThanOrEqual(210);
    expect(max % 10).toBe(0);
    expect(min % 10).toBe(0);
  });

  it('honors dataMax without nice expansion on max', () => {
    const series = normalizeSeries([
      {
        id: 'revenue',
        type: 'line',
        data: [{ month: 'Jan', revenue: 210 }],
        x: (d) => d.month,
        y: (d) => d.revenue,
      },
    ]);

    const [, max] = computeYDomain(series, { max: 'dataMax' });
    expect(max).toBe(210);
  });

  it('honors explicit numeric max', () => {
    const series = normalizeSeries([
      {
        id: 'revenue',
        type: 'line',
        data: [{ month: 'Jan', revenue: 210 }],
        x: (d) => d.month,
        y: (d) => d.revenue,
      },
    ]);

    const [, max] = computeYDomain(series, { max: 300 });
    expect(max).toBe(300);
  });

  it('honors explicit zero baseline min', () => {
    const series = normalizeSeries([
      {
        id: 'revenue',
        type: 'line',
        data: [
          { month: 'Jan', revenue: 120 },
          { month: 'May', revenue: 210 },
        ],
        x: (d) => d.month,
        y: (d) => d.revenue,
      },
    ]);

    const [min, max] = computeYDomain(series, { min: 0 });
    expect(min).toBe(0);
    expect(max).toBeGreaterThanOrEqual(210);
  });
});

/**
 * @file packages/gen-chart/test/scaffold.test.tsx
 * @description Gate C0 smoke tests — public exports and stub shell.
 * @created 2026-06-27
 *
 * @remark
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  ChartRoot,
  CartesianChart,
  createCartesianModel,
  lightChartTokens,
  resolveChartTokens,
  warnEmptySeries,
} from '../src';

describe('Gate C0 scaffold', () => {
  it('exports resolveChartTokens with light preset defaults', () => {
    const tokens = resolveChartTokens('light');
    expect(tokens.color.background).toBe(lightChartTokens.color.background);
    expect(tokens.motion.durationMs).toBe(240);
  });

  it('warnEmptySeries logs in development', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    warnEmptySeries();
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('[gen-chart][GC001_EMPTY_SERIES]'),
    );
    spy.mockRestore();
  });

  it('createCartesianModel returns model with empty visible series when no data', () => {
    const model = createCartesianModel({ series: [] }, { width: 400, height: 300 });
    expect(model.visibleSeries).toEqual([]);
    expect(model.getNearestDatum(10, 10)).toBeNull();
  });

  it('ChartRoot renders stub shell with children', () => {
    render(
      <ChartRoot
        width={400}
        height={300}
        options={{
          series: [{ id: 'a', type: 'line', data: [], x: () => 0, y: () => 0 }],
        }}
      >
        <CartesianChart>
          <span>child</span>
        </CartesianChart>
      </ChartRoot>,
    );

    expect(screen.getByText('child')).toBeInTheDocument();
    expect(document.querySelector('[data-gen-chart-root]')).toBeTruthy();
  });
});

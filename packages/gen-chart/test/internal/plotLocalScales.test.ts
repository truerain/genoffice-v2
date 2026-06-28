/**
 * @file packages/gen-chart/test/internal/plotLocalScales.test.ts
 * @description Plot-local scale adapter tests for visx layers.
 * @created 2026-06-27
 *
 * @remark
 */

import { describe, expect, it } from 'vitest';
import { computeCartesianState } from '../../src/core/model/computeCartesianState';
import { createPlotLocalScales, plotAxisOrigin } from '../../src/internal/visx/plotLocalScales';

type Point = { label: string; value: number };

describe('createPlotLocalScales', () => {
  const layout = { width: 400, height: 300 };

  it('maps y domain min to plot bottom (local height)', () => {
    const state = computeCartesianState(
      {
        series: [
          {
            id: 's1',
            type: 'line',
            data: [
              { label: 'A', value: 10 },
              { label: 'B', value: 30 },
            ],
            x: (d: Point) => d.label,
            y: (d: Point) => d.value,
          },
        ],
      },
      layout,
      new Map(),
    );

    const local = createPlotLocalScales(state.scales, state.plotArea);
    const [yMin, yMax] = state.yDomain;

    expect(local.yScale(yMin)).toBe(state.plotArea.height);
    expect(local.yScale(yMax)).toBe(0);
  });

  it('maps x band scale to local width range', () => {
    const state = computeCartesianState(
      {
        series: [
          {
            id: 's1',
            type: 'line',
            data: [{ label: 'A', value: 10 }],
            x: (d: Point) => d.label,
            y: (d: Point) => d.value,
          },
        ],
      },
      layout,
      new Map(),
    );

    const local = createPlotLocalScales(state.scales, state.plotArea);
    const band = local.xScale as import('d3-scale').ScaleBand<string>;
    const range = band.range();

    expect(range[0]).toBe(0);
    expect(range[1]).toBe(state.plotArea.width);
  });

  it('exposes axis origin at plot bottom-left in local coords', () => {
    const state = computeCartesianState(
      {
        series: [
          {
            id: 's1',
            type: 'line',
            data: [{ label: 'A', value: 10 }],
            x: (d: Point) => d.label,
            y: (d: Point) => d.value,
          },
        ],
      },
      layout,
      new Map(),
    );

    expect(plotAxisOrigin(state.plotArea)).toEqual({
      x: 0,
      y: state.plotArea.height,
    });
  });
});

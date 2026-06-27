/**
 * @file packages/gen-chart/test/core/createCartesianModel.test.ts
 * @description createCartesianModel integration tests (Gate C1).
 * @created 2026-06-27
 *
 * @remark
 */
import { describe, expect, it } from 'vitest';
import { createCartesianModel } from '../../src/core/createCartesianModel';
import { computeCartesianState } from '../../src/core/model/computeCartesianState';

type Point = { label: string; value: number; high?: number };

const layout = { width: 400, height: 300 };

describe('createCartesianModel', () => {
  it('returns visible series and plot area', () => {
    const model = createCartesianModel<Point>(
      {
        series: [
          {
            id: 'revenue',
            type: 'line',
            data: [
              { label: 'Jan', value: 10 },
              { label: 'Feb', value: 20 },
            ],
            x: (d) => d.label,
            y: (d) => d.value,
          },
        ],
      },
      layout,
    );

    expect(model.visibleSeries).toHaveLength(1);
    expect(model.plotArea.width).toBeGreaterThan(0);
    expect(model.plotArea.height).toBeGreaterThan(0);
  });

  it('recomputes y domain when series visibility toggles', () => {
    const model = createCartesianModel<Point>(
      {
        series: [
          {
            id: 'low',
            type: 'line',
            data: [{ label: 'A', value: 5 }],
            x: (d) => d.label,
            y: (d) => d.value,
          },
          {
            id: 'high',
            type: 'line',
            data: [{ label: 'A', value: 100 }],
            x: (d) => d.label,
            y: (d) => d.value,
          },
        ],
      },
      layout,
    );

    const fullState = computeCartesianState(
      {
        series: [
          {
            id: 'low',
            type: 'line',
            data: [{ label: 'A', value: 5 }],
            x: (d) => d.label,
            y: (d) => d.value,
          },
          {
            id: 'high',
            type: 'line',
            data: [{ label: 'A', value: 100 }],
            x: (d) => d.label,
            y: (d) => d.value,
          },
        ],
      },
      layout,
      new Map(),
    );

    model.setSeriesVisibility('high', false);
    const hiddenHigh = computeCartesianState(
      {
        series: [
          {
            id: 'low',
            type: 'line',
            data: [{ label: 'A', value: 5 }],
            x: (d) => d.label,
            y: (d) => d.value,
          },
          {
            id: 'high',
            type: 'line',
            data: [{ label: 'A', value: 100 }],
            x: (d) => d.label,
            y: (d) => d.value,
          },
        ],
      },
      layout,
      new Map([['high', false]]),
    );

    expect(fullState.yDomain[1]).toBeGreaterThan(hiddenHigh.yDomain[1]);
    expect(model.visibleSeries).toHaveLength(1);
    expect(model.visibleSeries[0]?.id).toBe('low');
  });

  it('getNearestDatum returns closest point', () => {
    const model = createCartesianModel<Point>(
      {
        series: [
          {
            id: 's1',
            type: 'line',
            data: [
              { label: 'Jan', value: 0 },
              { label: 'Feb', value: 100 },
            ],
            x: (d) => d.label,
            y: (d) => d.value,
          },
        ],
      },
      layout,
    );

    const state = computeCartesianState(
      {
        series: [
          {
            id: 's1',
            type: 'line',
            data: [
              { label: 'Jan', value: 0 },
              { label: 'Feb', value: 100 },
            ],
            x: (d) => d.label,
            y: (d) => d.value,
          },
        ],
      },
      layout,
      new Map(),
    );

    const feb = state.geometries.hitPoints.find((p) => p.datumIndex === 1);
    expect(feb).toBeDefined();

    const nearest = model.getNearestDatum(feb!.px, feb!.py);
    expect(nearest).not.toBeNull();
    expect(nearest?.index).toBe(1);
    expect(nearest?.value).toBe(100);
  });

  it('toggleSeries flips visibility', () => {
    const model = createCartesianModel<Point>(
      {
        series: [
          {
            id: 'a',
            type: 'line',
            data: [{ label: 'X', value: 1 }],
            x: (d) => d.label,
            y: (d) => d.value,
          },
        ],
      },
      layout,
    );

    expect(model.visibleSeries).toHaveLength(1);
    model.toggleSeries('a');
    expect(model.visibleSeries).toHaveLength(0);
    model.toggleSeries('a');
    expect(model.visibleSeries).toHaveLength(1);
  });
});

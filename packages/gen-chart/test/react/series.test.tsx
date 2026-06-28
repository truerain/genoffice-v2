/**
 * @file packages/gen-chart/test/react/series.test.tsx
 * @description Series SVG renderer tests (Gate C4).
 * @created 2026-06-27
 *
 * @remark
 */

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { buildCartesianGeometries } from '../../src/core/geometry/cartesian/buildGeometries';
import { computeCartesianState } from '../../src/core/model/computeCartesianState';
import { ChartRoot } from '../../src/react/components/ChartRoot';
import {
  AreaSeries,
  BarSeries,
  CartesianChart,
  CartesianPlot,
  LineSeries,
} from '../../src/react/components/cartesian';

type Point = { label: string; value: number };

const layout = { width: 400, height: 300 };

const composedOptions = {
  series: [
    {
      id: 'line',
      type: 'line' as const,
      data: [
        { label: 'A', value: 10 },
        { label: 'B', value: 30 },
      ],
      x: (d: Point) => d.label,
      y: (d: Point) => d.value,
    },
    {
      id: 'bar',
      type: 'bar' as const,
      data: [{ label: 'A', value: 20 }],
      x: (d: Point) => d.label,
      y: (d: Point) => d.value,
      layout: 'grouped' as const,
    },
    {
      id: 'area',
      type: 'area' as const,
      data: [
        { label: 'A', value: 5 },
        { label: 'B', value: 15 },
      ],
      x: (d: Point) => d.label,
      y: (d: Point) => d.value,
    },
  ],
};

describe('cartesian series renderers', () => {
  it('renders line polyline points from core geometry', () => {
    const state = computeCartesianState(composedOptions, layout, new Map());
    const line = state.geometries.lines.find((item) => item.seriesId === 'line')!;

    const { container } = render(
      <ChartRoot width={400} height={300} options={composedOptions}>
        <CartesianChart>
          <CartesianPlot>
            <LineSeries seriesId="line" />
          </CartesianPlot>
        </CartesianChart>
      </ChartRoot>,
    );

    const polyline = container.querySelector('[data-gen-chart-line][data-series-id="line"]');
    expect(polyline?.tagName.toLowerCase()).toBe('polyline');
    expect(polyline?.getAttribute('points')).toBe(
      line.points.map((p) => `${p.x},${p.y}`).join(' '),
    );
  });

  it('renders bar rects aligned with core geometry', () => {
    const state = computeCartesianState(composedOptions, layout, new Map());
    const bar = state.geometries.bars.find((item) => item.seriesId === 'bar')!;

    const { container } = render(
      <ChartRoot width={400} height={300} options={composedOptions}>
        <CartesianChart>
          <CartesianPlot>
            <BarSeries seriesId="bar" />
          </CartesianPlot>
        </CartesianChart>
      </ChartRoot>,
    );

    const rect = container.querySelector('[data-gen-chart-bar] rect');
    expect(Number(rect?.getAttribute('x'))).toBeCloseTo(bar.x, 5);
    expect(Number(rect?.getAttribute('y'))).toBeCloseTo(bar.y, 5);
    expect(Number(rect?.getAttribute('width'))).toBeCloseTo(bar.width, 5);
    expect(Number(rect?.getAttribute('height'))).toBeCloseTo(bar.height, 5);
  });

  it('renders area path from core geometry', () => {
    const state = computeCartesianState(composedOptions, layout, new Map());
    const area = state.geometries.areas.find((item) => item.seriesId === 'area')!;

    const { container } = render(
      <ChartRoot width={400} height={300} options={composedOptions}>
        <CartesianChart>
          <CartesianPlot>
            <AreaSeries seriesId="area" />
          </CartesianPlot>
        </CartesianChart>
      </ChartRoot>,
    );

    const path = container.querySelector('[data-gen-chart-area]');
    expect(path?.getAttribute('d')).toBe(area.path);
  });

  it('bar y domain includes zero baseline by default', () => {
    const state = computeCartesianState(
      {
        series: [
          {
            id: 'bar',
            type: 'bar',
            data: [{ label: 'A', value: 50 }],
            x: (d: Point) => d.label,
            y: (d: Point) => d.value,
          },
        ],
      },
      layout,
      new Map(),
    );

    expect(state.yDomain[0]).toBeLessThanOrEqual(0);
    expect(buildCartesianGeometries(state.normalizedSeries.filter((s) => !s.excluded), state.scales).bars[0]?.height).toBeGreaterThan(0);
  });
});

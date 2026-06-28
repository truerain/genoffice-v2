/**
 * @file packages/gen-chart/test/react/polarSeries.test.tsx
 * @description Polar series SVG renderer tests (Gate C5).
 * @created 2026-06-27
 *
 * @remark
 */

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { computePolarState } from '../../src/core/model/computePolarState';
import { DonutSeries, PieSeries, PolarChart, PolarPlot } from '../../src/react/components/polar';

type Slice = { name: string; amount: number };

const layout = { width: 400, height: 300 };

const pieOptions = {
  series: [
    {
      id: 'sales',
      data: [
        { name: 'A', amount: 30 },
        { name: 'B', amount: 70 },
      ],
      value: (d: Slice) => d.amount,
      labelKey: (d: Slice) => d.name,
    },
  ],
};

const donutOptions = {
  series: [
    {
      id: 'share',
      data: [
        { name: 'X', amount: 40 },
        { name: 'Y', amount: 60 },
      ],
      value: (d: Slice) => d.amount,
      innerRadiusRatio: 0.5,
    },
  ],
};

describe('polar series renderers', () => {
  it('renders pie slice paths from core geometry', () => {
    const state = computePolarState(pieOptions, layout, new Map());
    const coreArcs = state.geometries.arcs.filter((arc) => arc.seriesId === 'sales');

    const { container } = render(
      <PolarChart width={400} height={300} options={pieOptions}>
        <PolarPlot>
          <PieSeries seriesId="sales" />
        </PolarPlot>
      </PolarChart>,
    );

    const group = container.querySelector('[data-gen-chart-polar-series][data-series-id="sales"]');
    expect(group?.getAttribute('transform')).toBe(
      `translate(${coreArcs[0]!.cx}, ${coreArcs[0]!.cy})`,
    );

    const paths = container.querySelectorAll('[data-gen-chart-polar-slice][data-series-id="sales"]');
    expect(paths).toHaveLength(2);
    expect(paths[0]?.getAttribute('d')).toBe(coreArcs[0]!.path);
    expect(paths[1]?.getAttribute('d')).toBe(coreArcs[1]!.path);
  });

  it('renders donut slice paths from core geometry', () => {
    const state = computePolarState(donutOptions, layout, new Map());
    const coreArcs = state.geometries.arcs.filter((arc) => arc.seriesId === 'share');

    const { container } = render(
      <PolarChart width={400} height={300} options={donutOptions}>
        <PolarPlot>
          <DonutSeries seriesId="share" />
        </PolarPlot>
      </PolarChart>,
    );

    const paths = container.querySelectorAll('[data-gen-chart-polar-slice][data-series-id="share"]');
    expect(paths).toHaveLength(2);
    expect(paths[0]?.getAttribute('d')).toBe(coreArcs[0]!.path);
    expect(Number(coreArcs[0]!.innerRadius)).toBeGreaterThan(0);
  });

  it('PieSeries ignores donut series', () => {
    const { container } = render(
      <PolarChart width={400} height={300} options={donutOptions}>
        <PolarPlot>
          <PieSeries seriesId="share" />
        </PolarPlot>
      </PolarChart>,
    );

    expect(container.querySelector('[data-gen-chart-polar-slice]')).toBeNull();
  });

  it('DonutSeries ignores pie series', () => {
    const { container } = render(
      <PolarChart width={400} height={300} options={pieOptions}>
        <PolarPlot>
          <DonutSeries seriesId="sales" />
        </PolarPlot>
      </PolarChart>,
    );

    expect(container.querySelector('[data-gen-chart-polar-slice]')).toBeNull();
  });
});

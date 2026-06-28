/**
 * @file packages/gen-chart/test/react/cartesianPrimitives.test.tsx
 * @description Cartesian primitive component tests (Gate C3).
 * @created 2026-06-27
 *
 * @remark
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  CartesianChart,
  CartesianPlot,
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
} from '../../src/react/components/cartesian';
import { ChartRoot } from '../../src/react/components/ChartRoot';

type Point = { label: string; value: number };

const chartOptions = {
  series: [
    {
      id: 'sales',
      type: 'line' as const,
      data: [
        { label: 'A', value: 10 },
        { label: 'B', value: 30 },
        { label: 'C', value: 20 },
      ],
      x: (d: Point) => d.label,
      y: (d: Point) => d.value,
    },
  ],
};

function renderCartesianPlot() {
  return render(
    <ChartRoot width={400} height={300} options={chartOptions}>
      <CartesianChart>
        <CartesianPlot>
          <ChartGrid />
          <ChartYAxis />
          <ChartXAxis />
        </CartesianPlot>
      </CartesianChart>
    </ChartRoot>,
  );
}

describe('cartesian primitives', () => {
  it('renders svg plot surface with grid and axes', () => {
    const { container } = renderCartesianPlot();

    expect(container.querySelector('[data-gen-chart-cartesian-plot]')).toBeTruthy();
    expect(container.querySelector('[data-gen-chart-grid]')).toBeTruthy();
    expect(container.querySelector('[data-gen-chart-x-axis]')).toBeTruthy();
    expect(container.querySelector('[data-gen-chart-y-axis]')).toBeTruthy();
  });

  it('shows empty state when no series are provided', () => {
    render(
      <ChartRoot width={400} height={300} options={{ series: [] }}>
        <CartesianChart>
          <CartesianPlot />
        </CartesianChart>
      </ChartRoot>,
    );

    expect(screen.getByText('No data to display')).toBeInTheDocument();
  });
});

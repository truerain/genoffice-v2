/**
 * @file packages/gen-chart/test/react/interaction.test.tsx
 * @description Tooltip and legend interaction tests (Gate C6).
 * @created 2026-06-27
 *
 * @remark
 */

import { act, fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChartRoot } from '../../src/react/components/ChartRoot';
import {
  BarSeries,
  CartesianChart,
  CartesianPlot,
  LineSeries,
} from '../../src/react/components/cartesian';
import { ChartLegend, ChartTooltip } from '../../src/react/components/chrome';

type Point = { label: string; value: number; alt: number };

const options = {
  series: [
    {
      id: 'primary',
      label: 'Primary',
      type: 'line' as const,
      data: [
        { label: 'A', value: 10, alt: 100 },
        { label: 'B', value: 40, alt: 200 },
      ],
      x: (d: Point) => d.label,
      y: (d: Point) => d.value,
    },
    {
      id: 'secondary',
      label: 'Secondary',
      type: 'bar' as const,
      data: [
        { label: 'A', value: 5, alt: 50 },
        { label: 'B', value: 15, alt: 150 },
      ],
      x: (d: Point) => d.label,
      y: (d: Point) => d.alt,
    },
  ],
  interactive: {
    tooltip: true,
    legend: true,
  },
};

function InteractionChart() {
  return (
    <ChartRoot width={400} height={300} options={options}>
      <CartesianChart>
        <ChartLegend />
        <CartesianPlot>
          <LineSeries seriesId="primary" />
          <BarSeries seriesId="secondary" />
        </CartesianPlot>
        <ChartTooltip />
      </CartesianChart>
    </ChartRoot>
  );
}

describe('chart interaction chrome', () => {
  it('legend toggle hides series and recomputes yDomain', () => {
    const { container } = render(<InteractionChart />);

    const secondaryLegend = container.querySelector(
      '[data-gen-chart-legend-item][data-series-id="secondary"]',
    ) as HTMLButtonElement;
    expect(secondaryLegend).toHaveAttribute('data-visible', 'true');

    const barBefore = container.querySelector('[data-gen-chart-bar]');
    expect(barBefore).not.toBeNull();

    act(() => {
      fireEvent.click(secondaryLegend);
    });

    expect(secondaryLegend).toHaveAttribute('data-visible', 'false');
    expect(container.querySelector('[data-gen-chart-bar]')).toBeNull();

    act(() => {
      fireEvent.click(secondaryLegend);
    });
    expect(secondaryLegend).toHaveAttribute('data-visible', 'true');
    expect(container.querySelector('[data-gen-chart-bar]')).not.toBeNull();
  });

  it('tooltip appears on pointer move over plot hit layer', () => {
    const { container } = render(<InteractionChart />);

    const hitLayer = container.querySelector('[data-gen-chart-tooltip-hit]') as HTMLDivElement;
    expect(hitLayer).toBeTruthy();

    hitLayer.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        width: 400,
        height: 300,
        right: 400,
        bottom: 300,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;

    fireEvent.pointerMove(hitLayer, {
      clientX: 120,
      clientY: 92,
    });

    const tooltip = container.querySelector('[data-gen-chart-tooltip]');
    expect(tooltip).toBeTruthy();
    expect(tooltip?.querySelector('[data-gen-chart-tooltip-title]')?.textContent?.length).toBeGreaterThan(0);
    expect(tooltip?.querySelector('[data-gen-chart-tooltip-value]')?.textContent?.length).toBeGreaterThan(0);
  });

  it('tooltip clears on pointer leave', () => {
    const { container } = render(<InteractionChart />);

    const hitLayer = container.querySelector('[data-gen-chart-tooltip-hit]') as HTMLDivElement;
    hitLayer.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        width: 400,
        height: 300,
        right: 400,
        bottom: 300,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;

    fireEvent.pointerMove(hitLayer, { clientX: 120, clientY: 92 });
    expect(container.querySelector('[data-gen-chart-tooltip]')).toBeTruthy();

    fireEvent.pointerLeave(hitLayer);
    expect(container.querySelector('[data-gen-chart-tooltip]')).toBeNull();
  });

  it('tooltip stays visible near bottom x-axis region', () => {
    const { container } = render(<InteractionChart />);

    const hitLayer = container.querySelector('[data-gen-chart-tooltip-hit]') as HTMLDivElement;
    hitLayer.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        width: 400,
        height: 300,
        right: 400,
        bottom: 300,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;

    fireEvent.pointerMove(hitLayer, { clientX: 200, clientY: 285 });

    expect(container.querySelector('[data-gen-chart-tooltip]')).toBeTruthy();
  });

  it('does not render chrome when interactive flags are disabled', () => {
    const { container } = render(
      <ChartRoot
        width={400}
        height={300}
        options={{
          ...options,
          interactive: { tooltip: false, legend: false },
        }}
      >
        <CartesianChart>
          <ChartLegend />
          <CartesianPlot>
            <LineSeries seriesId="primary" />
            <ChartTooltip />
          </CartesianPlot>
        </CartesianChart>
      </ChartRoot>,
    );

    expect(container.querySelector('[data-gen-chart-legend]')).toBeNull();
    expect(container.querySelector('[data-gen-chart-tooltip-hit]')).toBeNull();
  });
});

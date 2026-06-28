/**
 * @file packages/gen-chart/test/react/useGenChart.test.tsx
 * @description useGenChart and chart context hook tests (Gate C2).
 * @created 2026-06-27
 *
 * @remark
 */

import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { computeLegendReserveHeight } from '../../src/core/layout/computePlotArea';
import { lightChartTokens } from '../../src/themes/lightChartTokens';
import { useGenChart } from '../../src/react/hooks/useGenChart';
import { ChartRoot } from '../../src/react/components/ChartRoot';
import { CartesianChart } from '../../src/react/components/cartesian';
import { useChartContext } from '../../src/react/context/ChartContext';
import { usePlotContext } from '../../src/react/context/PlotContext';
import { render, screen } from '@testing-library/react';

type Point = { label: string; value: number };

const seriesOptions = {
  series: [
    {
      id: 'revenue',
      type: 'line' as const,
      data: [
        { label: 'Jan', value: 10 },
        { label: 'Feb', value: 20 },
      ],
      x: (d: Point) => d.label,
      y: (d: Point) => d.value,
    },
  ],
};

describe('useGenChart', () => {
  const baseHookOptions = {
    ...seriesOptions,
    width: 400,
    height: 300,
  };

  it('returns layout metrics and plot area', () => {
    const { result } = renderHook(() => useGenChart(baseHookOptions));

    expect(result.current.width).toBe(400);
    expect(result.current.height).toBe(300);
    expect(result.current.plotArea.width).toBeGreaterThan(0);
    expect(result.current.visibleSeries).toHaveLength(1);
  });

  it('shrinks plot area when legend reserve is enabled', () => {
    const { result: withoutLegend } = renderHook(() => useGenChart(baseHookOptions));

    const { result: withLegend } = renderHook(() =>
      useGenChart({
        ...baseHookOptions,
        interactive: { legend: true },
      }),
    );

    const reserve = computeLegendReserveHeight(lightChartTokens);
    const expectedDelta = reserve;

    expect(withLegend.current.plotArea.height).toBe(
      withoutLegend.current.plotArea.height - expectedDelta,
    );
  });

  it('re-renders when series visibility toggles', () => {
    const { result } = renderHook(() => useGenChart(baseHookOptions));

    expect(result.current.visibleSeries).toHaveLength(1);

    act(() => {
      result.current.toggleSeries('revenue');
    });

    expect(result.current.visibleSeries).toHaveLength(0);
  });
});

describe('ChartRoot context', () => {
  function ContextProbe() {
    const { chart, tokens } = useChartContext<Point>();
    const { plotArea, width, height } = usePlotContext();

    return (
      <div
        data-testid="probe"
        data-chart-width={chart.width}
        data-plot-width={width}
        data-plot-height={height}
        data-legend-font={tokens.typography.legendFontSize}
        data-plot-x={plotArea.x}
      />
    );
  }

  it('provides chart and plot context through ChartRoot and CartesianChart', () => {
    render(
      <ChartRoot width={400} height={300} options={seriesOptions}>
        <CartesianChart>
          <ContextProbe />
        </CartesianChart>
      </ChartRoot>,
    );

    const probe = screen.getByTestId('probe');
    expect(probe).toHaveAttribute('data-chart-width', '400');
    expect(Number(probe.getAttribute('data-plot-width'))).toBeGreaterThan(0);
    expect(Number(probe.getAttribute('data-plot-height'))).toBeGreaterThan(0);
    expect(probe).toHaveAttribute('data-legend-font', String(lightChartTokens.typography.legendFontSize));
  });
});

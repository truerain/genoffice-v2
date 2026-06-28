/**
 * @file packages/gen-chart/src/react/components/cartesian/CartesianSeries.stories.tsx
 * @description Storybook stories for line, bar, area series (Gate C4).
 * @created 2026-06-27
 *
 * @remark
 * - title: GenChart/CartesianSeries
 */

import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import '../../../index.css';
import type { CartesianChartOptions } from '../../../types/options';
import { ChartRoot } from '../ChartRoot';
import { ResponsiveChartContainer } from '../ResponsiveChartContainer';
import {
  AreaSeries,
  BarSeries,
  CartesianChart,
  CartesianPlot,
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
  LineSeries,
} from './index';

type MonthlyPoint = { month: string; revenue: number; cost: number };

const monthlyData: MonthlyPoint[] = [
  { month: 'Jan', revenue: 120, cost: 80 },
  { month: 'Feb', revenue: 150, cost: 95 },
  { month: 'Mar', revenue: 180, cost: 110 },
  { month: 'Apr', revenue: 140, cost: 100 },
  { month: 'May', revenue: 210, cost: 130 },
  { month: 'Jun', revenue: 190, cost: 125 },
];

const frameStyle: CSSProperties = {
  width: '100%',
  maxWidth: 720,
  height: 360,
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid var(--color-border-default)',
  borderRadius: 8,
  overflow: 'hidden',
  minHeight: 0,
};

function SeriesChartDemo({
  options,
}: {
  options: CartesianChartOptions<MonthlyPoint>;
}) {
  return (
    <div style={frameStyle}>
      <ResponsiveChartContainer minHeight={280}>
        {(size) =>
          size.ready ? (
            <ChartRoot width={size.width} height={size.height} options={options}>
              <CartesianChart>
                <CartesianPlot>
                  <ChartGrid />
                  <ChartYAxis />
                  <ChartXAxis />
                  {options.series.map((s) => {
                    if (s.type === 'line') return <LineSeries key={s.id} seriesId={s.id} />;
                    if (s.type === 'bar') return <BarSeries key={s.id} seriesId={s.id} />;
                    if (s.type === 'area') return <AreaSeries key={s.id} seriesId={s.id} />;
                    return null;
                  })}
                </CartesianPlot>
              </CartesianChart>
            </ChartRoot>
          ) : null
        }
      </ResponsiveChartContainer>
    </div>
  );
}

const meta: Meta<typeof SeriesChartDemo> = {
  title: 'GenChart/CartesianSeries',
  component: SeriesChartDemo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Gate C4 — line, bar, area series render from core geometry. Layer order follows JSX child order (grid → axes → areas → bars → lines recommended).',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = {
  render: () => (
    <SeriesChartDemo
      options={{
        series: [
          {
            id: 'revenue',
            type: 'line',
            data: monthlyData,
            x: (d) => d.month,
            y: (d) => d.revenue,
          },
        ],
      }}
    />
  ),
};

export const BarGrouped: Story = {
  name: 'Bar (grouped)',
  render: () => (
    <SeriesChartDemo
      options={{
        series: [
          {
            id: 'revenue',
            type: 'bar',
            data: monthlyData,
            x: (d) => d.month,
            y: (d) => d.revenue,
            layout: 'grouped',
          },
          {
            id: 'cost',
            type: 'bar',
            data: monthlyData,
            x: (d) => d.month,
            y: (d) => d.cost,
            layout: 'grouped',
          },
        ],
      }}
    />
  ),
};

export const BarStacked: Story = {
  name: 'Bar (stacked)',
  render: () => (
    <SeriesChartDemo
      options={{
        series: [
          {
            id: 'revenue',
            type: 'bar',
            data: monthlyData,
            x: (d) => d.month,
            y: (d) => d.revenue,
            layout: 'stacked',
            stackId: 'total',
          },
          {
            id: 'cost',
            type: 'bar',
            data: monthlyData,
            x: (d) => d.month,
            y: (d) => d.cost,
            layout: 'stacked',
            stackId: 'total',
          },
        ],
      }}
    />
  ),
};

export const Area: Story = {
  render: () => (
    <SeriesChartDemo
      options={{
        series: [
          {
            id: 'revenue',
            type: 'area',
            data: monthlyData,
            x: (d) => d.month,
            y: (d) => d.revenue,
          },
        ],
      }}
    />
  ),
};

export const Composed: Story = {
  name: 'Composed (bar + line)',
  render: () => (
    <SeriesChartDemo
      options={{
        series: [
          {
            id: 'cost',
            type: 'bar',
            data: monthlyData,
            x: (d) => d.month,
            y: (d) => d.cost,
            layout: 'grouped',
          },
          {
            id: 'revenue',
            type: 'line',
            data: monthlyData,
            x: (d) => d.month,
            y: (d) => d.revenue,
          },
        ],
      }}
    />
  ),
};

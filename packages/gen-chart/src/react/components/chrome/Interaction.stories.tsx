/**
 * @file packages/gen-chart/src/react/components/chrome/Interaction.stories.tsx
 * @description Storybook stories for tooltip and legend (Gate C6).
 * @created 2026-06-27
 *
 * @remark
 * - title: GenChart/Interaction
 */

import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import '../../../index.css';
import type { CartesianChartOptions } from '../../../types/options';
import { ChartRoot } from '../ChartRoot';
import { ResponsiveChartContainer } from '../ResponsiveChartContainer';
import {
  BarSeries,
  CartesianChart,
  CartesianPlot,
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
  LineSeries,
} from '../cartesian';
import { ChartLegend, ChartTooltip } from './index';

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
  height: 400,
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid var(--color-border-default)',
  borderRadius: 8,
  overflow: 'hidden',
  minHeight: 0,
};

function InteractionDemo({
  options,
}: {
  options: CartesianChartOptions<MonthlyPoint>;
}) {
  return (
    <div style={frameStyle}>
      <ResponsiveChartContainer minHeight={320} style={{ flex: 1, minHeight: 0, width: '100%' }}>
        {(size) =>
          size.ready ? (
            <ChartRoot width={size.width} height={size.height} options={options}>
              <CartesianChart>
                <ChartLegend />
                <CartesianPlot>
                  <ChartGrid />
                  <ChartYAxis />
                  <ChartXAxis />
                  <BarSeries seriesId="cost" />
                  <LineSeries seriesId="revenue" />
                </CartesianPlot>
                <ChartTooltip />
              </CartesianChart>
            </ChartRoot>
          ) : null
        }
      </ResponsiveChartContainer>
    </div>
  );
}

const meta: Meta<typeof InteractionDemo> = {
  title: 'GenChart/Interaction',
  component: InteractionDemo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Gate C6 — ChartTooltip uses getNearestDatum on plot pointer; ChartLegend toggles series visibility and recomputes cartesian yDomain.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ComposedWithTooltipAndLegend: Story = {
  name: 'Composed (tooltip + legend)',
  render: () => (
    <InteractionDemo
      options={{
        series: [
          {
            id: 'cost',
            label: 'Cost',
            type: 'bar',
            data: monthlyData,
            x: (d) => d.month,
            y: (d) => d.cost,
            layout: 'grouped',
          },
          {
            id: 'revenue',
            label: 'Revenue',
            type: 'line',
            data: monthlyData,
            x: (d) => d.month,
            y: (d) => d.revenue,
          },
        ],
        interactive: {
          tooltip: true,
          legend: { enabled: true, position: 'top', align: 'start' },
        },
      }}
    />
  ),
};

export const LegendBottom: Story = {
  name: 'Legend bottom',
  render: () => (
    <InteractionDemo
      options={{
        series: [
          {
            id: 'cost',
            label: 'Cost',
            type: 'bar',
            data: monthlyData,
            x: (d) => d.month,
            y: (d) => d.cost,
          },
          {
            id: 'revenue',
            label: 'Revenue',
            type: 'line',
            data: monthlyData,
            x: (d) => d.month,
            y: (d) => d.revenue,
          },
        ],
        interactive: {
          tooltip: true,
          legend: { enabled: true, position: 'bottom', align: 'center' },
        },
      }}
    />
  ),
};

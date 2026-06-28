/**
 * @file packages/gen-chart/src/react/components/motion/Motion.stories.tsx
 * @description Storybook stories for chart enter motion (Gate C6b).
 * @created 2026-06-27
 *
 * @remark
 * - title: GenChart/Motion
 */

import { useState, type CSSProperties } from 'react';
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
} from '../cartesian';
import { PieSeries, PolarChart, PolarPlot } from '../polar';

type MonthlyPoint = { month: string; revenue: number; cost: number };
type Slice = { category: string; value: number };

const monthlyData: MonthlyPoint[] = [
  { month: 'Jan', revenue: 120, cost: 80 },
  { month: 'Feb', revenue: 150, cost: 95 },
  { month: 'Mar', revenue: 180, cost: 110 },
  { month: 'Apr', revenue: 140, cost: 100 },
  { month: 'May', revenue: 210, cost: 130 },
  { month: 'Jun', revenue: 190, cost: 125 },
];

const pieData: Slice[] = [
  { category: 'Product A', value: 35 },
  { category: 'Product B', value: 25 },
  { category: 'Product C', value: 20 },
  { category: 'Product D', value: 12 },
  { category: 'Product E', value: 8 },
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

function CartesianMotionDemo({
  options,
  replayKey,
}: {
  options: CartesianChartOptions<MonthlyPoint>;
  replayKey?: string | number;
}) {
  return (
    <div style={frameStyle}>
      <ResponsiveChartContainer minHeight={320} style={{ flex: 1, minHeight: 0, width: '100%' }}>
        {(size) =>
          size.ready ? (
            <ChartRoot width={size.width} height={size.height} options={options}>
              <CartesianChart>
                <CartesianPlot>
                  <ChartGrid />
                  <ChartYAxis />
                  <ChartXAxis />
                  <BarSeries seriesId="cost" />
                  <AreaSeries seriesId="revenue-area" />
                  <LineSeries seriesId="revenue-line" />
                </CartesianPlot>
              </CartesianChart>
            </ChartRoot>
          ) : null
        }
      </ResponsiveChartContainer>
      {replayKey != null ? (
        <p style={{ margin: '8px 12px', fontSize: 12, color: 'var(--color-text-secondary)' }}>
          Replay key: {String(replayKey)}
        </p>
      ) : null}
    </div>
  );
}

const meta: Meta<typeof CartesianMotionDemo> = {
  title: 'GenChart/Motion',
  component: CartesianMotionDemo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Gate C6b — CSS enter motion for line, bar, area, and pie. Honors prefers-reduced-motion and disables automatically for ≥ 2000 points.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const EnterComposed: Story = {
  name: 'Enter (composed)',
  render: () => (
    <CartesianMotionDemo
      options={{
        motion: { mode: 'enter', durationMs: 480, easing: 'easeOut' },
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
            id: 'revenue-area',
            type: 'area',
            data: monthlyData,
            x: (d) => d.month,
            y: (d) => d.revenue,
          },
          {
            id: 'revenue-line',
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

export const ResetOnChange: Story = {
  name: 'Reset on change',
  render: function ResetOnChangeStory() {
    const [changeKey, setChangeKey] = useState(0);

    return (
      <div>
        <button
          type="button"
          onClick={() => setChangeKey((value) => value + 1)}
          style={{ marginBottom: 12 }}
        >
          Replay enter animation
        </button>
        <CartesianMotionDemo
          replayKey={changeKey}
          options={{
            motion: { mode: 'reset-on-change', changeKey, durationMs: 480 },
            series: [
              {
                id: 'cost',
                type: 'bar',
                data: monthlyData,
                x: (d) => d.month,
                y: (d) => d.cost,
              },
              {
                id: 'revenue-line',
                type: 'line',
                data: monthlyData,
                x: (d) => d.month,
                y: (d) => d.revenue,
              },
            ],
          }}
        />
      </div>
    );
  },
};

export const MotionDisabled: Story = {
  name: 'Motion disabled',
  render: () => (
    <CartesianMotionDemo
      options={{
        motion: { enabled: false },
        series: [
          {
            id: 'cost',
            type: 'bar',
            data: monthlyData,
            x: (d) => d.month,
            y: (d) => d.cost,
          },
          {
            id: 'revenue-line',
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

export const PieEnter: Story = {
  name: 'Pie enter',
  render: () => (
    <div style={frameStyle}>
      <ResponsiveChartContainer minHeight={320} style={{ flex: 1, minHeight: 0, width: '100%' }}>
        {(size) =>
          size.ready ? (
            <PolarChart
              width={size.width}
              height={size.height}
              options={{
                motion: { mode: 'enter', durationMs: 480 },
                series: [
                  {
                    id: 'share',
                    data: pieData,
                    value: (d) => d.value,
                    labelKey: (d) => d.category,
                  },
                ],
              }}
            >
              <PolarPlot>
                <PieSeries seriesId="share" />
              </PolarPlot>
            </PolarChart>
          ) : null
        }
      </ResponsiveChartContainer>
    </div>
  ),
};

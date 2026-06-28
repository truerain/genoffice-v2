/**
 * @file packages/gen-chart/src/react/components/polar/PolarSeries.stories.tsx
 * @description Storybook stories for pie and donut series (Gate C5).
 * @created 2026-06-27
 *
 * @remark
 * - title: GenChart/PolarSeries
 */

import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import '../../../index.css';
import type { PolarChartOptions } from '../../../types/options';
import { ResponsiveChartContainer } from '../ResponsiveChartContainer';
import { DonutSeries, PieSeries, PolarChart, PolarPlot } from './index';

type Slice = { category: string; value: number };

const salesData: Slice[] = [
  { category: 'Product A', value: 35 },
  { category: 'Product B', value: 25 },
  { category: 'Product C', value: 20 },
  { category: 'Product D', value: 12 },
  { category: 'Product E', value: 8 },
];

const frameStyle: CSSProperties = {
  width: '100%',
  maxWidth: 480,
  height: 360,
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid var(--color-border-default)',
  borderRadius: 8,
  overflow: 'hidden',
  minHeight: 0,
};

function PolarSeriesDemo({ options }: { options: PolarChartOptions<Slice> }) {
  const series = options.series[0];
  const isDonut =
    series != null &&
    'innerRadiusRatio' in series &&
    series.innerRadiusRatio != null &&
    series.innerRadiusRatio > 0;

  return (
    <div style={frameStyle}>
      <ResponsiveChartContainer minHeight={280}>
        {(size) =>
          size.ready ? (
            <PolarChart width={size.width} height={size.height} options={options}>
              <PolarPlot>
                {isDonut ? (
                  <DonutSeries seriesId={series!.id} />
                ) : (
                  <PieSeries seriesId={series!.id} />
                )}
              </PolarPlot>
            </PolarChart>
          ) : null
        }
      </ResponsiveChartContainer>
    </div>
  );
}

const meta: Meta<typeof PolarSeriesDemo> = {
  title: 'GenChart/PolarSeries',
  component: PolarSeriesDemo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Gate C5 — pie and donut series render from core arc geometry. Use PieSeries for solid pie; DonutSeries when innerRadiusRatio > 0.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Pie: Story = {
  render: () => (
    <PolarSeriesDemo
      options={{
        series: [
          {
            id: 'sales',
            label: 'Sales by product',
            data: salesData,
            value: (d) => d.value,
            labelKey: (d) => d.category,
          },
        ],
      }}
    />
  ),
};

export const Donut: Story = {
  render: () => (
    <PolarSeriesDemo
      options={{
        series: [
          {
            id: 'share',
            label: 'Market share',
            data: salesData,
            value: (d) => d.value,
            labelKey: (d) => d.category,
            innerRadiusRatio: 0.55,
          },
        ],
      }}
    />
  ),
};

export const DonutThinRing: Story = {
  name: 'Donut (thin ring)',
  render: () => (
    <PolarSeriesDemo
      options={{
        series: [
          {
            id: 'share',
            label: 'Thin ring',
            data: salesData.slice(0, 3),
            value: (d) => d.value,
            labelKey: (d) => d.category,
            innerRadiusRatio: 0.72,
          },
        ],
      }}
    />
  ),
};

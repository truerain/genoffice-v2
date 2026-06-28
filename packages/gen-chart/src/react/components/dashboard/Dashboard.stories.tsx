/**
 * @file packages/gen-chart/src/react/components/dashboard/Dashboard.stories.tsx
 * @description Dashboard card grid with responsive cartesian charts (Gate C7).
 * @created 2026-06-27
 *
 * @remark
 * - title: GenChart/Dashboard
 * - V1 DashboardDemoPage 수용 기준: 카드 레이아웃 내 responsive cartesian
 */

import { useMemo, type CSSProperties, type ReactNode } from 'react';
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
import { ChartLegend, ChartTooltip } from '../chrome';

type MonthlyPoint = { month: string; revenue: number; cost: number; orders: number };

const monthlyData: MonthlyPoint[] = [
  { month: 'Jan', revenue: 120, cost: 80, orders: 42 },
  { month: 'Feb', revenue: 150, cost: 95, orders: 51 },
  { month: 'Mar', revenue: 180, cost: 110, orders: 58 },
  { month: 'Apr', revenue: 140, cost: 100, orders: 47 },
  { month: 'May', revenue: 210, cost: 130, orders: 63 },
  { month: 'Jun', revenue: 190, cost: 125, orders: 59 },
];

const pageStyle: CSSProperties = {
  width: '100%',
  maxWidth: 1080,
  minHeight: 560,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 4,
  boxSizing: 'border-box',
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: 16,
  flex: 1,
  minHeight: 0,
  alignContent: 'start',
};

const cardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: 220,
  minWidth: 0,
  border: '1px solid var(--color-border-default)',
  borderRadius: 8,
  background: 'var(--color-surface-default, #fff)',
  overflow: 'hidden',
};

const cardHeaderStyle: CSSProperties = {
  padding: '10px 12px 0',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--color-text-primary)',
};

const cardBodyStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: '8px 8px 10px',
};

function DashboardChartCard({
  title,
  options,
  children,
  minChartHeight = 160,
}: {
  title: string;
  options: CartesianChartOptions<MonthlyPoint>;
  children: ReactNode;
  minChartHeight?: number;
}) {
  return (
    <section style={cardStyle} data-gen-chart-dashboard-card="">
      <header style={cardHeaderStyle}>{title}</header>
      <div style={cardBodyStyle}>
        <ResponsiveChartContainer
          minHeight={minChartHeight}
          style={{ flex: 1, minHeight: 0, width: '100%' }}
        >
          {(size) =>
            size.ready ? (
              <ChartRoot width={size.width} height={size.height} options={options}>
                <CartesianChart>{children}</CartesianChart>
              </ChartRoot>
            ) : null
          }
        </ResponsiveChartContainer>
      </div>
    </section>
  );
}

function DashboardGridDemo({ frameHeight }: { frameHeight?: number | string }) {
  const revenueTrendOptions = useMemo<CartesianChartOptions<MonthlyPoint>>(
    () => ({
      series: [
        {
          id: 'revenue',
          label: 'Revenue',
          type: 'line',
          data: monthlyData,
          x: (d) => d.month,
          y: (d) => d.revenue,
        },
      ],
      interactive: { tooltip: true },
      motion: { mode: 'enter', durationMs: 240 },
    }),
    [],
  );

  const costBarOptions = useMemo<CartesianChartOptions<MonthlyPoint>>(
    () => ({
      series: [
        {
          id: 'cost',
          label: 'Cost',
          type: 'bar',
          data: monthlyData,
          x: (d) => d.month,
          y: (d) => d.cost,
        },
      ],
      interactive: { tooltip: true },
    }),
    [],
  );

  const ordersAreaOptions = useMemo<CartesianChartOptions<MonthlyPoint>>(
    () => ({
      series: [
        {
          id: 'orders',
          label: 'Orders',
          type: 'area',
          data: monthlyData,
          x: (d) => d.month,
          y: (d) => d.orders,
        },
      ],
      interactive: { tooltip: true },
    }),
    [],
  );

  const composedOptions = useMemo<CartesianChartOptions<MonthlyPoint>>(
    () => ({
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
        legend: { enabled: true, position: 'bottom', align: 'center', reserveSpace: true },
      },
    }),
    [],
  );

  const plotMinimal = (series: ReactNode) => (
    <>
      <CartesianPlot>
        <ChartGrid />
        <ChartYAxis />
        <ChartXAxis />
        {series}
      </CartesianPlot>
      <ChartTooltip />
    </>
  );

  const plotWithLegend = (series: ReactNode) => (
    <>
      <ChartLegend />
      <CartesianPlot>
        <ChartGrid />
        <ChartYAxis />
        <ChartXAxis />
        {series}
      </CartesianPlot>
      <ChartTooltip />
    </>
  );

  return (
    <div
      style={{
        ...pageStyle,
        height: frameHeight,
        resize: typeof frameHeight === 'number' ? 'vertical' : undefined,
        overflow: typeof frameHeight === 'number' ? 'auto' : undefined,
      }}
      data-gen-chart-dashboard=""
    >
      <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-secondary)' }}>
        Resize the browser or the dashed frame — each card chart reflows via ResizeObserver.
      </p>
      <div style={gridStyle}>
        <DashboardChartCard title="Revenue trend" options={revenueTrendOptions}>
          {plotMinimal(<LineSeries seriesId="revenue" />)}
        </DashboardChartCard>

        <DashboardChartCard title="Monthly cost" options={costBarOptions}>
          {plotMinimal(<BarSeries seriesId="cost" />)}
        </DashboardChartCard>

        <DashboardChartCard title="Order volume" options={ordersAreaOptions}>
          {plotMinimal(<AreaSeries seriesId="orders" />)}
        </DashboardChartCard>

        <DashboardChartCard title="Revenue vs cost" options={composedOptions} minChartHeight={180}>
          {plotWithLegend(
            <>
              <BarSeries seriesId="cost" />
              <LineSeries seriesId="revenue" />
            </>,
          )}
        </DashboardChartCard>
      </div>
    </div>
  );
}

const meta: Meta<typeof DashboardGridDemo> = {
  title: 'GenChart/Dashboard',
  component: DashboardGridDemo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Gate C7 — dashboard card grid with ResponsiveChartContainer. Mirrors V1 DashboardDemoPage: multiple cartesian charts in flex/grid cards with tooltip and legend.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    frameHeight: {
      control: { type: 'number', min: 400, max: 900, step: 20 },
      description: 'Outer frame height (px) — drag bottom edge when numeric',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const CardGrid: Story = {
  name: 'Card grid (2×2)',
  args: {
    frameHeight: 640,
  },
};

export const NarrowViewport: Story = {
  name: 'Narrow viewport',
  render: () => (
    <div style={{ width: 360, maxWidth: '100%' }}>
      <DashboardGridDemo />
    </div>
  ),
};

export const WideViewport: Story = {
  name: 'Wide viewport',
  render: () => (
    <div style={{ width: '100%', maxWidth: 1200 }}>
      <DashboardGridDemo frameHeight={720} />
    </div>
  ),
};

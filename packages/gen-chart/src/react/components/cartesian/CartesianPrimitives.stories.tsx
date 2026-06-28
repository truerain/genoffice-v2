/**
 * @file packages/gen-chart/src/react/components/cartesian/CartesianPrimitives.stories.tsx
 * @description Storybook stories for cartesian grid and axes (Gate C3).
 * @created 2026-06-27
 *
 * @remark
 * - title: GenChart/CartesianPrimitives
 * - Controls: yAxis min/max bound modes including `nice`
 */

import type { CSSProperties, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import '../../../index.css';
import type { ChartAxisOptions } from '../../../types/interaction';
import type { CartesianChartOptions } from '../../../types/options';
import { useChartContext } from '../../context/ChartContext';
import { ChartRoot } from '../ChartRoot';
import {
  ResponsiveChartContainer,
  type ResponsiveChartSize,
} from '../ResponsiveChartContainer';
import {
  CartesianChart,
  CartesianPlot,
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
} from './index';

type MonthlyPoint = { month: string; revenue: number; cost: number };

/** Storybook Controls select values → ChartAxisOptions min/max */
type YBoundControl =
  | 'default'
  | 'nice'
  | 'auto'
  | 'dataMin'
  | 'dataMax'
  | 'number';

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

const debugStyle: CSSProperties = {
  margin: 0,
  padding: '8px 12px',
  fontSize: 12,
  fontFamily: 'var(--font-family-mono, ui-monospace, monospace)',
  color: 'var(--color-text-secondary, #6b7280)',
  borderTop: '1px solid var(--color-border-default)',
  background: 'var(--color-surface-subtle, #f9fafb)',
};

function resolveYMin(mode: YBoundControl, numericValue: number): ChartAxisOptions['min'] | undefined {
  switch (mode) {
    case 'default':
      return undefined;
    case 'nice':
    case 'auto':
    case 'dataMin':
      return mode;
    case 'dataMax':
      return undefined;
    case 'number':
      return numericValue;
  }
}

function resolveYMax(mode: YBoundControl, numericValue: number): ChartAxisOptions['max'] | undefined {
  switch (mode) {
    case 'default':
      return undefined;
    case 'nice':
    case 'auto':
    case 'dataMax':
      return mode;
    case 'dataMin':
      return undefined;
    case 'number':
      return numericValue;
  }
}

function buildChartOptions(args: CartesianPrimitivesStoryArgs): CartesianChartOptions<MonthlyPoint> {
  const yAxis: ChartAxisOptions = {
    tickCount: args.yTickCount,
  };

  const yMin = resolveYMin(args.yMinMode, args.yMinNumber);
  const yMax = resolveYMax(args.yMaxMode, args.yMaxNumber);
  if (yMin !== undefined) yAxis.min = yMin;
  if (yMax !== undefined) yAxis.max = yMax;

  return {
    series: [
      {
        id: 'revenue',
        type: 'line',
        data: monthlyData,
        x: (d) => d.month,
        y: (d) => d.revenue,
      },
      {
        id: 'cost',
        type: 'line',
        data: monthlyData,
        x: (d) => d.month,
        y: (d) => d.cost,
        hidden: !args.showCostSeries,
      },
    ],
    xAxis: { tickFormat: (value) => String(value) },
    yAxis,
  };
}

function YDomainDebug() {
  const { chart } = useChartContext<MonthlyPoint>();
  const [yMin, yMax] = chart.yDomain;

  return (
    <p data-testid="y-domain-debug" style={debugStyle}>
      yDomain: [{yMin}, {yMax}] · revenue data min/max: 120, 210
    </p>
  );
}

function CartesianPrimitiveDemo({
  width,
  height,
  options,
  showDomainDebug = false,
}: {
  width: number;
  height: number;
  options: CartesianChartOptions<MonthlyPoint>;
  showDomainDebug?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <ChartRoot width={width} height={height} options={options}>
        <CartesianChart>
          <CartesianPlot>
            <ChartGrid />
            <ChartYAxis />
            <ChartXAxis />
          </CartesianPlot>
        </CartesianChart>
        {showDomainDebug ? <YDomainDebug /> : null}
      </ChartRoot>
    </div>
  );
}

export interface CartesianPrimitivesStoryArgs {
  yMinMode: YBoundControl;
  yMaxMode: YBoundControl;
  yMinNumber: number;
  yMaxNumber: number;
  yTickCount: number;
  showCostSeries: boolean;
  showDomainDebug: boolean;
}

function CartesianPrimitivesPlayground(args: CartesianPrimitivesStoryArgs) {
  const options = buildChartOptions(args);

  return (
    <div style={frameStyle}>
      <ResponsiveChartContainer minHeight={280}>
        {(size) =>
          size.ready ? (
            <CartesianPrimitiveDemo
              width={size.width}
              height={size.height}
              options={options}
              showDomainDebug={args.showDomainDebug}
            />
          ) : null
        }
      </ResponsiveChartContainer>
    </div>
  );
}

const yBoundArgType = {
  control: 'select' as const,
  options: ['default', 'nice', 'auto', 'dataMin', 'dataMax', 'number'] satisfies YBoundControl[],
  description:
    '`default` = omit (d3 nice). `nice`/`auto` = tick-aligned domain. `dataMin`/`dataMax` = exact data bound. `number` = use yMinNumber/yMaxNumber.',
};

const meta: Meta<CartesianPrimitivesStoryArgs> = {
  title: 'GenChart/CartesianPrimitives',
  component: CartesianPrimitivesPlayground,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Gate C3 — cartesian grid and axes. Use **Controls** to change `yAxis` min/max modes (`nice`, `dataMax`, numeric). Enable **showDomainDebug** to read computed `yDomain`.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    yMinMode: {
      ...yBoundArgType,
      name: 'yAxis.min',
    },
    yMaxMode: {
      ...yBoundArgType,
      name: 'yAxis.max',
    },
    yMinNumber: {
      control: { type: 'number' },
      name: 'yAxis.min (number)',
      if: { arg: 'yMinMode', eq: 'number' },
    },
    yMaxNumber: {
      control: { type: 'number' },
      name: 'yAxis.max (number)',
      if: { arg: 'yMaxMode', eq: 'number' },
    },
    yTickCount: {
      control: { type: 'number', min: 2, max: 12, step: 1 },
      name: 'yAxis.tickCount',
    },
    showCostSeries: {
      control: 'boolean',
      description: 'Include cost series in y domain (both series visible).',
    },
    showDomainDebug: {
      control: 'boolean',
      description: 'Show computed yDomain below the chart.',
    },
  },
  args: {
    yMinMode: 'default',
    yMaxMode: 'default',
    yMinNumber: 0,
    yMaxNumber: 300,
    yTickCount: 5,
    showCostSeries: false,
    showDomainDebug: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const YAxisBounds: Story = {
  name: 'Y axis bounds (nice vs dataMax vs numeric)',
  args: {
    showDomainDebug: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Try **yAxis.max**: `nice` (default tick-aligned), `dataMax` (210 exact), `number` + 300/400. Compare **yDomain** readout and left axis ticks.',
      },
    },
  },
};

export const ZeroBaseline: Story = {
  name: 'Y axis min = 0',
  args: {
    showDomainDebug: true,
    yMinMode: 'number',
    yMinNumber: 0,
    yMaxMode: 'default',
  },
};

function renderFixedChart(
  renderChart: (size: ResponsiveChartSize) => ReactNode,
) {
  return (
    <div style={frameStyle}>
      <ResponsiveChartContainer minHeight={280}>
        {(size) => (size.ready ? renderChart(size) : null)}
      </ResponsiveChartContainer>
    </div>
  );
}

export const EmptySeries: Story = {
  render: () =>
    renderFixedChart(({ width, height }) => (
      <CartesianPrimitiveDemo
        width={width}
        height={height}
        options={{ series: [] }}
      />
    )),
  parameters: {
    docs: {
      description: {
        story: 'Open the browser console — `[gen-chart][GC001_EMPTY_SERIES]` should appear in development.',
      },
    },
  },
};

export const InvalidSize: Story = {
  render: () => (
    <div style={frameStyle}>
      <CartesianPrimitiveDemo
        width={0}
        height={0}
        options={buildChartOptions({
          yMinMode: 'default',
          yMaxMode: 'default',
          yMinNumber: 0,
          yMaxNumber: 300,
          yTickCount: 5,
          showCostSeries: false,
          showDomainDebug: false,
        })}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Open the browser console — `[gen-chart][GC002_INVALID_WIDTH]` and `[gen-chart][GC003_INVALID_HEIGHT]` should appear.',
      },
    },
  },
};

export const LegendReserve: Story = {
  render: (_args, { args: storyArgs }) =>
    renderFixedChart(({ width, height }) => (
      <CartesianPrimitiveDemo
        width={width}
        height={height}
        options={{
          ...buildChartOptions(storyArgs as CartesianPrimitivesStoryArgs),
          interactive: { legend: { enabled: true, position: 'bottom' } },
        }}
        showDomainDebug={(storyArgs as CartesianPrimitivesStoryArgs).showDomainDebug}
      />
    )),
  args: {
    showDomainDebug: false,
  },
};

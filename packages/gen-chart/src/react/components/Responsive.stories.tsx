/**
 * @file packages/gen-chart/src/react/components/Responsive.stories.tsx
 * @description ResponsiveChartContainer sizing stories (Gate C7).
 * @created 2026-06-27
 *
 * @remark
 * - title: GenChart/Responsive
 */

import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import '../../index.css';
import type { CartesianChartOptions } from '../../types/options';
import { ChartRoot } from './ChartRoot';
import { ResponsiveChartContainer } from './ResponsiveChartContainer';
import {
  LineSeries,
  CartesianChart,
  CartesianPlot,
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
} from './cartesian';

type Point = { label: string; value: number };

const data: Point[] = [
  { label: 'A', value: 12 },
  { label: 'B', value: 28 },
  { label: 'C', value: 18 },
  { label: 'D', value: 34 },
  { label: 'E', value: 22 },
];

const options: CartesianChartOptions<Point> = {
  series: [
    {
      id: 'primary',
      label: 'Primary',
      type: 'line',
      data,
      x: (d) => d.label,
      y: (d) => d.value,
    },
  ],
};

const shellStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  width: '100%',
  maxWidth: 720,
};

const panelStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  border: '1px dashed var(--color-border-default)',
  borderRadius: 8,
  overflow: 'hidden',
};

function ResponsiveWidthDemo({ initialWidth = 560 }: { initialWidth?: number }) {
  const [width, setWidth] = useState(initialWidth);

  return (
    <div style={shellStyle}>
      <label style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
        Container width: {width}px
        <input
          type="range"
          min={280}
          max={720}
          step={10}
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          style={{ display: 'block', width: '100%', marginTop: 4 }}
        />
      </label>
      <div style={{ ...panelStyle, width, height: 320 }}>
        <ResponsiveChartContainer minHeight={240} style={{ flex: 1, minHeight: 0, width: '100%' }}>
          {(size) =>
            size.ready ? (
              <ChartRoot width={size.width} height={size.height} options={options}>
                <CartesianChart>
                  <CartesianPlot>
                    <ChartGrid />
                    <ChartYAxis />
                    <ChartXAxis />
                    <LineSeries seriesId="primary" />
                  </CartesianPlot>
                </CartesianChart>
              </ChartRoot>
            ) : (
              <div style={{ padding: 12, fontSize: 12 }}>Measuring…</div>
            )
          }
        </ResponsiveChartContainer>
      </div>
      <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-secondary)' }}>
        Reported size is driven by ResizeObserver + getBoundingClientRect (Gate C7).
      </p>
    </div>
  );
}

function AspectRatioDemo() {
  return (
    <div style={{ ...shellStyle, maxWidth: 480 }}>
      <div style={{ ...panelStyle, width: '100%', aspectRatio: '16 / 9' }}>
        <ResponsiveChartContainer
          minHeight={120}
          aspectRatio={16 / 9}
          style={{ flex: 1, minHeight: 0, width: '100%', height: '100%' }}
        >
          {(size) =>
            size.ready ? (
              <ChartRoot width={size.width} height={size.height} options={options}>
                <CartesianChart>
                  <CartesianPlot>
                    <ChartGrid />
                    <ChartYAxis />
                    <ChartXAxis />
                    <LineSeries seriesId="primary" />
                  </CartesianPlot>
                </CartesianChart>
              </ChartRoot>
            ) : null
          }
        </ResponsiveChartContainer>
      </div>
    </div>
  );
}

const meta: Meta<typeof ResponsiveWidthDemo> = {
  title: 'GenChart/Responsive',
  component: ResponsiveWidthDemo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Gate C7 — ResponsiveChartContainer measures parent size and passes width/height to ChartRoot.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WidthSlider: Story = {
  name: 'Width slider',
  args: { initialWidth: 560 },
};

export const AspectRatio: Story = {
  name: 'Aspect ratio 16:9',
  render: () => <AspectRatioDemo />,
};

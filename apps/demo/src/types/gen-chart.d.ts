/**
 * @file apps/demo/src/types/gen-chart.d.ts
 * @description Ambient types until @gen-office/gen-chart dist ships .d.ts (Gate D3).
 * @created 2026-06-28
 *
 * @remark
 * - Remove when packages/gen-chart vite-plugin-dts emits dist/index.d.ts
 *
 */

declare module '@gen-office/gen-chart' {
  import type { CSSProperties, ReactNode } from 'react';

  export interface ResponsiveChartSize {
    width: number;
    height: number;
    ready: boolean;
  }

  export interface ResponsiveChartContainerProps {
    minHeight?: number;
    className?: string;
    style?: CSSProperties;
    children: (size: ResponsiveChartSize) => ReactNode;
  }

  export interface ChartRootProps<T = unknown> {
    width: number;
    height: number;
    options: CartesianChartOptions<T> | PolarChartOptions<T>;
    children?: ReactNode;
  }

  export interface CartesianChartProps {
    children?: ReactNode;
  }

  export interface CartesianPlotProps {
    children?: ReactNode;
  }

  export interface PolarChartProps<T = unknown> {
    width: number;
    height: number;
    options: PolarChartOptions<T>;
    children?: ReactNode;
  }

  export interface PolarPlotProps {
    children?: ReactNode;
  }

  export interface SeriesProps {
    seriesId: string;
  }

  export type Accessor<TDatum, TValue> = (datum: TDatum, index: number) => TValue;

  export interface CartesianChartOptions<TDatum = unknown> {
    series: Array<Record<string, unknown>>;
    interactive?: Record<string, unknown>;
    motion?: Record<string, unknown>;
  }

  export interface PolarChartOptions<TDatum = unknown> {
    series: Array<Record<string, unknown>>;
    interactive?: Record<string, unknown>;
  }

  export const ChartRoot: <T>(props: ChartRootProps<T>) => ReactNode;
  export const ResponsiveChartContainer: (props: ResponsiveChartContainerProps) => ReactNode;
  export const CartesianChart: (props: CartesianChartProps) => ReactNode;
  export const CartesianPlot: (props: CartesianPlotProps) => ReactNode;
  export const PolarChart: <T>(props: PolarChartProps<T>) => ReactNode;
  export const PolarPlot: (props: PolarPlotProps) => ReactNode;
  export const ChartGrid: () => ReactNode;
  export const ChartXAxis: () => ReactNode;
  export const ChartYAxis: () => ReactNode;
  export const ChartTooltip: () => ReactNode;
  export const ChartLegend: () => ReactNode;
  export const LineSeries: (props: SeriesProps) => ReactNode;
  export const BarSeries: (props: SeriesProps) => ReactNode;
  export const AreaSeries: (props: SeriesProps) => ReactNode;
  export const PieSeries: (props: SeriesProps) => ReactNode;
  export const DonutSeries: (props: SeriesProps) => ReactNode;
}

declare module '@gen-office/gen-chart/index.css';

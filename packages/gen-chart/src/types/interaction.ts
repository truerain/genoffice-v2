/**
 * @file packages/gen-chart/src/types/interaction.ts
 * @description Tooltip, legend, and motion option types.
 * @created 2026-06-27
 *
 * @remark
 */

import type { CartesianSeriesType } from './series';

export interface ChartLegendOptions {
  enabled?: boolean;
  position?: 'top' | 'bottom';
  align?: 'start' | 'center' | 'end';
  reserveSpace?: boolean;
}

export interface ChartTooltipFormatterContext<TDatum = unknown> {
  seriesId: string;
  seriesLabel?: string;
  seriesType: CartesianSeriesType;
  datum: TDatum;
  x?: string | number | Date;
  value: number | null;
}

export interface ChartTooltipOptions<TDatum = unknown> {
  enabled?: boolean;
  titleFormatter?: (ctx: ChartTooltipFormatterContext<TDatum>) => string;
  valueFormatter?: (ctx: ChartTooltipFormatterContext<TDatum>) => string;
}

export interface ChartInteractiveOptions<TDatum = unknown> {
  tooltip?: boolean | ChartTooltipOptions<TDatum>;
  legend?: boolean | ChartLegendOptions;
  crosshair?: boolean;
}

export interface ChartMotionOptions {
  enabled?: boolean;
  mode?: 'enter' | 'reset-on-change' | 'none';
  durationMs?: number;
  easing?: 'linear' | 'easeOut' | 'easeInOut';
  changeKey?: string | number;
}

export interface ChartAxisOptions {
  show?: boolean;
  showTicks?: boolean;
  tickCount?: number;
  tickFormat?: (value: unknown) => string;
  /** @default 'nice' — d3 tick-aligned domain; `'auto'` is an alias */
  min?: number | 'auto' | 'nice' | 'dataMin';
  /** @default 'nice' — d3 tick-aligned domain; `'auto'` is an alias */
  max?: number | 'auto' | 'nice' | 'dataMax';
}

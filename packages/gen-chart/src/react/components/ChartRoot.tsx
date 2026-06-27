/**
 * @file packages/gen-chart/src/react/components/ChartRoot.tsx
 * @description Root layout wrapper and options context entry (Gate C2 expands context).
 * @created 2026-06-27
 *
 * @remark
 */

import type { CSSProperties, ReactNode } from 'react';
import type { CartesianChartOptions } from '../../types/options';
import { resolveChartTokens } from '../../themes/resolveChartTokens';
import {
  warnEmptySeries,
  warnInvalidHeight,
  warnInvalidWidth,
} from '../../core/warnings';

export interface ChartRootProps<TDatum> {
  width: number;
  height: number;
  options: CartesianChartOptions<TDatum>;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function ChartRoot<TDatum>({
  width,
  height,
  options,
  children,
  className,
  style,
}: ChartRootProps<TDatum>) {
  if (options.series.length === 0) warnEmptySeries();
  if (width <= 0) warnInvalidWidth();
  if (height <= 0) warnInvalidHeight();

  resolveChartTokens(options.theme, options.tokens);

  return (
    <div
      className={['gen-chart-root', className].filter(Boolean).join(' ')}
      data-gen-chart-root=""
      data-gen-chart-stub="ChartRoot"
      style={{
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

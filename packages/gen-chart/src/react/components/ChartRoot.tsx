/**
 * @file packages/gen-chart/src/react/components/ChartRoot.tsx
 * @description Root layout wrapper and chart context provider (Gate C2).
 * @created 2026-06-27
 *
 * @remark
 */

import { useMemo, type CSSProperties, type ReactNode } from 'react';
import type { CartesianChartOptions } from '../../types/options';
import { resolveChartTokens } from '../../themes/resolveChartTokens';
import { ChartContextProvider } from '../context/ChartContext';
import { useGenChart } from '../hooks/useGenChart';
import { useChartMotion } from '../motion/useChartMotion';

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
  const hookOptions = useMemo(
    () => ({ ...options, width, height }),
    [options, width, height],
  );
  const chart = useGenChart(hookOptions);
  const tokens = useMemo(
    () => resolveChartTokens(options.theme, options.tokens),
    [options.theme, options.tokens],
  );
  const motion = useChartMotion(options.motion, options.series, tokens.motion);

  const contextValue = useMemo(
    () => ({
      chart,
      tokens,
      motion,
    }),
    [chart, tokens, motion],
  );

  return (
    <ChartContextProvider value={contextValue}>
      <div
        className={['gen-chart-root', className].filter(Boolean).join(' ')}
        data-gen-chart-root=""
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
    </ChartContextProvider>
  );
}

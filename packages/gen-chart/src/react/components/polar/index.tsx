/**
 * @file packages/gen-chart/src/react/components/polar/index.tsx
 * @description Polar chart shell and series components (Gate C5).
 * @created 2026-06-27
 *
 * @remark
 * - Exports: PolarChart, PolarPlot, PieSeries, DonutSeries
 */

import { useMemo, type CSSProperties, type ReactNode } from 'react';
import type { PolarChartOptions } from '../../../types/options';
import { resolveChartTokens } from '../../../themes/resolveChartTokens';
import { PolarChartContextProvider } from '../../context/PolarChartContext';
import { usePolarChart } from '../../hooks/usePolarChart';
import { useChartMotion } from '../../motion/useChartMotion';
import { DonutSeries } from './DonutSeries';
import { PieSeries } from './PieSeries';
import { PolarPlot } from './PolarPlot';

export { PolarPlot } from './PolarPlot';
export type { PolarPlotProps } from './PolarPlot';
export { PieSeries } from './PieSeries';
export { DonutSeries } from './DonutSeries';
export type { PolarSeriesProps } from './seriesProps';

export interface PolarChartProps<TDatum> {
  width: number;
  height: number;
  options: PolarChartOptions<TDatum>;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function PolarChart<TDatum>({
  width,
  height,
  options,
  children,
  className,
  style,
}: PolarChartProps<TDatum>) {
  const hookOptions = useMemo(
    () => ({ ...options, width, height }),
    [options, width, height],
  );
  const chart = usePolarChart(hookOptions);
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
    <PolarChartContextProvider value={contextValue}>
      <div
        className={['gen-chart-root', 'gen-chart-polar', className].filter(Boolean).join(' ')}
        data-gen-chart-root=""
        data-gen-chart-polar=""
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
    </PolarChartContextProvider>
  );
}

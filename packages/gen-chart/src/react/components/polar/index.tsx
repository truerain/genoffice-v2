/**
 * @file packages/gen-chart/src/react/components/polar/index.tsx
 * @description Polar plot and series stub components (Gate C5).
 * @created 2026-06-27
 *
 * @remark
 */

import type { ReactNode } from 'react';
import type { PolarChartOptions } from '../../../types/options';

export interface PolarChartProps<TDatum> {
  options?: PolarChartOptions<TDatum>;
  children?: ReactNode;
}

export function PolarChart<TDatum>({ children }: PolarChartProps<TDatum>) {
  return (
    <div className="gen-chart-polar" data-gen-chart-stub="PolarChart">
      {children}
    </div>
  );
}

export interface PolarSeriesProps {
  seriesId: string;
}

export function PieSeries(_props: PolarSeriesProps) {
  return null;
}
PieSeries.displayName = 'PieSeries';

export function DonutSeries(_props: PolarSeriesProps) {
  return null;
}
DonutSeries.displayName = 'DonutSeries';

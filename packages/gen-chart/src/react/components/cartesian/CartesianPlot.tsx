/**
 * @file packages/gen-chart/src/react/components/cartesian/CartesianPlot.tsx
 * @description SVG plot surface for cartesian charts (Gate C3).
 * @created 2026-06-27
 *
 * @remark
 */

import type { ReactNode } from 'react';
import { useChartContext } from '../../context/ChartContext';
import { ChartEmptyState } from './ChartEmptyState';

export interface CartesianPlotProps {
  children?: ReactNode;
}

export function CartesianPlot({ children }: CartesianPlotProps) {
  const { chart, tokens } = useChartContext();
  const hasData = chart.visibleSeries.length > 0;

  return (
    <svg
      className="gen-chart-cartesian-plot"
      data-gen-chart-cartesian-plot=""
      width={chart.width}
      height={chart.height}
      role="img"
      aria-label="Chart plot"
      style={{ display: 'block', background: tokens.color.background }}
    >
      {hasData ? children : <ChartEmptyState />}
    </svg>
  );
}

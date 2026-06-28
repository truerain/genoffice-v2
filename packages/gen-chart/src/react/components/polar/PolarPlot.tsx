/**
 * @file packages/gen-chart/src/react/components/polar/PolarPlot.tsx
 * @description SVG plot surface for polar charts (Gate C5).
 * @created 2026-06-27
 *
 * @remark
 */

import type { ReactNode } from 'react';
import { usePolarChartContext } from '../../context/PolarChartContext';
import { PolarEmptyState } from './PolarEmptyState';

export interface PolarPlotProps {
  children?: ReactNode;
}

export function PolarPlot({ children }: PolarPlotProps) {
  const { chart, tokens } = usePolarChartContext();
  const hasData = chart.visibleSeries.length > 0;

  return (
    <svg
      className="gen-chart-polar-plot"
      data-gen-chart-polar-plot=""
      width={chart.width}
      height={chart.height}
      role="img"
      aria-label="Polar chart plot"
      style={{ display: 'block', background: tokens.color.background }}
    >
      {hasData ? children : <PolarEmptyState />}
    </svg>
  );
}

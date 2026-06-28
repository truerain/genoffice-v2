/**
 * @file packages/gen-chart/src/react/components/cartesian/index.tsx
 * @description Cartesian plot shell and series components (Gate C3~C4).
 * @created 2026-06-27
 *
 * @remark
 */

import { useMemo, type ReactNode } from 'react';
import { useChartContext } from '../../context/ChartContext';
import { PlotContextProvider } from '../../context/PlotContext';

export { CartesianPlot } from './CartesianPlot';
export type { CartesianPlotProps } from './CartesianPlot';
export { ChartGrid } from './ChartGrid';
export { ChartXAxis } from './ChartXAxis';
export { ChartYAxis } from './ChartYAxis';
export { ChartEmptyState } from './ChartEmptyState';
export { LineSeries } from './LineSeries';
export { BarSeries } from './BarSeries';
export { AreaSeries } from './AreaSeries';
export type { SeriesProps } from './seriesProps';

export interface CartesianChartProps {
  children?: ReactNode;
}

export function CartesianChart({ children }: CartesianChartProps) {
  const { chart } = useChartContext();

  const plotContextValue = useMemo(() => {
    const plotArea = chart.plotArea;
    return {
      plotArea,
      width: plotArea.width,
      height: plotArea.height,
    };
  }, [chart]);

  return (
    <PlotContextProvider value={plotContextValue}>
      <div
        className="gen-chart-cartesian"
        data-gen-chart-cartesian=""
        style={{ flex: 1, minHeight: 0, position: 'relative', width: '100%', height: '100%' }}
      >
        {children}
      </div>
    </PlotContextProvider>
  );
}

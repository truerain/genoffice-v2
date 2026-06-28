/**
 * @file packages/gen-chart/src/react/components/cartesian/index.tsx
 * @description Cartesian plot shell and series stub components (Gate C3~C4).
 * @created 2026-06-27
 *
 * @remark
 */

import { useMemo, type ReactNode } from 'react';
import { useChartContext } from '../../context/ChartContext';
import { PlotContextProvider } from '../../context/PlotContext';
import { createStubComponent } from '../../createStubComponent';

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
        style={{ flex: 1, minHeight: 0 }}
      >
        {children}
      </div>
    </PlotContextProvider>
  );
}

export const ChartGrid = createStubComponent('ChartGrid');
export const ChartXAxis = createStubComponent('ChartXAxis');
export const ChartYAxis = createStubComponent('ChartYAxis');

export interface SeriesProps {
  seriesId: string;
}

export function LineSeries(_props: SeriesProps) {
  return null;
}
LineSeries.displayName = 'LineSeries';

export function BarSeries(_props: SeriesProps) {
  return null;
}
BarSeries.displayName = 'BarSeries';

export function AreaSeries(_props: SeriesProps) {
  return null;
}
AreaSeries.displayName = 'AreaSeries';

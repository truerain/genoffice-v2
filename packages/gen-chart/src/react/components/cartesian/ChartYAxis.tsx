/**
 * @file packages/gen-chart/src/react/components/cartesian/ChartYAxis.tsx
 * @description Cartesian Y axis (Gate C3).
 * @created 2026-06-27
 *
 * @remark
 */

import { useChartContext } from '../../context/ChartContext';
import { createDefaultYTickFormat } from '../../utils/formatAxisTick';
import { resolveAxisOptions } from '../../utils/resolveAxisOptions';
import { CartesianAxisLayers } from '../../../internal/visx/CartesianAxisLayers';

export function ChartYAxis() {
  const { chart, tokens } = useChartContext();

  if (chart.visibleSeries.length === 0) return null;

  const yAxis = resolveAxisOptions(chart.options.yAxis);
  if (!yAxis.show) return null;

  const tickFormat = yAxis.tickFormat ?? createDefaultYTickFormat();

  return (
    <CartesianAxisLayers
      scales={chart.scales}
      plotArea={chart.plotArea}
      xAxis={{ show: false, showTicks: false }}
      yAxis={yAxis}
      tickColor={tokens.color.axis}
      tickFontSize={tokens.typography.axisTickFontSize}
      tickFontFamily={tokens.typography.fontFamily}
      xTickFormat={() => ''}
      yTickFormat={tickFormat}
    />
  );
}

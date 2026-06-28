/**
 * @file packages/gen-chart/src/react/components/cartesian/ChartXAxis.tsx
 * @description Cartesian X axis (Gate C3).
 * @created 2026-06-27
 *
 * @remark
 */

import { useChartContext } from '../../context/ChartContext';
import { createDefaultXTickFormat } from '../../utils/formatAxisTick';
import { resolveAxisOptions } from '../../utils/resolveAxisOptions';
import { CartesianAxisLayers } from '../../../internal/visx/CartesianAxisLayers';

export function ChartXAxis() {
  const { chart, tokens } = useChartContext();

  if (chart.visibleSeries.length === 0) return null;

  const xAxis = resolveAxisOptions(chart.options.xAxis);
  if (!xAxis.show) return null;

  const tickFormat =
    xAxis.tickFormat ?? createDefaultXTickFormat(chart.scales.xKind);

  return (
    <CartesianAxisLayers
      scales={chart.scales}
      plotArea={chart.plotArea}
      xAxis={xAxis}
      yAxis={{ show: false, showTicks: false }}
      tickColor={tokens.color.axis}
      tickFontSize={tokens.typography.axisTickFontSize}
      tickFontFamily={tokens.typography.fontFamily}
      xTickFormat={tickFormat}
      yTickFormat={() => ''}
    />
  );
}

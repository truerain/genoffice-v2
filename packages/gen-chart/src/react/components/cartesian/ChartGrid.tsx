/**
 * @file packages/gen-chart/src/react/components/cartesian/ChartGrid.tsx
 * @description Cartesian grid lines (Gate C3).
 * @created 2026-06-27
 *
 * @remark
 */

import { useChartContext } from '../../context/ChartContext';
import { CartesianGridLayers } from '../../../internal/visx/CartesianGridLayers';

export function ChartGrid() {
  const { chart, tokens } = useChartContext();

  if (chart.visibleSeries.length === 0) return null;

  return (
    <CartesianGridLayers
      scales={chart.scales}
      plotArea={chart.plotArea}
      stroke={tokens.color.grid}
      strokeWidth={tokens.border.gridWidth}
    />
  );
}

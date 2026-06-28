/**
 * @file packages/gen-chart/src/react/components/cartesian/ChartEmptyState.tsx
 * @description Empty-state message when no visible series remain.
 * @created 2026-06-27
 *
 * @remark
 */

import { useChartContext } from '../../context/ChartContext';

export function ChartEmptyState() {
  const { chart, tokens } = useChartContext();

  return (
    <text
      data-gen-chart-empty=""
      x={chart.width / 2}
      y={chart.height / 2}
      textAnchor="middle"
      dominantBaseline="middle"
      fill={tokens.color.textMuted}
      fontFamily={tokens.typography.fontFamily}
      fontSize={tokens.typography.legendFontSize}
    >
      No data to display
    </text>
  );
}

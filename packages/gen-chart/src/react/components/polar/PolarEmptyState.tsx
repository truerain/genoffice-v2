/**
 * @file packages/gen-chart/src/react/components/polar/PolarEmptyState.tsx
 * @description Empty-state message when no visible polar series remain.
 * @created 2026-06-27
 *
 * @remark
 */

import { usePolarChartContext } from '../../context/PolarChartContext';

export function PolarEmptyState() {
  const { chart, tokens } = usePolarChartContext();

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

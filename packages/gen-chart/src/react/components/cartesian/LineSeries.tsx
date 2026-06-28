/**
 * @file packages/gen-chart/src/react/components/cartesian/LineSeries.tsx
 * @description Line series SVG renderer (Gate C4).
 * @created 2026-06-27
 *
 * @remark
 */

import { useChartContext } from '../../context/ChartContext';
import { resolveSeriesColor } from '../../utils/resolveSeriesColor';
import type { SeriesProps } from './seriesProps';

export function LineSeries({ seriesId }: SeriesProps) {
  const { chart, tokens } = useChartContext();

  const line = chart.geometries.lines.find((item) => item.seriesId === seriesId);
  if (!line || line.points.length === 0) return null;

  const color = resolveSeriesColor(chart.visibleSeries, seriesId, tokens);
  const strokeWidth = tokens.border.seriesStrokeWidth;

  if (line.points.length === 1) {
    const point = line.points[0]!;
    return (
      <circle
        data-gen-chart-line=""
        data-series-id={seriesId}
        cx={point.x}
        cy={point.y}
        r={strokeWidth * 1.5}
        fill={color}
      />
    );
  }

  const points = line.points.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <polyline
      data-gen-chart-line=""
      data-series-id={seriesId}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      points={points}
    />
  );
}
LineSeries.displayName = 'LineSeries';

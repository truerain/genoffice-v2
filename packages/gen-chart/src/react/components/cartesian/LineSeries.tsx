/**
 * @file packages/gen-chart/src/react/components/cartesian/LineSeries.tsx
 * @description Line series SVG renderer (Gate C4).
 * @created 2026-06-27
 *
 * @remark
 */

import { useChartContext } from '../../context/ChartContext';
import { buildSeriesMotionProps, polylineLength } from '../../motion/seriesMotion';
import { resolveSeriesColor } from '../../utils/resolveSeriesColor';
import type { SeriesProps } from './seriesProps';

export function LineSeries({ seriesId }: SeriesProps) {
  const { chart, tokens, motion } = useChartContext();

  const line = chart.geometries.lines.find((item) => item.seriesId === seriesId);
  if (!line || line.points.length === 0) return null;

  const color = resolveSeriesColor(chart.visibleSeries, seriesId, tokens);
  const strokeWidth = tokens.border.seriesStrokeWidth;
  const motionProps =
    line.points.length > 1
      ? buildSeriesMotionProps(motion, 'line', seriesId, {
          '--gen-chart-line-length': polylineLength(line.points),
        })
      : buildSeriesMotionProps(motion, 'line', seriesId);

  if (line.points.length === 1) {
    const point = line.points[0]!;
    return (
      <circle
        key={motionProps.key}
        data-gen-chart-line=""
        data-series-id={seriesId}
        className={motionProps.className}
        style={motionProps.style}
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
      key={motionProps.key}
      data-gen-chart-line=""
      data-series-id={seriesId}
      className={motionProps.className}
      style={motionProps.style}
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

/**
 * @file packages/gen-chart/src/react/components/cartesian/BarSeries.tsx
 * @description Bar series SVG renderer (Gate C4).
 * @created 2026-06-27
 *
 * @remark
 */

import { useChartContext } from '../../context/ChartContext';
import { buildSeriesMotionProps } from '../../motion/seriesMotion';
import { resolveSeriesColor } from '../../utils/resolveSeriesColor';
import type { SeriesProps } from './seriesProps';

export function BarSeries({ seriesId }: SeriesProps) {
  const { chart, tokens, motion } = useChartContext();

  const bars = chart.geometries.bars.filter((item) => item.seriesId === seriesId);
  if (bars.length === 0) return null;

  const seriesDef = chart.visibleSeries.find((s) => s.id === seriesId);
  const opacity = seriesDef?.type === 'bar' ? (seriesDef.opacity ?? 1) : 1;
  const color = resolveSeriesColor(chart.visibleSeries, seriesId, tokens);
  const motionProps = buildSeriesMotionProps(motion, 'bar', seriesId);

  return (
    <g
      key={motionProps.key}
      data-gen-chart-bar=""
      data-series-id={seriesId}
      className={motionProps.className}
      style={motionProps.style}
    >
      {bars.map((bar) => (
        <rect
          key={bar.datumIndex}
          x={bar.x}
          y={bar.y}
          width={bar.width}
          height={bar.height}
          fill={color}
          fillOpacity={opacity}
        />
      ))}
    </g>
  );
}
BarSeries.displayName = 'BarSeries';

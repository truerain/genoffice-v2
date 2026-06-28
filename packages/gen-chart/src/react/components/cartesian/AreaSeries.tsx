/**
 * @file packages/gen-chart/src/react/components/cartesian/AreaSeries.tsx
 * @description Area series SVG renderer (Gate C4).
 * @created 2026-06-27
 *
 * @remark
 */

import { useChartContext } from '../../context/ChartContext';
import { buildSeriesMotionProps } from '../../motion/seriesMotion';
import { resolveSeriesColor } from '../../utils/resolveSeriesColor';
import type { SeriesProps } from './seriesProps';

export function AreaSeries({ seriesId }: SeriesProps) {
  const { chart, tokens, motion } = useChartContext();

  const area = chart.geometries.areas.find((item) => item.seriesId === seriesId);
  if (!area || area.path.length === 0) return null;

  const color = resolveSeriesColor(chart.visibleSeries, seriesId, tokens);
  const motionProps = buildSeriesMotionProps(motion, 'area', seriesId);

  return (
    <path
      key={motionProps.key}
      data-gen-chart-area=""
      data-series-id={seriesId}
      className={motionProps.className}
      style={motionProps.style}
      d={area.path}
      fill={color}
      fillOpacity={0.25}
      stroke={color}
      strokeWidth={tokens.border.seriesStrokeWidth}
    />
  );
}
AreaSeries.displayName = 'AreaSeries';

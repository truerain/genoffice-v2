/**
 * @file packages/gen-chart/src/react/components/polar/PolarSliceSeries.tsx
 * @description Shared pie/donut slice SVG renderer (Gate C5).
 * @created 2026-06-27
 *
 * @remark
 * - Internal; use PieSeries or DonutSeries
 * - Arc paths are at origin; group translates by cx/cy from core geometry
 */

import { isDonutSeries } from '../../../core/normalizePolarSeries';
import { usePolarChartContext } from '../../context/PolarChartContext';
import { resolveSliceColor } from '../../utils/resolveSliceColor';

export interface PolarSliceSeriesProps {
  seriesId: string;
  donut: boolean;
}

export function PolarSliceSeries({ seriesId, donut }: PolarSliceSeriesProps) {
  const { chart, tokens } = usePolarChartContext();

  const series = chart.visibleSeries.find((item) => item.id === seriesId);
  if (!series) return null;

  const isDonut = isDonutSeries(series);
  if (donut !== isDonut) return null;

  const arcs = chart.geometries.arcs.filter((arc) => arc.seriesId === seriesId);
  if (arcs.length === 0) return null;

  const { cx, cy } = arcs[0]!;

  return (
    <g
      data-gen-chart-polar-series=""
      data-series-id={seriesId}
      transform={`translate(${cx}, ${cy})`}
    >
      {arcs.map((arc) => (
        <path
          key={arc.index}
          data-gen-chart-polar-slice=""
          data-series-id={seriesId}
          data-slice-index={arc.index}
          d={arc.path}
          fill={resolveSliceColor(series.color, arc.index, tokens)}
          stroke={tokens.color.background}
          strokeWidth={1}
        />
      ))}
    </g>
  );
}

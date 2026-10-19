/**
 * @file packages/gen-chart/src/core/geometry/polar/pieArcs.ts
 * @description Pie and donut slice arc geometry.
 * @created 2026-06-27
 *
 * @remark
 */

import { arc, pie } from 'd3-shape';
import type { PieArcDatum } from 'd3-shape';
import type { PolarLayout } from '../../layout/computePolarLayout';
import type { NormalizedPolarSeries } from '../../normalizePolarSeries';
import { isFiniteNumber } from '../../utils/isFiniteNumber';
import type { PolarArc, PolarGeometries } from './types';

interface SliceDatum<TDatum> {
  datum: TDatum;
  index: number;
  value: number;
}

export function buildPieArcs<TDatum>(
  series: NormalizedPolarSeries<TDatum>,
  layout: PolarLayout,
): PolarArc<TDatum>[] {
  const slices: SliceDatum<TDatum>[] = [];

  series.data.forEach((datum, index) => {
    const value = series.value(datum, index);
    if (!isFiniteNumber(value) || value <= 0) return;
    slices.push({ datum, index, value });
  });

  if (slices.length === 0 || layout.outerRadius <= 0) {
    return [];
  }

  const innerRadius =
    series.isDonut && 'innerRadiusRatio' in series
      ? layout.outerRadius * (series.innerRadiusRatio ?? 0.5)
      : 0;

  const pieGen = pie<SliceDatum<TDatum>>()
    .value((d) => d.value)
    .sort(null);

  const arcGen = arc<PieArcDatum<SliceDatum<TDatum>>>()
    .innerRadius(innerRadius)
    .outerRadius(layout.outerRadius);

  const pieData = pieGen(slices);

  return pieData.flatMap((slice) => {
    const path = arcGen(slice);
    if (!path) return [];

    const midAngle = (slice.startAngle + slice.endAngle) / 2;
    const label = series.labelKey?.(slice.data.datum, slice.data.index);

    return [
      {
        seriesId: series.id,
        datum: slice.data.datum,
        index: slice.data.index,
        value: slice.data.value,
        label,
        startAngle: slice.startAngle,
        endAngle: slice.endAngle,
        innerRadius,
        outerRadius: layout.outerRadius,
        cx: layout.cx,
        cy: layout.cy,
        path,
        midAngle,
      },
    ];
  });
}

export function buildPolarGeometries<TDatum>(
  seriesList: NormalizedPolarSeries<TDatum>[],
  layout: PolarLayout,
): PolarGeometries<TDatum> {
  const arcs: PolarArc<TDatum>[] = [];

  for (const series of seriesList) {
    arcs.push(...buildPieArcs(series, layout));
  }

  return { arcs };
}

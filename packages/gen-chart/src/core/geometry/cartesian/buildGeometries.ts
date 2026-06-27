/**
 * @file packages/gen-chart/src/core/geometry/cartesian/buildGeometries.ts
 * @description Build all cartesian geometries for visible series.
 * @created 2026-06-27
 *
 * @remark
 */

import type { NormalizedCartesianSeries } from '../../normalizeSeries';
import type { CartesianScales } from '../../scale/createCartesianScales';
import { buildAreaGeometry } from './areaPath';
import { buildBarGeometries } from './barRects';
import { buildLineGeometry } from './linePoints';
import type { CartesianGeometries } from './types';

export function buildCartesianGeometries<TDatum>(
  series: NormalizedCartesianSeries<TDatum>[],
  scales: CartesianScales,
): CartesianGeometries<TDatum> {
  const lines = [];
  const areas = [];
  const hitPoints = [];

  for (const item of series) {
    if (item.type === 'line') {
      const result = buildLineGeometry(item, scales);
      lines.push(result.geometry);
      hitPoints.push(...result.hitPoints);
    } else if (item.type === 'area') {
      const result = buildAreaGeometry(item, scales);
      areas.push(result.geometry);
      hitPoints.push(...result.hitPoints);
    }
  }

  const barResult = buildBarGeometries(series, scales);

  return {
    lines,
    bars: barResult.bars,
    areas,
    hitPoints: [...hitPoints, ...barResult.hitPoints],
  };
}

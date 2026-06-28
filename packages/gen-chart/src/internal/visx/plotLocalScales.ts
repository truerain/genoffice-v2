/**
 * @file packages/gen-chart/src/internal/visx/plotLocalScales.ts
 * @description Plot-local d3 scales for visx axis/grid rendering.
 * @created 2026-06-27
 *
 * @remark
 * - Core geometry uses absolute SVG coordinates; visx layers use local plot coords
 * - Exports: createPlotLocalScales
 */

import { scaleBand, scaleLinear, scaleTime } from 'd3-scale';
import type { ScaleBand, ScaleLinear, ScaleTime } from 'd3-scale';
import type { CartesianScales } from '../../core/scale/createCartesianScales';
import type { PlotArea } from '../../types/model';

export function createPlotLocalScales(
  scales: CartesianScales,
  plotArea: PlotArea,
): CartesianScales {
  const yScale = scaleLinear<number, number>()
    .domain(scales.yScale.domain())
    .range([plotArea.height, 0]);

  if (scales.xKind === 'band') {
    const band = scales.xScale as ScaleBand<string>;
    const xScale = scaleBand<string>()
      .domain(band.domain())
      .range([0, plotArea.width])
      .paddingInner(band.paddingInner())
      .paddingOuter(band.paddingOuter());

    return {
      xKind: 'band',
      xScale,
      yScale,
      bandKeys: scales.bandKeys,
    };
  }

  if (scales.xKind === 'time') {
    const time = scales.xScale as ScaleTime<number, number>;
    const xScale = scaleTime<number, number>()
      .domain(time.domain())
      .range([0, plotArea.width]);

    return {
      xKind: 'time',
      xScale,
      yScale,
      bandKeys: [],
    };
  }

  const linear = scales.xScale as ScaleLinear<number, number>;
  const xScale = scaleLinear<number, number>()
    .domain(linear.domain())
    .range([0, plotArea.width]);

  return {
    xKind: 'linear',
    xScale,
    yScale,
    bandKeys: [],
  };
}

/**
 * visx AxisLeft/AxisBottom origin in plot-local coordinates where axes meet.
 */
export function plotAxisOrigin(plotArea: PlotArea) {
  return { x: 0, y: plotArea.height };
}

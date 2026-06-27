/**
 * @file packages/gen-chart/src/core/scale/createCartesianScales.ts
 * @description Build d3 scales for cartesian charts.
 * @created 2026-06-27
 *
 * @remark
 */

import { scaleBand, scaleLinear, scaleTime } from 'd3-scale';
import type { ScaleBand, ScaleLinear, ScaleTime } from 'd3-scale';
import type { PlotArea } from '../../types/model';
import type { XDomainResult } from '../domain/computeXDomain';
import { xToKey } from '../utils/xValue';

export type CartesianXScale =
  | ScaleBand<string>
  | ScaleLinear<number, number>
  | ScaleTime<number, number>;

export interface CartesianScales {
  xKind: XDomainResult['kind'];
  xScale: CartesianXScale;
  yScale: ScaleLinear<number, number>;
  bandKeys: string[];
}

export function createCartesianScales(
  xDomain: XDomainResult,
  yDomain: [number, number],
  plotArea: PlotArea,
): CartesianScales {
  const yScale = scaleLinear<number, number>()
    .domain(yDomain)
    .range([plotArea.y + plotArea.height, plotArea.y]);

  if (xDomain.kind === 'band') {
    const keys = xDomain.domain as string[];
    const xScale = scaleBand<string>()
      .domain(keys)
      .range([plotArea.x, plotArea.x + plotArea.width])
      .paddingInner(0.2)
      .paddingOuter(0.1);
    return { xKind: 'band', xScale, yScale, bandKeys: keys };
  }

  if (xDomain.kind === 'time') {
    const [min, max] = xDomain.domain as [Date, Date];
    const xScale = scaleTime<number, number>()
      .domain([min, max])
      .range([plotArea.x, plotArea.x + plotArea.width]);
    return { xKind: 'time', xScale, yScale, bandKeys: [] };
  }

  const [min, max] = xDomain.domain as [number, number];
  const xScale = scaleLinear<number, number>()
    .domain([min, max])
    .range([plotArea.x, plotArea.x + plotArea.width]);
  return { xKind: 'linear', xScale, yScale, bandKeys: [] };
}

export function scaleXPosition(
  scales: CartesianScales,
  x: string | number | Date,
): number | undefined {
  if (scales.xKind === 'band') {
    const band = scales.xScale as ScaleBand<string>;
    const key = xToKey(x);
    const px = band(key);
    if (px == null) return undefined;
    return px + band.bandwidth() / 2;
  }

  if (scales.xKind === 'time') {
    const time = scales.xScale as ScaleTime<number, number>;
    return time(x instanceof Date ? x : new Date(x));
  }

  const linear = scales.xScale as ScaleLinear<number, number>;
  const numeric = typeof x === 'number' ? x : Number(x);
  if (!Number.isFinite(numeric)) return undefined;
  return linear(numeric);
}

export function invertXPosition(scales: CartesianScales, xPx: number): number {
  if (scales.xKind === 'band') {
    const band = scales.xScale as ScaleBand<string>;
    const step = band.step();
    const start = band.range()[0] ?? 0;
    const index = Math.floor((xPx - start) / step);
    const clamped = Math.max(0, Math.min(scales.bandKeys.length - 1, index));
    return clamped;
  }

  if (scales.xKind === 'time') {
    const time = scales.xScale as ScaleTime<number, number>;
    return time.invert(xPx).getTime();
  }

  const linear = scales.xScale as ScaleLinear<number, number>;
  return linear.invert(xPx);
}

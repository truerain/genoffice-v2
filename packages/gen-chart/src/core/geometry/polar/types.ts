/**
 * @file packages/gen-chart/src/core/geometry/polar/types.ts
 * @description Polar (pie/donut) geometry result types.
 * @created 2026-06-27
 *
 * @remark
 */

export interface PolarArc<TDatum> {
  seriesId: string;
  datum: TDatum;
  index: number;
  value: number;
  label?: string;
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
  cx: number;
  cy: number;
  /** SVG path at chart origin; translate by cx/cy when rendering */
  path: string;
  midAngle: number;
}

export interface PolarGeometries<TDatum> {
  arcs: PolarArc<TDatum>[];
}

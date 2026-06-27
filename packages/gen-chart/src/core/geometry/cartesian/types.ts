/**
 * @file packages/gen-chart/src/core/geometry/cartesian/types.ts
 * @description Cartesian geometry result types.
 * @created 2026-06-27
 *
 * @remark
 */

export interface ChartPoint {
  x: number;
  y: number;
  datumIndex: number;
}

export interface LineGeometry {
  seriesId: string;
  points: ChartPoint[];
}

export interface BarRect {
  seriesId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  datumIndex: number;
}

export interface AreaGeometry {
  seriesId: string;
  path: string;
  points: ChartPoint[];
}

export interface SeriesHitPoint<TDatum> {
  seriesId: string;
  datum: TDatum;
  datumIndex: number;
  x: string | number | Date;
  value: number | null;
  px: number;
  py: number;
}

export interface CartesianGeometries<TDatum> {
  lines: LineGeometry[];
  bars: BarRect[];
  areas: AreaGeometry[];
  hitPoints: SeriesHitPoint<TDatum>[];
}

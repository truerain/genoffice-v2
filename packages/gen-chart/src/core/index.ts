/**
 * @file packages/gen-chart/src/core/index.ts
 * @description Core module exports (headless).
 * @created 2026-06-27
 *
 * @remark
 */

export { createCartesianModel } from './createCartesianModel';
export type { CreateCartesianModelLayout } from './createCartesianModel';
export { createPolarModel } from './createPolarModel';
export type { CreatePolarModelLayout } from './createPolarModel';
export { normalizeSeries, seriesHasFiniteY } from './normalizeSeries';
export type { NormalizedCartesianSeries } from './normalizeSeries';
export { computeXDomain } from './domain/computeXDomain';
export type { XDomainResult } from './domain/computeXDomain';
export { computeYDomain } from './domain/computeYDomain';
export { computePlotArea, resolvePadding } from './layout/computePlotArea';
export { createCartesianScales, scaleXPosition, invertXPosition } from './scale/createCartesianScales';
export type { CartesianScales, CartesianXScale } from './scale/createCartesianScales';
export { buildCartesianGeometries } from './geometry/cartesian/buildGeometries';
export { cartesianNearest } from './hit-test/cartesianNearest';
export {
  warnEmptySeries,
  warnInvalidWidth,
  warnInvalidHeight,
  warnDuplicateSeriesId,
  warnNoFiniteY,
  warnMotionDisabledLargeData,
} from './warnings';

/**
 * @file packages/gen-chart/src/core/createCartesianModel.ts
 * @description Headless cartesian model factory (Gate C1).
 * @created 2026-06-27
 *
 * @remark
 * - visibility toggle recomputes domain, scales, and geometry immediately
 * - getNearestDatum uses target geometry (stable during motion)
 */
import type { CartesianChartOptions } from '../types/options';
import type { CartesianChartModel, NearestDatumResult } from '../types/model';
import { cartesianNearest } from './hit-test/cartesianNearest';
import { computeCartesianState, isSeriesVisible } from './model/computeCartesianState';
import {
  warnEmptySeries,
  warnInvalidHeight,
  warnInvalidWidth,
} from './warnings';

export interface CreateCartesianModelLayout {
  width: number;
  height: number;
}

export function createCartesianModel<TDatum>(
  options: CartesianChartOptions<TDatum>,
  layout: CreateCartesianModelLayout,
): CartesianChartModel<TDatum> {
  if (options.series.length === 0) warnEmptySeries();
  if (layout.width <= 0) warnInvalidWidth();
  if (layout.height <= 0) warnInvalidHeight();

  const visibility = new Map<string, boolean>();
  let state = computeCartesianState(options, layout, visibility);

  const refresh = () => {
    state = computeCartesianState(options, layout, visibility);
  };

  return {
    get options() {
      return options;
    },
    get visibleSeries() {
      return state.visibleSeries;
    },
    get plotArea() {
      return state.plotArea;
    },
    get xDomain() {
      return state.xDomain;
    },
    get yDomain() {
      return state.yDomain;
    },
    get scales() {
      return state.scales;
    },
    get geometries() {
      return state.geometries;
    },
    toggleSeries(seriesId: string) {
      const series = state.normalizedSeries.find((s) => s.id === seriesId);
      if (!series) return;
      visibility.set(seriesId, !isSeriesVisible(series, visibility));
      refresh();
    },
    setSeriesVisibility(seriesId: string, visible: boolean) {
      visibility.set(seriesId, visible);
      refresh();
    },
    getNearestDatum(xPx: number, yPx: number): NearestDatumResult<TDatum> | null {
      return cartesianNearest(state.geometries.hitPoints, xPx, yPx);
    },
  };
}

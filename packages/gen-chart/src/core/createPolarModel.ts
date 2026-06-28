/**
 * @file packages/gen-chart/src/core/createPolarModel.ts
 * @description Headless polar model factory (Gate C1.5).
 * @created 2026-06-27
 *
 * @remark
 */

import type { PolarChartOptions } from '../types/options';
import type { PolarChartModel, NearestDatumResult } from '../types/model';
import { polarNearest } from './hit-test/polarNearest';
import { computePolarState, isPolarSeriesVisible } from './model/computePolarState';
import {
  warnEmptySeries,
  warnInvalidHeight,
  warnInvalidWidth,
} from './warnings';

export interface CreatePolarModelLayout {
  width: number;
  height: number;
}

export function createPolarModel<TDatum>(
  options: PolarChartOptions<TDatum>,
  layout: CreatePolarModelLayout,
): PolarChartModel<TDatum> {
  if (options.series.length === 0) warnEmptySeries();
  if (layout.width <= 0) warnInvalidWidth();
  if (layout.height <= 0) warnInvalidHeight();

  const visibility = new Map<string, boolean>();
  let state = computePolarState(options, layout, visibility);

  const refresh = () => {
    state = computePolarState(options, layout, visibility);
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
    get polarLayout() {
      return state.polarLayout;
    },
    get geometries() {
      return state.geometries;
    },
    toggleSeries(seriesId: string) {
      const series = state.normalizedSeries.find((s) => s.id === seriesId);
      if (!series) return;
      visibility.set(seriesId, !isPolarSeriesVisible(series, visibility));
      refresh();
    },
    setSeriesVisibility(seriesId: string, visible: boolean) {
      visibility.set(seriesId, visible);
      refresh();
    },
    getNearestDatum(xPx: number, yPx: number): NearestDatumResult<TDatum> | null {
      return polarNearest(state.geometries.arcs, xPx, yPx);
    },
  };
}

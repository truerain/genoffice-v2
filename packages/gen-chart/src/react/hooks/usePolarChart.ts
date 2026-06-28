/**
 * @file packages/gen-chart/src/react/hooks/usePolarChart.ts
 * @description Polar chart model + layout hook (Gate C5).
 * @created 2026-06-27
 *
 * @remark
 */

import { useMemo, useReducer } from 'react';
import type { PolarChartOptions } from '../../types/options';
import type { UsePolarChartResult } from '../../types/model';
import { createPolarModel } from '../../core/createPolarModel';

export interface UsePolarChartOptions<TDatum> extends PolarChartOptions<TDatum> {
  width: number;
  height: number;
}

export function usePolarChart<TDatum>(
  options: UsePolarChartOptions<TDatum>,
): UsePolarChartResult<TDatum> {
  const [revision, bumpRevision] = useReducer((count) => count + 1, 0);

  const model = useMemo(() => {
    const { width, height, ...chartOptions } = options;
    return createPolarModel(chartOptions, { width, height });
  }, [options]);

  return useMemo((): UsePolarChartResult<TDatum> => {
    void revision;

    return {
      get options() {
        return model.options;
      },
      get visibleSeries() {
        return model.visibleSeries;
      },
      get plotArea() {
        return model.plotArea;
      },
      get polarLayout() {
        return model.polarLayout;
      },
      get geometries() {
        return model.geometries;
      },
      toggleSeries(seriesId: string) {
        model.toggleSeries(seriesId);
        bumpRevision();
      },
      setSeriesVisibility(seriesId: string, visible: boolean) {
        model.setSeriesVisibility(seriesId, visible);
        bumpRevision();
      },
      getNearestDatum(xPx: number, yPx: number) {
        return model.getNearestDatum(xPx, yPx);
      },
      width: options.width,
      height: options.height,
    };
  }, [model, options.width, options.height, revision]);
}

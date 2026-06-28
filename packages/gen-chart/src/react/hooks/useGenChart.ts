/**
 * @file packages/gen-chart/src/react/hooks/useGenChart.ts
 * @description Chart model + layout hook (Gate C2).
 * @created 2026-06-27
 *
 * @remark
 * - Memoize `options` at the call site when series/axis config is stable
 * - toggleSeries / setSeriesVisibility trigger a React re-render
 */

import { useMemo, useReducer } from 'react';
import type { CartesianChartOptions } from '../../types/options';
import type { UseGenChartResult } from '../../types/model';
import { createCartesianModel } from '../../core/createCartesianModel';

export interface UseGenChartOptions<TDatum> extends CartesianChartOptions<TDatum> {
  width: number;
  height: number;
}

export function useGenChart<TDatum>(
  options: UseGenChartOptions<TDatum>,
): UseGenChartResult<TDatum> {
  const [revision, bumpRevision] = useReducer((count) => count + 1, 0);

  const model = useMemo(() => {
    const { width, height, ...chartOptions } = options;
    return createCartesianModel(chartOptions, { width, height });
  }, [options]);

  return useMemo((): UseGenChartResult<TDatum> => {
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
      get xDomain() {
        return model.xDomain;
      },
      get yDomain() {
        return model.yDomain;
      },
      get scales() {
        return model.scales;
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

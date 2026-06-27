/**
 * @file packages/gen-chart/src/core/createPolarModel.ts
 * @description Headless polar model factory (Gate C1.5).
 * @created 2026-06-27
 *
 * @remark
 */

import type { PolarChartOptions } from '../types/options';
import type { PolarChartModel } from '../types/model';
import { notImplemented } from './notImplemented';

export interface CreatePolarModelLayout {
  width: number;
  height: number;
}

export function createPolarModel<TDatum>(
  _options: PolarChartOptions<TDatum>,
  _layout: CreatePolarModelLayout,
): PolarChartModel<TDatum> {
  notImplemented('createPolarModel', 'Gate C1.5');
}

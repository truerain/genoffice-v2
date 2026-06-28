/**
 * @file packages/gen-chart/src/react/components/polar/DonutSeries.tsx
 * @description Donut series SVG renderer (Gate C5).
 * @created 2026-06-27
 *
 * @remark
 */

import { PolarSliceSeries } from './PolarSliceSeries';
import type { PolarSeriesProps } from './seriesProps';

export function DonutSeries({ seriesId }: PolarSeriesProps) {
  return <PolarSliceSeries seriesId={seriesId} donut={true} />;
}
DonutSeries.displayName = 'DonutSeries';

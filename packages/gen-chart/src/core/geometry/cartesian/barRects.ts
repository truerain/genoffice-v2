/**
 * @file packages/gen-chart/src/core/geometry/cartesian/barRects.ts
 * @description Bar series rect geometry (grouped and stacked).
 * @created 2026-06-27
 *
 * @remark
 */

import type { BarSeriesDef } from '../../../types/series';
import type { NormalizedCartesianSeries } from '../../normalizeSeries';
import type { CartesianScales } from '../../scale/createCartesianScales';
import { scaleXPosition as toX } from '../../scale/createCartesianScales';
import { isFiniteNumber } from '../../utils/isFiniteNumber';
import { xToKey } from '../../utils/xValue';
import type { BarRect, SeriesHitPoint } from './types';

function isBarSeries<TDatum>(
  series: NormalizedCartesianSeries<TDatum>,
): series is NormalizedCartesianSeries<TDatum> & BarSeriesDef<TDatum> {
  return series.type === 'bar';
}

export function buildBarGeometries<TDatum>(
  seriesList: NormalizedCartesianSeries<TDatum>[],
  scales: CartesianScales,
): { bars: BarRect[]; hitPoints: SeriesHitPoint<TDatum>[] } {
  const bars: BarRect[] = [];
  const hitPoints: SeriesHitPoint<TDatum>[] = [];
  const barSeries = seriesList.filter(isBarSeries);

  if (barSeries.length === 0) {
    return { bars, hitPoints };
  }

  const stackedGroups = new Map<string, BarSeriesDef<TDatum>[]>();
  const groupedSeries: BarSeriesDef<TDatum>[] = [];

  for (const series of barSeries) {
    if (series.layout === 'stacked' && series.stackId) {
      const group = stackedGroups.get(series.stackId) ?? [];
      group.push(series);
      stackedGroups.set(series.stackId, group);
    } else {
      groupedSeries.push(series);
    }
  }

  buildGroupedBars(groupedSeries, scales, bars, hitPoints);
  stackedGroups.forEach((group) => buildStackedBars(group, scales, bars, hitPoints));

  return { bars, hitPoints };
}

function buildGroupedBars<TDatum>(
  seriesList: BarSeriesDef<TDatum>[],
  scales: CartesianScales,
  bars: BarRect[],
  hitPoints: SeriesHitPoint<TDatum>[],
) {
  if (seriesList.length === 0) return;

  const count = seriesList.length;

  seriesList.forEach((series, seriesIndex) => {
    series.data.forEach((datum, index) => {
      const y = series.y(datum, index);
      if (!isFiniteNumber(y)) return;

      const xRaw = series.x(datum, index);
      const centerX = toX(scales, xRaw);
      if (centerX == null) return;

      const { x, width } = barRectAtCenter(scales, centerX, count, seriesIndex, series.maxBarWidth);
      const y0 = scales.yScale(0);
      const y1 = scales.yScale(y);
      const top = Math.min(y0, y1);
      const height = Math.abs(y1 - y0);

      bars.push({
        seriesId: series.id,
        x,
        y: top,
        width,
        height,
        datumIndex: index,
      });
      hitPoints.push({
        seriesId: series.id,
        datum,
        datumIndex: index,
        x: xRaw,
        value: y,
        px: x + width / 2,
        py: top + height / 2,
      });
    });
  });
}

function buildStackedBars<TDatum>(
  seriesList: BarSeriesDef<TDatum>[],
  scales: CartesianScales,
  bars: BarRect[],
  hitPoints: SeriesHitPoint<TDatum>[],
) {
  if (seriesList.length === 0) return;

  const xKeys = new Map<string, Map<string, { datum: TDatum; index: number; y: number }>>();

  seriesList.forEach((series) => {
    series.data.forEach((datum, index) => {
      const y = series.y(datum, index);
      if (!isFiniteNumber(y)) return;
      const key = xToKey(series.x(datum, index));
      const bucket = xKeys.get(key) ?? new Map();
      bucket.set(series.id, { datum, index, y });
      xKeys.set(key, bucket);
    });
  });

  xKeys.forEach((bucket, key) => {
    const sample = seriesList[0]?.data.find(
      (datum, index) => xToKey(seriesList[0]!.x(datum, index)) === key,
    );
    if (!sample) return;
    const sampleIndex = seriesList[0]!.data.indexOf(sample);
    const xRaw = seriesList[0]!.x(sample, sampleIndex);
    const centerX = toX(scales, xRaw);
    if (centerX == null) return;

    const { x, width } = barRectAtCenter(scales, centerX, 1, 0, seriesList[0]?.maxBarWidth);
    let stackBase = 0;

    seriesList.forEach((series) => {
      const entry = bucket.get(series.id);
      if (!entry) return;

      const y0 = scales.yScale(stackBase);
      stackBase += entry.y;
      const y1 = scales.yScale(stackBase);
      const top = Math.min(y0, y1);
      const height = Math.abs(y1 - y0);

      bars.push({
        seriesId: series.id,
        x,
        y: top,
        width,
        height,
        datumIndex: entry.index,
      });
      hitPoints.push({
        seriesId: series.id,
        datum: entry.datum,
        datumIndex: entry.index,
        x: series.x(entry.datum, entry.index),
        value: entry.y,
        px: x + width / 2,
        py: top + height / 2,
      });
    });
  });
}

function barRectAtCenter(
  scales: CartesianScales,
  centerX: number,
  groupCount: number,
  groupIndex: number,
  maxBarWidth?: number,
): { x: number; width: number } {
  let slotWidth = 24;
  if (scales.xKind === 'band') {
    const band = scales.xScale as import('d3-scale').ScaleBand<string>;
    slotWidth = band.bandwidth() / groupCount;
  }

  const width = maxBarWidth != null ? Math.min(slotWidth * 0.9, maxBarWidth) : slotWidth * 0.9;
  const groupOffset = (groupIndex - (groupCount - 1) / 2) * slotWidth;
  return { x: centerX + groupOffset - width / 2, width };
}

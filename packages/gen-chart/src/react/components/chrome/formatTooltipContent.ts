/**
 * @file packages/gen-chart/src/react/components/chrome/formatTooltipContent.ts
 * @description Default tooltip title/value formatting (Gate C6).
 * @created 2026-06-27
 *
 * @remark
 */

import type { NearestDatumResult } from '../../../types/model';
import type {
  ChartTooltipFormatterContext,
  ChartTooltipOptions,
} from '../../../types/interaction';
import type { CartesianChartSeries } from '../../../types/series';
import type { InteractiveChartContext } from '../../hooks/useInteractiveChart';

function resolveSeriesLabel(
  seriesList: Array<{ id: string; label?: string }>,
  seriesId: string,
): string | undefined {
  return seriesList.find((series) => series.id === seriesId)?.label;
}

function resolveCartesianSeriesType(
  seriesList: CartesianChartSeries<unknown>[],
  seriesId: string,
): ChartTooltipFormatterContext['seriesType'] | undefined {
  return seriesList.find((series) => series.id === seriesId)?.type;
}

export function buildTooltipFormatterContext<TDatum>(
  chart: InteractiveChartContext<TDatum>,
  nearest: NearestDatumResult<TDatum>,
): ChartTooltipFormatterContext<TDatum> {
  if (chart.kind === 'cartesian') {
    return {
      seriesId: nearest.seriesId,
      seriesLabel: resolveSeriesLabel(chart.options.series, nearest.seriesId),
      seriesType: resolveCartesianSeriesType(chart.options.series, nearest.seriesId) ?? 'line',
      datum: nearest.datum,
      x: nearest.x,
      value: nearest.value,
    };
  }

  return {
    seriesId: nearest.seriesId,
    seriesLabel: resolveSeriesLabel(chart.options.series, nearest.seriesId),
    seriesType: 'line',
    datum: nearest.datum,
    x: nearest.x,
    value: nearest.value,
  };
}

export function formatTooltipTitle<TDatum>(
  ctx: ChartTooltipFormatterContext<TDatum>,
  options: ChartTooltipOptions<TDatum>,
): string {
  if (options.titleFormatter) {
    return options.titleFormatter(ctx);
  }

  if (ctx.x != null) {
    return String(ctx.x);
  }

  return ctx.seriesLabel ?? ctx.seriesId;
}

export function formatTooltipValue<TDatum>(
  ctx: ChartTooltipFormatterContext<TDatum>,
  options: ChartTooltipOptions<TDatum>,
): string {
  if (options.valueFormatter) {
    return options.valueFormatter(ctx);
  }

  if (ctx.value == null || Number.isNaN(ctx.value)) {
    return '—';
  }

  return String(ctx.value);
}

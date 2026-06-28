/**
 * @file packages/gen-chart/src/react/components/chrome/ChartLegend.tsx
 * @description Series legend with visibility toggle (Gate C6).
 * @created 2026-06-27
 *
 * @remark
 * - toggleSeries → model visibility → cartesian yDomain 재계산
 */

import { useInteractiveChart } from '../../hooks/useInteractiveChart';
import { resolveLegendOptionsFromInteractive } from '../../utils/resolveInteractiveOptions';
import { resolveSeriesColor } from '../../utils/resolveSeriesColor';

export function ChartLegend() {
  const chart = useInteractiveChart();
  const legend = resolveLegendOptionsFromInteractive(chart.options.interactive?.legend);

  if (!legend.enabled) {
    return null;
  }

  const { tokens } = chart;
  const seriesList = chart.options.series;

  return (
    <div
      className="gen-chart-legend"
      data-gen-chart-legend=""
      data-position={legend.position}
      data-align={legend.align}
      role="list"
      aria-label="Chart legend"
      style={{
        justifyContent:
          legend.align === 'start'
            ? 'flex-start'
            : legend.align === 'end'
              ? 'flex-end'
              : 'center',
        gap: tokens.spacing.legendItemGap,
        fontFamily: tokens.typography.fontFamily,
        fontSize: tokens.typography.legendFontSize,
      }}
    >
      {seriesList.map((series) => {
        const visible = chart.isSeriesVisible(series.id);
        const color = resolveSeriesColor(seriesList, series.id, tokens);
        const label = series.label ?? series.id;

        return (
          <button
            key={series.id}
            type="button"
            className="gen-chart-legend-item"
            data-gen-chart-legend-item=""
            data-series-id={series.id}
            data-visible={visible ? 'true' : 'false'}
            role="listitem"
            aria-pressed={visible}
            aria-label={label}
            onClick={() => chart.toggleSeries(series.id)}
            style={{
              color: visible ? tokens.color.legendText : tokens.color.legendTextMuted,
            }}
          >
            <span
              className="gen-chart-legend-marker"
              data-gen-chart-legend-marker=""
              aria-hidden="true"
              style={{
                width: tokens.spacing.legendMarkerSize,
                height: tokens.spacing.legendMarkerSize,
                background: visible ? color : 'transparent',
                borderColor: color,
                opacity: visible ? 1 : 0.45,
              }}
            />
            <span className="gen-chart-legend-label" data-gen-chart-legend-label="">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
ChartLegend.displayName = 'ChartLegend';

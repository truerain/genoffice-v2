/**
 * @file packages/gen-chart/src/react/components/chrome/ChartTooltip.tsx
 * @description Pointer-driven tooltip overlay from getNearestDatum (Gate C6).
 * @created 2026-06-27
 *
 * @remark
 * - Place as sibling of CartesianPlot / PolarPlot (not inside SVG)
 * - HTML overlay; hit layer covers plotArea in chart coordinates
 */

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { useInteractiveChart } from '../../hooks/useInteractiveChart';
import { resolveTooltipOptions } from '../../utils/resolveInteractiveOptions';
import { chartPointerToChartPx } from './chartPointerToChartPx';
import {
  buildTooltipFormatterContext,
  formatTooltipTitle,
  formatTooltipValue,
} from './formatTooltipContent';
import { resolveTooltipPosition } from './resolveTooltipPosition';

interface TooltipContent {
  anchorX: number;
  anchorY: number;
  title: string;
  value: string;
}

interface TooltipState extends TooltipContent {
  left: number;
  top: number;
}

export function ChartTooltip() {
  const chart = useInteractiveChart();
  const tooltipOptions = resolveTooltipOptions(chart.options.interactive?.tooltip);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [pending, setPending] = useState<TooltipContent | null>(null);

  const clearTooltip = useCallback(() => {
    setTooltip(null);
    setPending(null);
  }, []);

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const { xPx, yPx } = chartPointerToChartPx(event, chart);
      const nearest = chart.getNearestDatum(xPx, yPx);
      if (!nearest) {
        clearTooltip();
        return;
      }

      const formatterContext = buildTooltipFormatterContext(chart, nearest);
      const title = formatTooltipTitle(formatterContext, tooltipOptions);
      const value = formatTooltipValue(formatterContext, tooltipOptions);

      setPending({
        anchorX: xPx,
        anchorY: yPx,
        title,
        value,
      });
    },
    [chart, clearTooltip, tooltipOptions],
  );

  useLayoutEffect(() => {
    if (!pending) return;

    const element = tooltipRef.current;
    const width = element?.offsetWidth ?? 0;
    const height = element?.offsetHeight ?? 0;
    const position = resolveTooltipPosition(
      { x: pending.anchorX, y: pending.anchorY },
      { width, height },
      { width: chart.width, height: chart.height },
    );

    setTooltip({
      ...pending,
      left: position.x,
      top: position.y,
    });
  }, [pending, chart.width, chart.height]);

  if (!tooltipOptions.enabled) {
    return null;
  }

  const { tokens } = chart;
  const tooltipContent = pending ?? tooltip;

  return (
    <>
      <div
        className="gen-chart-tooltip-hit-layer"
        data-gen-chart-tooltip-hit=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          touchAction: 'none',
        }}
        onPointerMove={handlePointerMove}
        onPointerLeave={clearTooltip}
        onPointerCancel={clearTooltip}
      />
      {tooltipContent ? (
        <div
          ref={tooltipRef}
          className="gen-chart-tooltip"
          data-gen-chart-tooltip=""
          role="tooltip"
          style={{
            left: tooltip?.left ?? -9999,
            top: tooltip?.top ?? -9999,
            visibility: tooltip ? 'visible' : 'hidden',
            background: tokens.color.tooltipBg,
            borderColor: tokens.color.tooltipBorder,
            color: tokens.color.tooltipText,
            borderRadius: tokens.border.tooltipRadius,
            borderWidth: tokens.border.tooltipBorderWidth,
            fontFamily: tokens.typography.fontFamily,
            fontSize: tokens.typography.tooltipFontSize,
            padding: `${tokens.spacing.tooltipPaddingY}px ${tokens.spacing.tooltipPaddingX}px`,
          }}
        >
          <div className="gen-chart-tooltip-title" data-gen-chart-tooltip-title="">
            {tooltipContent.title}
          </div>
          <div className="gen-chart-tooltip-value" data-gen-chart-tooltip-value="">
            {tooltipContent.value}
          </div>
        </div>
      ) : null}
    </>
  );
}
ChartTooltip.displayName = 'ChartTooltip';

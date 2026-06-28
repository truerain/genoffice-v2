/**
 * @file packages/gen-chart/src/internal/visx/CartesianAxisLayers.tsx
 * @description visx axis layers for cartesian charts (internal only).
 * @created 2026-06-27
 *
 * @remark
 */

import { AxisBottom, AxisLeft } from '@visx/axis';
import { Group } from '@visx/group';
import type { CartesianScales } from '../../core/scale/createCartesianScales';
import type { PlotArea } from '../../types/model';
import type { ResolvedAxisOptions } from '../../react/utils/resolveAxisOptions';
import { createPlotLocalScales } from './plotLocalScales';

export interface CartesianAxisLayersProps {
  scales: CartesianScales;
  plotArea: PlotArea;
  xAxis: ResolvedAxisOptions;
  yAxis: ResolvedAxisOptions;
  tickColor: string;
  tickFontSize: number;
  tickFontFamily: string;
  xTickFormat: (value: unknown) => string;
  yTickFormat: (value: unknown) => string;
}

export function CartesianAxisLayers({
  scales,
  plotArea,
  xAxis,
  yAxis,
  tickColor,
  tickFontSize,
  tickFontFamily,
  xTickFormat,
  yTickFormat,
}: CartesianAxisLayersProps) {
  const localScales = createPlotLocalScales(scales, plotArea);

  const axisStyle = {
    tickLabel: {
      fill: tickColor,
      fontSize: tickFontSize,
      fontFamily: tickFontFamily,
    },
    axis: {
      stroke: tickColor,
    },
    ticks: {
      stroke: tickColor,
    },
  } as const;

  return (
    <Group left={plotArea.x} top={plotArea.y}>
      {yAxis.show ? (
        <Group data-gen-chart-y-axis="">
          <AxisLeft
            left={0}
            top={0}
            scale={localScales.yScale}
            hideTicks={!yAxis.showTicks}
            hideAxisLine={!yAxis.showTicks}
            numTicks={yAxis.tickCount}
            tickFormat={yTickFormat}
            {...axisStyle}
          />
        </Group>
      ) : null}
      {xAxis.show ? (
        <Group data-gen-chart-x-axis="">
          <AxisBottom
            top={plotArea.height}
            left={0}
            scale={localScales.xScale}
            hideTicks={!xAxis.showTicks}
            hideAxisLine={!xAxis.showTicks}
            numTicks={xAxis.tickCount}
            tickFormat={xTickFormat}
            {...axisStyle}
          />
        </Group>
      ) : null}
    </Group>
  );
}

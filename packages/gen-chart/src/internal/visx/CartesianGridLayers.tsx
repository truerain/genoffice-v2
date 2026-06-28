/**
 * @file packages/gen-chart/src/internal/visx/CartesianGridLayers.tsx
 * @description visx grid rows/columns for cartesian charts (internal only).
 * @created 2026-06-27
 *
 * @remark
 */

import { GridColumns, GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import type { CartesianScales } from '../../core/scale/createCartesianScales';
import type { PlotArea } from '../../types/model';
import { createPlotLocalScales } from './plotLocalScales';

export interface CartesianGridLayersProps {
  scales: CartesianScales;
  plotArea: PlotArea;
  stroke: string;
  strokeWidth: number;
}

export function CartesianGridLayers({
  scales,
  plotArea,
  stroke,
  strokeWidth,
}: CartesianGridLayersProps) {
  const localScales = createPlotLocalScales(scales, plotArea);

  return (
    <Group left={plotArea.x} top={plotArea.y} data-gen-chart-grid="">
      <GridRows
        scale={localScales.yScale}
        width={plotArea.width}
        left={0}
        top={0}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <GridColumns
        scale={localScales.xScale}
        height={plotArea.height}
        left={0}
        top={0}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </Group>
  );
}

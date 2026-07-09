// packages/gen-datagrid/src/features/master-detail/detailToggle.tsx
// Resolves master-detail expand toggle anchor and default renderer.

import type { Cell } from '@tanstack/react-table';
import * as React from 'react';

import type {
  GenDataGridDetailToggleContext,
  GenDataGridDetailToggleProps,
} from '../../GenDataGrid.types';
import { isGenDataGridSystemColumnId } from '../system-columns/systemColumns';

export function resolveDetailToggleCellIndex<TData>(
  orderedCells: Cell<TData, unknown>[],
  detailToggleColumnId?: string
): number {
  if (detailToggleColumnId) {
    const anchoredIndex = orderedCells.findIndex(
      (cell) => cell.column.id === detailToggleColumnId
    );
    if (anchoredIndex >= 0) {
      return anchoredIndex;
    }
  }

  return orderedCells.findIndex((cell) => !isGenDataGridSystemColumnId(cell.column.id));
}

type RenderDefaultDetailToggleArgs<TData> = {
  ctx: GenDataGridDetailToggleContext<TData>;
  detailToggleProps?: GenDataGridDetailToggleProps;
  onMouseDown: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export function renderDefaultDetailToggle<TData>({
  ctx,
  detailToggleProps,
  onMouseDown,
  onClick,
}: RenderDefaultDetailToggleArgs<TData>) {
  const className = ['gen-datagrid__detail-toggle', detailToggleProps?.className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={className}
      data-gen-datagrid-detail-toggle="true"
      aria-expanded={ctx.expanded}
      aria-label={
        ctx.expanded
          ? detailToggleProps?.ariaLabelCollapse ?? `Collapse row ${ctx.rowId} detail`
          : detailToggleProps?.ariaLabelExpand ?? `Expand row ${ctx.rowId} detail`
      }
      onMouseDown={onMouseDown}
      onClick={onClick}
    >
      {ctx.expanded ? '-' : '+'}
    </button>
  );
}

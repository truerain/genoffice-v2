// packages/gen-datagrid/src/features/display/resolveCellMeta.ts
// Resolves column meta cell className and inline style from GenDataGrid cell context.

import type * as React from 'react';

import type { GenDataGridCellContext, GenDataGridColumnMeta } from '../../GenDataGrid.types';

export function resolveMetaCellClassName<TData>(
  meta: GenDataGridColumnMeta<TData> | undefined,
  ctx: GenDataGridCellContext<TData>
): string | undefined {
  const cellClassName = meta?.cellClassName;
  if (!cellClassName) return undefined;
  return typeof cellClassName === 'function' ? cellClassName(ctx) : cellClassName;
}

export function resolveMetaCellStyle<TData>(
  meta: GenDataGridColumnMeta<TData> | undefined,
  ctx: GenDataGridCellContext<TData>
): React.CSSProperties | undefined {
  const cellStyle = meta?.cellStyle;
  if (!cellStyle) return undefined;
  return typeof cellStyle === 'function' ? cellStyle(ctx) : cellStyle;
}

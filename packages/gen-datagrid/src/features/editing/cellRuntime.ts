// packages/gen-datagrid/src/features/editing/cellRuntime.ts
// Resolves per-cell editing runtime metadata for GenDataGrid.

import type { Row } from '@tanstack/react-table';

import type {
  GenDataGridEditableContext,
  GenDataGridEditPolicy,
  GenDataGridResolveRowStatusFn,
} from '../../GenDataGrid.types';
import { createEditableContext, resolveEditableCell } from './editableCell';
import { createEditValueHandlers } from './editValuePipeline';
import { resolveBlurOwnership } from './blurPolicy';
import { resolveEditPolicy, type ResolvedGenDataGridEditPolicy } from './editPolicy';

export type GenDataGridCellEditingRuntime<TData> = {
  row: Row<TData>;
  editableContext: GenDataGridEditableContext<TData>;
  isEditable: boolean;
  resolvedEditPolicy: ResolvedGenDataGridEditPolicy;
  commitOnBlur: boolean;
  blurOwnership: ReturnType<typeof resolveBlurOwnership>;
  applyCommitValue: (value: unknown) => unknown;
};

type ResolveCellEditingRuntimeArgs<TData> = {
  rows: Row<TData>[];
  coord: { rowId: string; columnId: string };
  readOnly?: boolean;
  isCellEditable?: (ctx: GenDataGridEditableContext<TData>) => boolean;
  editPolicy?: GenDataGridEditPolicy;
  editCommitOnBlur?: boolean;
  resolveRowStatus?: GenDataGridResolveRowStatusFn<TData>;
};

export function resolveCellEditingRuntime<TData>({
  rows,
  coord,
  readOnly,
  isCellEditable,
  editPolicy,
  editCommitOnBlur,
  resolveRowStatus,
}: ResolveCellEditingRuntimeArgs<TData>): GenDataGridCellEditingRuntime<TData> | null {
  const row = rows.find((item) => item.id === coord.rowId);
  const tanstackCell = row?.getVisibleCells().find((cell) => cell.column.id === coord.columnId);
  if (!row || !tanstackCell) {
    return null;
  }

  const editableContext = createEditableContext({
    row,
    column: tanstackCell.column,
    resolveRowStatus,
  });
  const meta = tanstackCell.column.columnDef.meta;
  const editValueHandlers = createEditValueHandlers({ meta, editableContext });

  return {
    row,
    editableContext,
    isEditable: resolveEditableCell({
      row,
      column: tanstackCell.column,
      readOnly,
      isCellEditable,
      resolveRowStatus,
    }),
    resolvedEditPolicy: resolveEditPolicy(editPolicy, meta?.editPolicy),
    commitOnBlur: meta?.editCommitOnBlur ?? editCommitOnBlur ?? true,
    blurOwnership: resolveBlurOwnership({
      editType: meta?.editType,
      editLookup: meta?.editLookup,
      gridPolicy: editPolicy,
      columnPolicy: meta?.editPolicy,
      columnBlurOwnership: meta?.editBlurOwnership,
    }),
    applyCommitValue: editValueHandlers.applyCommit,
  };
}

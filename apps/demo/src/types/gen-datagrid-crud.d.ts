/**
 * @file apps/demo/src/types/gen-datagrid-crud.d.ts
 * @description Ambient types until @gen-office/gen-datagrid-crud dist ships .d.ts (Gate D4).
 * @created 2026-06-29
 *
 * @remark
 * - Remove when packages/gen-datagrid-crud vite-plugin-dts emits dist/index.d.ts
 *
 */

declare module '@gen-office/gen-datagrid-crud' {
  import type { ColumnDef } from '@tanstack/react-table';
  import type { CSSProperties, ReactNode } from 'react';

  export type DataGridCrudCommitArgs<TData> = {
    changeSet: {
      created: TData[];
      updated: Array<{ rowId: string; patch: Partial<TData> }>;
      deleted: Array<{ rowId: string }>;
    };
    state: unknown;
    data: readonly TData[];
  };

  export type DataGridCrudValidationResult =
    | void
    | boolean
    | {
        valid?: boolean;
        fieldErrors?: Record<string, string>;
        error?: unknown;
      };

  export type DataGridCrudCommitResult<TData> =
    | void
    | {
        ok?: boolean;
        nextData?: readonly TData[];
        error?: unknown;
        fieldErrors?: Record<string, string>;
      };

  export type DataGridCrudBuiltInActionKey =
    | 'add'
    | 'delete'
    | 'save'
    | 'reset'
    | 'filter'
    | 'columnReorder'
    | 'excel';

  export type DataGridCrudActionItem<TData> = {
    key: string;
    label: ReactNode;
    icon?: ReactNode;
    side?: 'left' | 'right';
    order?: number;
    onClick?: (ctx: unknown) => void | Promise<void>;
  };

  export type DataGridCrudActionBarOptions<TData> = {
    enabled?: boolean;
    includeBuiltIns?: readonly DataGridCrudBuiltInActionKey[];
    customActions?: readonly DataGridCrudActionItem<TData>[];
  };

  export type GenDataGridCrudProps<TData> = {
    title?: ReactNode;
    readonly?: boolean;
    data: readonly TData[];
    columns: readonly ColumnDef<TData, unknown>[];
    getRowId: (row: TData, index: number) => string;
    dataVersion?: string | number;
    createRow?: (ctx: { data: readonly TData[] }) => TData;
    validateCommit?: (
      args: DataGridCrudCommitArgs<TData>,
    ) => DataGridCrudValidationResult | Promise<DataGridCrudValidationResult>;
    onCommit?: (
      args: DataGridCrudCommitArgs<TData>,
    ) => Promise<DataGridCrudCommitResult<TData>>;
    onExport?: (args: unknown) => void | Promise<void>;
    actionBar?: DataGridCrudActionBarOptions<TData>;
    gridProps?: Record<string, unknown>;
    className?: string;
    style?: CSSProperties;
  };

  export function GenDataGridCrud<TData>(
    props: GenDataGridCrudProps<TData>,
  ): ReactNode;
}

declare module '@gen-office/gen-datagrid-crud/index.css';

// packages/gen-datagrid-crud/src/GenDataGridCrud.types.ts
// Defines public types for the GenDataGridCrud thin shell.

import type * as React from 'react';
import type { RowSelectionState } from '@tanstack/react-table';
import type {
  GenDataGridChangeSet,
  GenDataGridColumnDef,
  GenDataGridDetailPanelContext,
  GenDataGridDetailToggleContext,
  GenDataGridDetailToggleProps,
  GenDataGridDirtyState,
  GenDataGridExpandedRowState,
  GenDataGridHandle,
  GenDataGridProps,
  GenDataGridRowContext,
} from '@gen-office/gen-datagrid';

type GridPropsOwnedByCrud =
  | 'data'
  | 'defaultData'
  | 'columns'
  | 'getRowId'
  | 'readOnly'
  | 'readonly'
  | 'onDirtyStateChange'
  | 'rowStatusResolver'
  | 'onCurrentRowChange'
  | 'rowSelection'
  | 'onRowSelectionChange'
  | 'ref';

type GridPropsOwnedByCrudMasterDetail =
  | 'enableMasterDetail'
  | 'expandedRows'
  | 'defaultExpandedRows'
  | 'onExpandedRowsChange'
  | 'getRowCanExpand'
  | 'renderDetailPanel'
  | 'detailPanelHeight'
  | 'detailToggleColumnId'
  | 'renderDetailToggle'
  | 'detailToggleProps';

export type DataGridCrudMasterDetailToggleConfig<TData> = {
  columnId?: string;
  render?: (ctx: GenDataGridDetailToggleContext<TData>) => React.ReactNode;
  props?: GenDataGridDetailToggleProps;
};

export type DataGridCrudMasterDetailConfig<TData> = {
  enabled?: boolean;
  expandedRows?: GenDataGridExpandedRowState;
  defaultExpandedRows?: GenDataGridExpandedRowState;
  onExpandedRowsChange?: (next: GenDataGridExpandedRowState) => void;
  getRowCanExpand?: (ctx: GenDataGridRowContext<TData>) => boolean;
  renderDetailPanel: (ctx: GenDataGridDetailPanelContext<TData>) => React.ReactNode;
  panelHeight?: number;
  toggle?: DataGridCrudMasterDetailToggleConfig<TData>;
};

export type DataGridCrudBuiltInActionKey =
  | 'add'
  | 'delete'
  | 'save'
  | 'reset'
  | 'filter'
  | 'columnReorder'
  | 'excel';

export type DataGridCrudCommitResult<TData> =
  | void
  | {
      ok?: boolean;
      nextData?: readonly TData[];
      error?: unknown;
      fieldErrors?: DataGridCrudFieldErrors;
    };

export type DataGridCrudCreateRowContext<TData> = {
  data: readonly TData[];
};

export type DataGridCrudCreatedRowPosition = 'top' | 'bottom';
export type DataGridCrudFieldErrors = Record<string, string>;

export type DataGridCrudValidationResult =
  | void
  | boolean
  | {
      valid?: boolean;
      fieldErrors?: DataGridCrudFieldErrors;
      error?: unknown;
    };

export type DataGridCrudUiState<TData> = {
  readonly: boolean;
  canCreateRow: boolean;
  canExport: boolean;
  data: readonly TData[];
  sourceData: readonly TData[];
  createdRows: readonly TData[];
  createdRowIds: string[];
  dirtyState: GenDataGridDirtyState;
  dirty: boolean;
  isCommitting: boolean;
  fieldErrors: DataGridCrudFieldErrors;
  validationError?: unknown;
  currentRowId: string | null;
  selectedRowIds: string[];
  filterEnabled: boolean;
  columnReorderEnabled: boolean;
  lastChangeSet?: GenDataGridChangeSet<TData>;
};

export type DataGridCrudCommitArgs<TData> = {
  changeSet: GenDataGridChangeSet<TData>;
  state: DataGridCrudUiState<TData>;
  data: readonly TData[];
};

export type DataGridCrudExportArgs<TData> = {
  data: readonly TData[];
  sourceData: readonly TData[];
  createdRows: readonly TData[];
  lastChangeSet?: GenDataGridChangeSet<TData>;
  state: DataGridCrudUiState<TData>;
};

export type DataGridCrudActionApi = {
  addRow: () => void;
  deleteSelectedRows: () => void;
  save: () => Promise<void>;
  reset: () => void;
  clearFilters: () => void;
  toggleFilters: () => void;
  toggleColumnReorder: () => void;
  exportExcel: () => void | Promise<void>;
};

export type DataGridCrudActionContext<TData> = {
  state: DataGridCrudUiState<TData>;
  actionApi: DataGridCrudActionApi;
};

export type DataGridCrudActionItem<TData> = {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  side?: 'left' | 'right';
  order?: number;
  hidden?: boolean | ((ctx: DataGridCrudActionContext<TData>) => boolean);
  disabled?: boolean | ((ctx: DataGridCrudActionContext<TData>) => boolean);
  loading?: boolean | ((ctx: DataGridCrudActionContext<TData>) => boolean);
  onClick?: (ctx: DataGridCrudActionContext<TData>) => void | Promise<void>;
};

export type DataGridCrudActionBarButtonMode = 'label' | 'icon';

export type DataGridCrudActionBarOptions<TData> = {
  enabled?: boolean;
  title?: React.ReactNode;
  /**
   * Built-in action keys to render. When omitted:
   * - editable → add, delete, save, reset, filter, columnReorder, excel
   * - `readonly` → filter, columnReorder, excel (mutation actions hidden)
   */
  includeBuiltIns?: readonly DataGridCrudBuiltInActionKey[];
  customActions?: readonly DataGridCrudActionItem<TData>[];
  showTotalRows?: boolean;
  /** Action button presentation. Overrides DataGridCrudChromeProvider when set. */
  buttonMode?: DataGridCrudActionBarButtonMode;
};

export type DataGridCrudController<TData> = {
  gridRef: React.RefObject<GenDataGridHandle<TData> | null>;
  state: DataGridCrudUiState<TData>;
  gridData: readonly TData[];
  actionApi: DataGridCrudActionApi;
  gridStateProps: Pick<
    GenDataGridProps<TData>,
    | 'enableDirtyState'
    | 'onDirtyStateChange'
    | 'enableRowStatus'
    | 'rowStatusResolver'
    | 'enableCurrentRowHighlight'
    | 'onCurrentRowChange'
    | 'enableRowSelection'
    | 'rowSelection'
    | 'onRowSelectionChange'
    | 'enableColumnFilters'
    | 'enableColumnReorder'
  >;
};

export type DataGridCrudGridFeatureOptions<TData> = Pick<
  GenDataGridProps<TData>,
  | 'enableDirtyState'
  | 'enableRowStatus'
  | 'enableCurrentRowHighlight'
  | 'enableRowSelection'
  | 'enableColumnFilters'
  | 'enableColumnReorder'
>;

export type GenDataGridCrudProps<TData> = {
  title?: React.ReactNode;
  readonly?: boolean;
  data: readonly TData[];
  columns: readonly GenDataGridColumnDef<TData, unknown>[];
  getRowId: (row: TData, index: number) => string;
  dataVersion?: string | number;
  createRow?: (ctx: DataGridCrudCreateRowContext<TData>) => TData;
  /**
   * Where the created-row block sits relative to `data`.
   * - `'top'` (default): created block above data; each Add **prepends** so the newest row is index 0.
   * - `'bottom'`: created block below data; each Add **appends**.
   */
  createdRowPosition?: DataGridCrudCreatedRowPosition;
  onCommit?: (args: DataGridCrudCommitArgs<TData>) => Promise<DataGridCrudCommitResult<TData>>;
  beforeCommit?: (
    args: DataGridCrudCommitArgs<TData>
  ) => boolean | Promise<boolean>;
  validateCommit?: (
    args: DataGridCrudCommitArgs<TData>
  ) => DataGridCrudValidationResult | Promise<DataGridCrudValidationResult>;
  onCommitSuccess?: (result: { nextData?: readonly TData[] }) => void;
  onCommitError?: (result: { error: unknown; fieldErrors?: DataGridCrudFieldErrors }) => void;
  onValidationError?: (result: {
    error?: unknown;
    fieldErrors: DataGridCrudFieldErrors;
  }) => void;
  onExport?: (args: DataGridCrudExportArgs<TData>) => void | Promise<void>;
  actionBar?: DataGridCrudActionBarOptions<TData>;
  /**
   * Fired when the CRUD UI `state` object changes (created/dirty/selection/…).
   * Callback identity is stored in a ref — changing only `onStateChange` does not re-fire.
   * Prefer syncing small derived fields; avoid feeding the whole state back into parent props
   * that recreate the grid every notification. See package-design § onStateChange.
   */
  onStateChange?: (state: DataGridCrudUiState<TData>) => void;
  masterDetail?: DataGridCrudMasterDetailConfig<TData>;
  gridProps?: Omit<
    GenDataGridProps<TData>,
    GridPropsOwnedByCrud | GridPropsOwnedByCrudMasterDetail
  >;
  /** GenDataGrid handle ref (emitCellValueChange 등 imperative API용) */
  gridRef?: React.Ref<GenDataGridHandle<TData>>;
  className?: string;
  style?: React.CSSProperties;
};

export type DataGridCrudControllerArgs<TData> = Pick<
  GenDataGridCrudProps<TData>,
  | 'readonly'
  | 'data'
  | 'getRowId'
  | 'createRow'
  | 'createdRowPosition'
  | 'onCommit'
  | 'beforeCommit'
  | 'validateCommit'
  | 'onCommitSuccess'
  | 'onCommitError'
  | 'onValidationError'
  | 'onExport'
  | 'onStateChange'
> & {
  gridFeatureOptions?: Partial<DataGridCrudGridFeatureOptions<TData>>;
};

export type DataGridCrudRowSelectionState = RowSelectionState;

// packages/gen-datagrid-crud/src/index.ts
// Exposes the public GenDataGridCrud package API.

import './index.css';

export { GenDataGridCrud } from './GenDataGridCrud';
export { DataGridCrudActionBar } from './components/DataGridCrudActionBar';
export { useDataGridCrudController } from './crud/useDataGridCrudController';
export { resolveMasterDetailGridProps } from './features/master-detail/resolveMasterDetailGridProps';
export type {
  DataGridCrudActionApi,
  DataGridCrudActionBarOptions,
  DataGridCrudActionContext,
  DataGridCrudActionItem,
  DataGridCrudBuiltInActionKey,
  DataGridCrudCommitArgs,
  DataGridCrudCommitResult,
  DataGridCrudController,
  DataGridCrudExportArgs,
  DataGridCrudFieldErrors,
  DataGridCrudMasterDetailConfig,
  DataGridCrudMasterDetailToggleConfig,
  DataGridCrudUiState,
  DataGridCrudValidationResult,
  GenDataGridCrudProps,
} from './GenDataGridCrud.types';
export type { GenDataGridMasterDetailGridProps } from './features/master-detail/resolveMasterDetailGridProps';

// packages/gen-datagrid-crud/src/features/master-detail/resolveMasterDetailGridProps.ts
// Maps CRUD masterDetail config to GenDataGrid flat master-detail props.
//
// @remark
// Spread order in GenDataGridCrud: gridProps → masterDetailGridProps → controller.gridStateProps.

import type { GenDataGridProps } from '@gen-office/gen-datagrid';

import type { DataGridCrudMasterDetailConfig } from '../../GenDataGridCrud.types';

export type GenDataGridMasterDetailGridProps<TData> = Pick<
  GenDataGridProps<TData>,
  | 'enableMasterDetail'
  | 'expandedRows'
  | 'defaultExpandedRows'
  | 'onExpandedRowsChange'
  | 'getRowCanExpand'
  | 'renderDetailPanel'
  | 'detailPanelHeight'
  | 'detailToggleColumnId'
  | 'renderDetailToggle'
  | 'detailToggleProps'
>;

export function resolveMasterDetailGridProps<TData>(
  config?: DataGridCrudMasterDetailConfig<TData>
): GenDataGridMasterDetailGridProps<TData> {
  if (!config) {
    return {};
  }

  return {
    enableMasterDetail: config.enabled ?? true,
    expandedRows: config.expandedRows,
    defaultExpandedRows: config.defaultExpandedRows,
    onExpandedRowsChange: config.onExpandedRowsChange,
    getRowCanExpand: config.getRowCanExpand,
    renderDetailPanel: config.renderDetailPanel,
    detailPanelHeight: config.panelHeight,
    detailToggleColumnId: config.toggle?.columnId,
    renderDetailToggle: config.toggle?.render,
    detailToggleProps: config.toggle?.props,
  };
}

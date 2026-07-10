// packages/gen-datagrid/src/features/editing/resolveEditLookup.ts
// Resolves built-in lookup editor activation and column meta configuration.

import type {
  GenDataGridColumnMeta,
  GenDataGridEditLookupConfig,
} from '../../GenDataGrid.types';

export type ResolvedGenDataGridEditLookupConfig<TData, TSelection = unknown> = {
  mode: NonNullable<GenDataGridEditLookupConfig<TData, TSelection>['mode']>;
  allowCellEdit: boolean;
  getDisplayValue?: GenDataGridEditLookupConfig<TData, TSelection>['getDisplayValue'];
  mapSelection?: GenDataGridEditLookupConfig<TData, TSelection>['mapSelection'];
  renderModal: GenDataGridEditLookupConfig<TData, TSelection>['renderModal'];
  triggerAriaLabel?: string;
};

let warnedMissingEditLookup = false;

export function isLookupColumn<TData>(meta?: GenDataGridColumnMeta<TData>): boolean {
  return meta?.editType === 'lookup' || meta?.editLookup != null;
}

export function resolveEditLookupConfig<TData>(
  meta?: GenDataGridColumnMeta<TData>
): ResolvedGenDataGridEditLookupConfig<TData> | undefined {
  if (!isLookupColumn(meta)) {
    return undefined;
  }

  const config = meta?.editLookup;
  if (!config) {
    if (meta?.editType === 'lookup' && !warnedMissingEditLookup) {
      warnedMissingEditLookup = true;
      console.warn(
        '[GenDataGrid] editType: "lookup" requires meta.editLookup with renderModal.'
      );
    }
    return undefined;
  }

  return {
    mode: config.mode ?? 'modal',
    allowCellEdit: config.allowCellEdit ?? false,
    getDisplayValue: config.getDisplayValue,
    mapSelection: config.mapSelection,
    renderModal: config.renderModal,
    triggerAriaLabel: config.triggerAriaLabel,
  };
}

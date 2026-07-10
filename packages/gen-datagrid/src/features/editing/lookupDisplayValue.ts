// packages/gen-datagrid/src/features/editing/lookupDisplayValue.ts
// Resolves lookup column display text from column meta and cell context.

import type { GenDataGridEditableContext } from '../../GenDataGrid.types';
import type { ResolvedGenDataGridEditLookupConfig } from './resolveEditLookup';

export function resolveLookupDisplayValue<TData, TSelection = unknown>(
  config: ResolvedGenDataGridEditLookupConfig<TData, TSelection>,
  ctx: GenDataGridEditableContext<TData>,
  value: unknown = ctx.value
): string {
  if (config.getDisplayValue) {
    return config.getDisplayValue(value, ctx);
  }
  if (value == null) {
    return '';
  }
  return String(value);
}

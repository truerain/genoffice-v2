// packages/gen-datagrid/src/features/editing/LookupDisplayCell.tsx
// Renders lookup display value and trigger button in non-editing body cells.

import * as React from 'react';
import { Search } from 'lucide-react';

import type { GenDataGridEditableContext } from '../../GenDataGrid.types';
import { resolveLookupDisplayValue } from './lookupDisplayValue';
import type { ResolvedGenDataGridEditLookupConfig } from './resolveEditLookup';

type LookupDisplayCellProps<TData> = {
  editableContext: GenDataGridEditableContext<TData>;
  config: ResolvedGenDataGridEditLookupConfig<TData>;
  disabled?: boolean;
  onLookupTrigger: () => void;
};

export function LookupDisplayCell<TData>({
  editableContext,
  config,
  disabled,
  onLookupTrigger,
}: LookupDisplayCellProps<TData>) {
  const displayValue = resolveLookupDisplayValue(config, editableContext);
  const triggerLabel = config.triggerAriaLabel ?? `${editableContext.columnId} lookup`;

  return (
    <span className="gen-datagrid__lookup-display">
      <span className="gen-datagrid__lookup-display-value" title={displayValue}>
        {displayValue}
      </span>
      <button
        type="button"
        className="gen-datagrid__lookup-trigger"
        aria-label={triggerLabel}
        disabled={disabled}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.stopPropagation();
          onLookupTrigger();
        }}
      >
        <Search aria-hidden="true" size={14} strokeWidth={2} />
      </button>
    </span>
  );
}

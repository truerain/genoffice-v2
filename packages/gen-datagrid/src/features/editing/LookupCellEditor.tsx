// packages/gen-datagrid/src/features/editing/LookupCellEditor.tsx
// Built-in modal lookup cell editor shell for GenDataGrid.

import * as React from 'react';
import { Search } from 'lucide-react';

import type {
  GenDataGridEditorContext,
  GenDataGridLookupModalContext,
} from '../../GenDataGrid.types';
import { createEditorBlurHandler } from './blurPolicy';
import { handleBuiltinEditorArrowNavigation } from './builtinEditorKeyboard';
import { resolveLookupDisplayValue } from './lookupDisplayValue';
import type { ResolvedGenDataGridEditLookupConfig } from './resolveEditLookup';

export function LookupCellEditor<TData, TSelection = unknown>({
  ctx,
  config,
}: {
  ctx: GenDataGridEditorContext<TData>;
  config: ResolvedGenDataGridEditLookupConfig<TData, TSelection>;
}) {
  const anchorRef = React.useRef<HTMLInputElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(Boolean(ctx.openLookupModal));

  const displayValue = resolveLookupDisplayValue(config, ctx, ctx.draftValue);
  const inputValue = config.allowCellEdit
    ? String(ctx.draftValue ?? '')
    : displayValue;

  const closeModal = React.useCallback(() => {
    setOpen(false);
    window.requestAnimationFrame(() => {
      if (config.allowCellEdit) {
        anchorRef.current?.focus();
        return;
      }
      triggerRef.current?.focus();
    });
  }, [config.allowCellEdit]);

  const openModal = React.useCallback(() => {
    setOpen(true);
  }, []);

  const handleBlur = React.useMemo(
    () =>
      createEditorBlurHandler({
        blurOwnership: ctx.blurOwnership ?? 'modal',
        commitOnBlur: ctx.commitOnBlur,
        gridRoot: ctx.getGridRoot?.() ?? null,
        getEditorSurfaces: () => ctx.getEditorSurfaces?.() ?? [],
        commit: () => ctx.commit(),
      }),
    [ctx]
  );

  const modalContext = React.useMemo<GenDataGridLookupModalContext<TData, TSelection>>(
    () => ({
      ...ctx,
      applyValue: ctx.commitAndKeepEditing,
      commit: ctx.commitAndKeepEditing,
      cancel: closeModal,
      allowCellEdit: config.allowCellEdit,
      displayValue,
      keyword: config.allowCellEdit ? String(ctx.draftValue ?? '') : undefined,
      closeModal,
      applySelection: (selection) => {
        const patch = config.mapSelection
          ? config.mapSelection(selection)
          : { [ctx.columnId]: selection };
        ctx.applyRowPatch(patch, { keepEditing: true });
      },
    }),
    [closeModal, config.allowCellEdit, config.mapSelection, ctx, displayValue]
  );

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      ctx.tabNavigate?.(event.shiftKey ? -1 : 1);
      return;
    }

    if (handleBuiltinEditorArrowNavigation(event, ctx)) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      if (open) {
        closeModal();
      }
      // Lookup은 Escape로 modal만 닫고 현재 셀의 편집 상태는 유지한다.
    }
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      ctx.tabNavigate?.(event.shiftKey ? -1 : 1);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      if (open) {
        closeModal();
      }
      // Lookup은 Escape로 modal만 닫고 현재 셀의 편집 상태는 유지한다.
    }
  };

  const triggerLabel =
    config.triggerAriaLabel ?? `${ctx.columnId} lookup`;

  const modal =
    open && config.mode === 'modal' ? config.renderModal(modalContext) : null;

  return (
    <>
      <div className="gen-datagrid__lookup-editor">
        <input
          ref={anchorRef}
          aria-label={`${ctx.columnId} editor`}
          autoFocus={config.allowCellEdit}
          className={[
            'gen-datagrid__editor',
            'gen-datagrid__editor--lookup',
            !config.allowCellEdit && 'gen-datagrid__editor--lookup-readonly',
          ]
            .filter(Boolean)
            .join(' ')}
          readOnly={!config.allowCellEdit}
          tabIndex={config.allowCellEdit ? undefined : -1}
          type="text"
          value={inputValue}
          onChange={(event) => {
            if (!config.allowCellEdit) return;
            ctx.setDraftValue(event.currentTarget.value);
          }}
          onBlur={handleBlur}
          onKeyDown={handleInputKeyDown}
        />
        <button
          ref={triggerRef}
          type="button"
          className="gen-datagrid__lookup-trigger"
          aria-label={triggerLabel}
          autoFocus={!config.allowCellEdit && !ctx.openLookupModal}
          onMouseDown={(event) => event.preventDefault()}
          onClick={openModal}
          onBlur={handleBlur}
          onKeyDown={handleTriggerKeyDown}
        >
          <Search aria-hidden="true" size={14} strokeWidth={2} />
        </button>
      </div>
      {modal}
    </>
  );
}

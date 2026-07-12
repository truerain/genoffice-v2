// packages/gen-datagrid/src/features/editing/renderEditor.tsx
// Renders built-in and custom cell editors for GenDataGrid.

import clsx from 'clsx';
import * as React from 'react';

import type {
  GenDataGridColumnMeta,
  GenDataGridEditorContext,
  GenDataGridEditorFactory,
} from '../../GenDataGrid.types';
import { createEditorBlurHandler } from './blurPolicy';
import { resolveEditorAriaLabel, normalizeEditorValue } from './builtinEditorAttrs';
import { handleBuiltinEditorKeyDown } from './builtinEditorKeyboard';
import { BuiltinTextEditor } from './builtinTextEditor';
import { LookupCellEditor } from './LookupCellEditor';
import { resolveEditLookupConfig } from './resolveEditLookup';
import { resolveSelectEditOptions } from './editValuePipeline';

function useOpenOnEditStart<TElement extends HTMLElement>(
  ref: React.RefObject<TElement | null>,
  enabled: boolean,
  open: (element: TElement) => void
) {
  React.useEffect(() => {
    if (!enabled) return;
    const element = ref.current;
    if (!element) return;

    const frame = window.requestAnimationFrame(() => {
      const current = ref.current;
      if (!current) return;
      open(current);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [enabled, open, ref]);
}

function DefaultCellEditor<TData>({ ctx }: { ctx: GenDataGridEditorContext<TData> }) {
  const selectRef = React.useRef<HTMLSelectElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const inputEditType = ctx.inputEditType ?? 'text';
  const ariaLabel = resolveEditorAriaLabel(ctx);

  const handleBlur = React.useMemo(
    () =>
      createEditorBlurHandler({
        blurOwnership: ctx.blurOwnership ?? 'inline',
        commitOnBlur: ctx.commitOnBlur,
        gridRoot: ctx.getGridRoot?.() ?? null,
        getEditorSurfaces: () => ctx.getEditorSurfaces?.() ?? [],
        commit: () => ctx.commit(),
      }),
    [ctx]
  );

  useOpenOnEditStart(selectRef, Boolean(ctx.openOnEditStart) && inputEditType === 'select', (element) => {
    element.focus();
    element.click();
  });

  useOpenOnEditStart(
    inputRef,
    Boolean(ctx.openOnEditStart) && inputEditType === 'date',
    (element) => {
      const pickerElement = element as HTMLInputElement & {
        showPicker?: () => void;
      };
      element.focus();
      if (typeof pickerElement.showPicker === 'function') {
        pickerElement.showPicker();
        return;
      }
      element.click();
    }
  );

  if (inputEditType === 'textarea') {
    return <BuiltinTextEditor ctx={ctx} as="textarea" />;
  }

  if (inputEditType === 'select') {
    const selectOptions = resolveSelectEditOptions(ctx.editOptions, {
      editEmptyOption: ctx.editEmptyOption,
      editSelectClearable: ctx.editSelectClearable,
    });

    return (
      <select
        ref={selectRef}
        aria-label={ariaLabel}
        autoFocus
        className={clsx('gen-datagrid__editor', ctx.editClassName)}
        value={String(normalizeEditorValue(ctx.draftValue))}
        onChange={(event) => ctx.setDraftValue(event.currentTarget.value)}
        onBlur={handleBlur}
        onKeyDown={(event) => handleBuiltinEditorKeyDown(event, ctx)}
      >
        {selectOptions.map((option) => (
          <option key={`${String(option.value)}:${option.label}`} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (inputEditType === 'checkbox') {
    return (
      <input
        aria-label={ariaLabel}
        autoFocus
        className={clsx('gen-datagrid__editor', ctx.editClassName)}
        type="checkbox"
        checked={Boolean(ctx.draftValue)}
        onChange={(event) => ctx.setDraftValue(event.currentTarget.checked)}
        onBlur={handleBlur}
        onKeyDown={(event) => handleBuiltinEditorKeyDown(event, ctx)}
      />
    );
  }

  return <BuiltinTextEditor ctx={ctx} inputRef={inputRef} />;
}

type RenderCellEditorArgs<TData> = {
  ctx: GenDataGridEditorContext<TData>;
  columnMeta?: GenDataGridColumnMeta<TData>;
  renderEditor?: (ctx: GenDataGridEditorContext<TData>) => React.ReactNode;
  editorFactory?: GenDataGridEditorFactory<TData>;
};

export function renderCellEditor<TData>({
  ctx,
  columnMeta,
  renderEditor,
  editorFactory,
}: RenderCellEditorArgs<TData>) {
  if (renderEditor) {
    return renderEditor(ctx);
  }

  if (editorFactory) {
    return editorFactory(ctx);
  }

  const lookupConfig = resolveEditLookupConfig(columnMeta);
  if (lookupConfig) {
    return <LookupCellEditor ctx={ctx} config={lookupConfig} />;
  }

  return <DefaultCellEditor ctx={ctx} />;
}

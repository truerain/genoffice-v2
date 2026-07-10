// packages/gen-datagrid/src/features/editing/renderEditor.tsx
// Renders built-in and custom cell editors for GenDataGrid.

import * as React from 'react';

import type {
  GenDataGridColumnMeta,
  GenDataGridEditorContext,
  GenDataGridEditorFactory,
} from '../../GenDataGrid.types';
import { createEditorBlurHandler } from './blurPolicy';
import { handleBuiltinEditorKeyDown } from './builtinEditorKeyboard';
import { LookupCellEditor } from './LookupCellEditor';
import { resolveEditLookupConfig } from './resolveEditLookup';

function normalizeEditorValue(value: unknown) {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return value;
  if (typeof value === 'boolean') return value;
  return String(value);
}

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
    return (
      <textarea
        aria-label={`${ctx.columnId} editor`}
        autoFocus
        className="gen-datagrid__editor gen-datagrid__editor--textarea"
        maxLength={ctx.editMaxLength}
        placeholder={ctx.placeholder}
        value={String(normalizeEditorValue(ctx.draftValue))}
        onFocus={(event) => {
          if (!ctx.selectOnFocus) return;
          event.currentTarget.select();
        }}
        onChange={(event) => ctx.setDraftValue(event.currentTarget.value)}
        onBlur={handleBlur}
        onKeyDown={(event) => handleBuiltinEditorKeyDown(event, ctx)}
      />
    );
  }

  if (inputEditType === 'select') {
    return (
      <select
        ref={selectRef}
        aria-label={`${ctx.columnId} editor`}
        autoFocus
        className="gen-datagrid__editor"
        value={String(normalizeEditorValue(ctx.draftValue))}
        onChange={(event) => ctx.setDraftValue(event.currentTarget.value)}
        onBlur={handleBlur}
        onKeyDown={(event) => handleBuiltinEditorKeyDown(event, ctx)}
      >
        {ctx.editOptions?.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (inputEditType === 'checkbox') {
    return (
      <input
        aria-label={`${ctx.columnId} editor`}
        autoFocus
        className="gen-datagrid__editor"
        type="checkbox"
        checked={Boolean(ctx.draftValue)}
        onChange={(event) => ctx.setDraftValue(event.currentTarget.checked)}
        onBlur={handleBlur}
        onKeyDown={(event) => handleBuiltinEditorKeyDown(event, ctx)}
      />
    );
  }

  return (
    <input
      ref={inputRef}
      aria-label={`${ctx.columnId} editor`}
      autoFocus
      autoCapitalize={ctx.editType === 'lowercaseText' ? 'off' : undefined}
      autoCorrect={ctx.editType === 'lowercaseText' ? 'off' : undefined}
      spellCheck={ctx.editType === 'lowercaseText' ? false : undefined}
      className="gen-datagrid__editor"
      maxLength={ctx.editMaxLength}
      placeholder={ctx.placeholder}
      type={inputEditType === 'number' || inputEditType === 'date' ? inputEditType : 'text'}
      value={String(normalizeEditorValue(ctx.draftValue))}
      onFocus={(event) => {
        if (!ctx.selectOnFocus) return;
        event.currentTarget.select();
      }}
      onChange={(event) => ctx.setDraftValue(event.currentTarget.value)}
      onBlur={handleBlur}
      onKeyDown={(event) => handleBuiltinEditorKeyDown(event, ctx)}
    />
  );
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

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
import { handleBuiltinEditorKeyDown } from './builtinEditorKeyboard';
import { LookupCellEditor } from './LookupCellEditor';
import { resolveEditLookupConfig } from './resolveEditLookup';
import { resolveSelectEditOptions } from './editValuePipeline';

function normalizeEditorValue(value: unknown) {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return value;
  if (typeof value === 'boolean') return value;
  return String(value);
}

function resolveEditorAriaLabel<TData>(ctx: GenDataGridEditorContext<TData>): string {
  return ctx.editAriaLabel ?? `${ctx.columnId} editor`;
}

function resolveAutoCapitalize<TData>(
  ctx: GenDataGridEditorContext<TData>
): 'off' | 'none' | 'sentences' | 'words' | 'characters' | undefined {
  if (ctx.editAutoCapitalize === false || ctx.editAutoCapitalize === 'off') {
    return 'off';
  }
  if (typeof ctx.editAutoCapitalize === 'string') {
    return ctx.editAutoCapitalize;
  }
  if (ctx.editAutoCapitalize === true) {
    return 'sentences';
  }
  if (ctx.editType === 'lowercaseText') {
    return 'off';
  }
  return undefined;
}

function resolveAutoCorrect<TData>(
  ctx: GenDataGridEditorContext<TData>
): 'on' | 'off' | undefined {
  if (ctx.editAutoCorrect === false) return 'off';
  if (ctx.editAutoCorrect === true) return 'on';
  if (ctx.editType === 'lowercaseText') return 'off';
  return undefined;
}

function resolveSpellCheck<TData>(ctx: GenDataGridEditorContext<TData>): boolean | undefined {
  if (ctx.editSpellCheck != null) return ctx.editSpellCheck;
  if (ctx.editType === 'lowercaseText') return false;
  return undefined;
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
    return (
      <textarea
        aria-label={ariaLabel}
        autoCapitalize={resolveAutoCapitalize(ctx)}
        autoCorrect={resolveAutoCorrect(ctx)}
        autoFocus
        className={clsx(
          'gen-datagrid__editor',
          'gen-datagrid__editor--textarea',
          ctx.editClassName
        )}
        cols={ctx.editCols}
        maxLength={ctx.editMaxLength}
        placeholder={ctx.placeholder}
        rows={ctx.editRows}
        spellCheck={resolveSpellCheck(ctx)}
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

  const htmlInputType =
    inputEditType === 'number' || inputEditType === 'date' ? inputEditType : 'text';
  const supportsRangeAttrs = htmlInputType === 'number' || htmlInputType === 'date';
  const supportsTextAttrs = htmlInputType === 'text' || htmlInputType === 'number';

  return (
    <input
      ref={inputRef}
      aria-label={ariaLabel}
      autoComplete={supportsTextAttrs ? ctx.editAutoComplete : undefined}
      autoCapitalize={supportsTextAttrs ? resolveAutoCapitalize(ctx) : undefined}
      autoCorrect={supportsTextAttrs ? resolveAutoCorrect(ctx) : undefined}
      autoFocus
      className={clsx('gen-datagrid__editor', ctx.editClassName)}
      inputMode={supportsTextAttrs ? ctx.editInputMode : undefined}
      max={supportsRangeAttrs ? ctx.editMax : undefined}
      maxLength={ctx.editMaxLength}
      min={supportsRangeAttrs ? ctx.editMin : undefined}
      placeholder={ctx.placeholder}
      spellCheck={supportsTextAttrs ? resolveSpellCheck(ctx) : undefined}
      step={htmlInputType === 'number' ? ctx.editStep : undefined}
      type={htmlInputType}
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

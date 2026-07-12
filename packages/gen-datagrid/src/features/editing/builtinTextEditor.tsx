/**
 * @file packages/gen-datagrid/src/features/editing/builtinTextEditor.tsx
 * @description Reusable built-in text/textarea editor factory for custom renderEditor (Gate 4.3-d).
 * @created 2026-07-12
 *
 * @remark
 * - `createBuiltinTextEditor()` returns a `GenDataGridEditorFactory` with Gate 4.1 keyboard/blur wired.
 * - Prefer column meta for constraints; use this factory when wrapping/augmenting the built-in DOM.
 * - `as: 'textarea'` follows textarea keyboard ownership (Enter = newline) when
 *   `ctx.editType` / `ctx.inputEditType` is textarea; set meta accordingly.
 */

import clsx from 'clsx';
import * as React from 'react';

import type {
  GenDataGridEditorContext,
  GenDataGridEditorFactory,
} from '../../GenDataGrid.types';
import { createEditorBlurHandler } from './blurPolicy';
import {
  normalizeEditorValue,
  resolveAutoCapitalize,
  resolveAutoCorrect,
  resolveEditorAriaLabel,
  resolveSpellCheck,
} from './builtinEditorAttrs';
import { handleBuiltinEditorKeyDown } from './builtinEditorKeyboard';

export type BuiltinTextEditorAs = 'input' | 'textarea';

export type CreateBuiltinTextEditorOptions = {
  /** Render `<input>` (default) or `<textarea>`. */
  as?: BuiltinTextEditorAs;
  /** Extra class merged onto `gen-datagrid__editor`. */
  className?: string;
  /**
   * Force HTML `input` type when `as: 'input'`.
   * Default: derive from `ctx.inputEditType` (`text` | `number` | `date`).
   */
  inputType?: 'text' | 'number' | 'date' | 'password' | 'email' | 'tel' | 'url' | 'search';
  autoFocus?: boolean;
};

/**
 * Shared blur + keydown handlers matching built-in DefaultCellEditor policy.
 */
export function useBuiltinEditorHandlers<TData>(ctx: GenDataGridEditorContext<TData>) {
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

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      handleBuiltinEditorKeyDown(event, ctx);
    },
    [ctx]
  );

  return { handleBlur, handleKeyDown };
}

type BuiltinTextEditorProps<TData> = CreateBuiltinTextEditorOptions & {
  ctx: GenDataGridEditorContext<TData>;
  inputRef?: React.Ref<HTMLInputElement>;
  textareaRef?: React.Ref<HTMLTextAreaElement>;
};

/**
 * Built-in text / textarea editor DOM with Gate 4.1 keyboard and blur ownership.
 */
export function BuiltinTextEditor<TData>({
  ctx,
  as = 'input',
  className,
  inputType,
  autoFocus = true,
  inputRef,
  textareaRef,
}: BuiltinTextEditorProps<TData>) {
  const { handleBlur, handleKeyDown } = useBuiltinEditorHandlers(ctx);
  const ariaLabel = resolveEditorAriaLabel(ctx);
  const inputEditType = ctx.inputEditType ?? 'text';

  if (as === 'textarea') {
    return (
      <textarea
        ref={textareaRef}
        aria-label={ariaLabel}
        autoCapitalize={resolveAutoCapitalize(ctx)}
        autoCorrect={resolveAutoCorrect(ctx)}
        autoFocus={autoFocus}
        className={clsx(
          'gen-datagrid__editor',
          'gen-datagrid__editor--textarea',
          ctx.editClassName,
          className
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
        onKeyDown={handleKeyDown}
      />
    );
  }

  const htmlInputType =
    inputType ??
    (inputEditType === 'number' || inputEditType === 'date' ? inputEditType : 'text');
  const supportsRangeAttrs = htmlInputType === 'number' || htmlInputType === 'date';
  const supportsTextAttrs = htmlInputType === 'text' || htmlInputType === 'number';

  return (
    <input
      ref={inputRef}
      aria-label={ariaLabel}
      autoComplete={supportsTextAttrs ? ctx.editAutoComplete : undefined}
      autoCapitalize={supportsTextAttrs ? resolveAutoCapitalize(ctx) : undefined}
      autoCorrect={supportsTextAttrs ? resolveAutoCorrect(ctx) : undefined}
      autoFocus={autoFocus}
      className={clsx('gen-datagrid__editor', ctx.editClassName, className)}
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
      onKeyDown={handleKeyDown}
    />
  );
}

/**
 * Factory for `meta.renderEditor` / `editorFactory` that reuses built-in text editing UX.
 *
 * @example
 * ```ts
 * meta: {
 *   editable: true,
 *   editType: 'text',
 *   renderEditor: createBuiltinTextEditor({ className: 'my-login-editor' }),
 * }
 * ```
 */
export function createBuiltinTextEditor<TData>(
  options?: CreateBuiltinTextEditorOptions
): GenDataGridEditorFactory<TData> {
  return (ctx) => (
    <BuiltinTextEditor
      ctx={ctx}
      as={options?.as}
      className={options?.className}
      inputType={options?.inputType}
      autoFocus={options?.autoFocus}
    />
  );
}

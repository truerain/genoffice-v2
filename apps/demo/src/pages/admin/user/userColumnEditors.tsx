/**
 * @file apps/demo/src/pages/admin/user/userColumnEditors.tsx
 * @description Custom GenDataGrid cell editors for User admin columns.
 * @created 2026-07-09
 *
 * @remark
 * - userColumns.ts는 JSX 없이 유지(Fast Refresh). editor만 이 파일에 둔다.
 */

import type * as React from 'react';
import type { GenDataGridEditorContext } from '@gen-office/gen-datagrid';
import { EMP_NO_MAX_LENGTH } from './user.types';

type TextEditorOptions = {
  maxLength?: number;
  normalize?: (value: string) => string;
};

function editorKeyDown<TData>(
  event: React.KeyboardEvent<HTMLElement>,
  ctx: GenDataGridEditorContext<TData>,
) {
  if (event.key === 'Tab') {
    event.preventDefault();
    ctx.tabNavigate?.(event.shiftKey ? -1 : 1);
    return;
  }

  if (
    (event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight') &&
    ctx.arrowNavigate
  ) {
    event.preventDefault();
    ctx.arrowNavigate(event.key);
    return;
  }

  if (event.key === 'Enter') {
    event.preventDefault();
    ctx.commit();
    return;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    ctx.cancel();
  }
}

function applyTextEditorValue(raw: string, options: TextEditorOptions) {
  let next = raw;
  if (options.normalize) next = options.normalize(next);
  if (options.maxLength != null) next = next.slice(0, options.maxLength);
  return next;
}

export function createTextEditor<TData>(options: TextEditorOptions = {}) {
  return function textEditor(ctx: GenDataGridEditorContext<TData>) {
    const value = ctx.draftValue == null ? '' : String(ctx.draftValue);

    return (
      <input
        aria-label={`${ctx.columnId} editor`}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        autoFocus
        className="gen-datagrid__editor"
        maxLength={options.maxLength}
        placeholder={ctx.placeholder}
        spellCheck={false}
        type="text"
        value={value}
        onFocus={(event) => {
          if (!ctx.selectOnFocus) return;
          event.currentTarget.select();
        }}
        onChange={(event) =>
          ctx.setDraftValue(applyTextEditorValue(event.target.value, options))
        }
        onBlur={() => {
          if (ctx.commitOnBlur !== false) ctx.commit();
        }}
        onKeyDown={(event) => editorKeyDown(event, ctx)}
      />
    );
  };
}

/** 소문자만 draft에 반영하는 text editor */
export const lowercaseTextEditor = createTextEditor({
  normalize: (value) => value.toLowerCase(),
});

/** 사번 — 최대 길이 제한 */
export const empNoEditor = createTextEditor({ maxLength: EMP_NO_MAX_LENGTH });

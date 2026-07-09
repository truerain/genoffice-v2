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

/** 소문자(a-z, 0-9, 기타 문자)만 draft에 반영하는 text editor */
export function lowercaseTextEditor<TData>(ctx: GenDataGridEditorContext<TData>) {
  const value = ctx.draftValue == null ? '' : String(ctx.draftValue);

  return (
    <input
      aria-label={`${ctx.columnId} editor`}
      autoCapitalize="off"
      autoComplete="off"
      autoCorrect="off"
      autoFocus
      className="gen-datagrid__editor"
      placeholder={ctx.placeholder}
      spellCheck={false}
      type="text"
      value={value}
      onFocus={(event) => {
        if (!ctx.selectOnFocus) return;
        event.currentTarget.select();
      }}
      onChange={(event) => ctx.setDraftValue(event.target.value.toLowerCase())}
      onBlur={() => {
        if (ctx.commitOnBlur !== false) ctx.commit();
      }}
      onKeyDown={(event) => editorKeyDown(event, ctx)}
    />
  );
}

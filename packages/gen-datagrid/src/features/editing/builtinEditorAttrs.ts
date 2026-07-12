/**
 * @file packages/gen-datagrid/src/features/editing/builtinEditorAttrs.ts
 * @description Shared HTML attribute resolution for built-in cell editors (Gate 4.3).
 * @created 2026-07-12
 *
 * @remark
 * Used by DefaultCellEditor and createBuiltinTextEditor so custom editors
 * can share the same aria / mobile / spellcheck meta mapping.
 */

import type { GenDataGridEditorContext } from '../../GenDataGrid.types';

export function normalizeEditorValue(value: unknown) {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return value;
  if (typeof value === 'boolean') return value;
  return String(value);
}

export function resolveEditorAriaLabel<TData>(ctx: GenDataGridEditorContext<TData>): string {
  return ctx.editAriaLabel ?? `${ctx.columnId} editor`;
}

export function resolveAutoCapitalize<TData>(
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

export function resolveAutoCorrect<TData>(
  ctx: GenDataGridEditorContext<TData>
): 'on' | 'off' | undefined {
  if (ctx.editAutoCorrect === false) return 'off';
  if (ctx.editAutoCorrect === true) return 'on';
  if (ctx.editType === 'lowercaseText') return 'off';
  return undefined;
}

export function resolveSpellCheck<TData>(ctx: GenDataGridEditorContext<TData>): boolean | undefined {
  if (ctx.editSpellCheck != null) return ctx.editSpellCheck;
  if (ctx.editType === 'lowercaseText') return false;
  return undefined;
}

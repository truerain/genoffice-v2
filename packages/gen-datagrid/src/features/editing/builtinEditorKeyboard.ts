// packages/gen-datagrid/src/features/editing/builtinEditorKeyboard.ts
// Resolves Gate 4.1-c built-in editor keyboard ownership for default editors.

import type * as React from 'react';

import type {
  GenDataGridBuiltinEditType,
  GenDataGridEditType,
  GenDataGridEditorContext,
} from '../../GenDataGrid.types';

function isTextareaEditType(
  editType?: GenDataGridEditType,
  inputEditType?: GenDataGridBuiltinEditType
) {
  return editType === 'textarea' || inputEditType === 'textarea';
}

function isSelectEditType(
  editType?: GenDataGridEditType,
  inputEditType?: GenDataGridBuiltinEditType
) {
  return editType === 'select' || inputEditType === 'select';
}

export function delegatesArrowKeysToGrid(
  editType?: GenDataGridEditType,
  inputEditType?: GenDataGridBuiltinEditType
) {
  return !isTextareaEditType(editType, inputEditType) && !isSelectEditType(editType, inputEditType);
}

export function handleBuiltinEditorArrowNavigation<TData>(
  event: React.KeyboardEvent<HTMLElement>,
  ctx: GenDataGridEditorContext<TData>
) {
  if (
    event.key !== 'ArrowUp' &&
    event.key !== 'ArrowDown' &&
    event.key !== 'ArrowLeft' &&
    event.key !== 'ArrowRight'
  ) {
    return false;
  }

  if (!delegatesArrowKeysToGrid(ctx.editType, ctx.inputEditType) || !ctx.arrowNavigate) {
    return false;
  }

  event.preventDefault();
  ctx.arrowNavigate(event.key);
  return true;
}

export function handleBuiltinEditorKeyDown<TData>(
  event: React.KeyboardEvent<HTMLElement>,
  ctx: GenDataGridEditorContext<TData>
) {
  if (event.key === 'Tab') {
    event.preventDefault();
    ctx.tabNavigate?.(event.shiftKey ? -1 : 1);
    return;
  }

  if (handleBuiltinEditorArrowNavigation(event, ctx)) {
    return;
  }

  if (event.key === 'Enter' && !isTextareaEditType(ctx.editType, ctx.inputEditType)) {
    event.preventDefault();
    ctx.commit();
    return;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    ctx.cancel();
  }
}

// packages/gen-datagrid/src/features/editing/editorContext.ts
// Builds the shared editor context passed to custom and fallback editors.

import type {
  GenDataGridEditableContext,
  GenDataGridEditBlurOwnership,
  GenDataGridEditEntryReason,
  GenDataGridEditOption,
  GenDataGridBuiltinEditType,
  GenDataGridEditorContext,
  GenDataGridEditType,
  GenDataGridRowPatch,
} from '../../GenDataGrid.types';

type CreateEditorContextArgs<TData> = {
  editableContext: GenDataGridEditableContext<TData>;
  draftValue: unknown;
  setDraftValue: (nextValue: unknown) => void;
  commit: (nextValue?: unknown) => void;
  commitAndKeepEditing: (nextValue?: unknown) => void;
  applyRowPatch: (
    patch: GenDataGridRowPatch,
    options?: { keepEditing?: boolean }
  ) => void;
  cancel: () => void;
  editType?: GenDataGridEditType;
  inputEditType?: GenDataGridBuiltinEditType;
  editMaxLength?: number;
  editTrimOnCommit?: boolean;
  editOptions?: readonly GenDataGridEditOption[];
  placeholder?: string;
  selectOnFocus?: boolean;
  commitOnBlur?: boolean;
  tabNavigate?: (direction: 1 | -1) => void;
  arrowNavigate?: (key: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => void;
  openOnEditStart?: boolean;
  editEntryReason?: GenDataGridEditEntryReason;
  blurOwnership?: GenDataGridEditBlurOwnership;
  openLookupModal?: boolean;
  registerEditorSurface?: (element: HTMLElement) => void;
  unregisterEditorSurface?: (element: HTMLElement) => void;
  getGridRoot?: () => HTMLElement | null;
  getEditorSurfaces?: () => Iterable<HTMLElement>;
};

export function createEditorContext<TData>({
  editableContext,
  draftValue,
  setDraftValue,
  commit,
  commitAndKeepEditing,
  applyRowPatch,
  cancel,
  editType,
  inputEditType,
  editMaxLength,
  editTrimOnCommit,
  editOptions,
  placeholder,
  selectOnFocus,
  commitOnBlur,
  tabNavigate,
  arrowNavigate,
  openOnEditStart,
  editEntryReason,
  blurOwnership,
  openLookupModal,
  registerEditorSurface,
  unregisterEditorSurface,
  getGridRoot,
  getEditorSurfaces,
}: CreateEditorContextArgs<TData>): GenDataGridEditorContext<TData> {
  return {
    ...editableContext,
    draftValue,
    setDraftValue,
    commit,
    commitAndKeepEditing,
    applyRowPatch,
    cancel,
    applyValue: (nextValue) => {
      setDraftValue(nextValue);
      commit(nextValue);
    },
    editType,
    inputEditType,
    editMaxLength,
    editTrimOnCommit,
    editOptions,
    placeholder,
    selectOnFocus,
    commitOnBlur,
    tabNavigate,
    arrowNavigate,
    openOnEditStart,
    editEntryReason,
    blurOwnership,
    openLookupModal,
    registerEditorSurface,
    unregisterEditorSurface,
    getGridRoot,
    getEditorSurfaces,
  };
}

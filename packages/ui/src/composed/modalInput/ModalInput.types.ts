/**
 * @file packages/ui/src/composed/modalInput/ModalInput.types.ts
 * @description Public props and selection types for ModalInput.
 * @created 2026-06-25
 * @updated 2026-07-12
 *
 * @remark
 * - Exports: ModalInputSelection, ModalInputListColumn, ModalInputProps
 * - mode discriminated union: single | multi
 * - multi: selectedTooltip 'auto' — 2+ 선택 시 tooltip (modal open 중 비활성)
 * - hideTrigger: dialog-only for grid lookup renderModal shells
 */
import type { ReactNode, Ref } from 'react';

export type ModalInputSelectedTooltip = boolean | 'auto';

export type ModalInputSelection<TData = unknown> = {
  value: string;
  label: string;
  description?: string;
  data?: TData;
  disabled?: boolean;
  keywords?: string[];
};

export type ModalInputListColumn<TData = unknown> = {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render: (item: ModalInputSelection<TData>) => ReactNode;
};

type ModalInputBaseProps<TData = unknown> = {
  items?: ModalInputSelection<TData>[];
  fetchItems?: (keyword: string) => Promise<ModalInputSelection<TData>[]>;
  searchOnInputChange?: boolean;
  title?: string;
  modalDescription?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  clearSearchOnOpen?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  openOnInputFocus?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** When true, hide the field trigger and render the dialog only (grid lookup portals). */
  hideTrigger?: boolean;
  /** Initial modal search box value (e.g. cell draft keyword). */
  defaultSearchValue?: string;
  /** single: commit immediately on list item click (skip Confirm). */
  commitOnItemClick?: boolean;
  /** Dialog header drag. Default true. */
  draggable?: boolean;
  /** Forward DialogContent element (grid editor surface registration). */
  dialogContentRef?: Ref<HTMLDivElement | null>;
  triggerAriaLabel?: string;
  triggerIcon?: ReactNode;
  label?: string;
  helperText?: string;
  error?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  clearable?: boolean;
  clearLabel?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  confirmOnDoubleClick?: boolean;
  autoFocusSearch?: boolean;
  modalWidth?: number | string;
  /**
   * Fixed dialog height (not content-driven). List area scrolls inside.
   * Applied as `height: min(value, 85vh)` on DialogContent.
   */
  modalHeight?: number | string;
  listColumns?: ModalInputListColumn<TData>[];
  className?: string;
  inputClassName?: string;
  dialogClassName?: string;
  listClassName?: string;
  formatDisplayValue?: (
    selectedItems: ModalInputSelection<TData>[],
    mode: 'single' | 'multi'
  ) => string;
};

export type SingleModalInputProps<TData = unknown> = ModalInputBaseProps<TData> & {
  mode: 'single';
  selectedItem?: ModalInputSelection<TData> | null;
  onSelectedItemChange?: (selectedItem: ModalInputSelection<TData> | null) => void;
  onCommit?: (selectedItem: ModalInputSelection<TData> | null) => void;
};

export type MultiModalInputProps<TData = unknown> = ModalInputBaseProps<TData> & {
  mode: 'multi';
  selectedItems?: ModalInputSelection<TData>[];
  onSelectedItemsChange?: (selectedItems: ModalInputSelection<TData>[]) => void;
  onCommit?: (selectedItems: ModalInputSelection<TData>[]) => void;
  selectedTooltip?: ModalInputSelectedTooltip;
  formatSelectedTooltip?: (selectedItems: ModalInputSelection<TData>[]) => ReactNode;
};

export type ModalInputProps<TData = unknown> =
  | SingleModalInputProps<TData>
  | MultiModalInputProps<TData>;

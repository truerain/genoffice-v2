/**
 * @file packages/ui/src/composed/treeCombobox/TreeCombobox.types.ts
 * @description Public props for TreeCombobox.
 * @created 2026-06-25
 *
 * @remark
 * - Exports: TreeComboboxId, TreeComboboxOption, TreeComboboxProps
 * - options: flat list with id / parentId (not nested children[])
 */
export type TreeComboboxId = string | number;

export interface TreeComboboxOption {
  id: TreeComboboxId;
  parentId?: TreeComboboxId | null;
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

export interface TreeComboboxProps {
  options: TreeComboboxOption[];
  value?: string;
  onValueChange?: (value: string, option: TreeComboboxOption | null) => void;
  inputValue?: string;
  onInputValueChange?: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  clearLabel?: string;
  onClear?: () => void;
  fullWidth?: boolean;
  className?: string;
  inputClassName?: string;
  listClassName?: string;
  openOnFocus?: boolean;
  filterOptions?: (option: TreeComboboxOption, inputValue: string) => boolean;
  id?: string;
  maxVisibleItems?: number;
  optionItemHeight?: number;
  indent?: number;
  expandedIds?: readonly TreeComboboxId[];
  defaultExpandedIds?: readonly TreeComboboxId[];
  onExpandedIdsChange?: (next: TreeComboboxId[]) => void;
}

/**
 * @file packages/ui/src/composed/comboBox/Combobox.types.ts
 * @description Public props for Combobox.
 * @created 2026-06-25
 *
 * @remark
 * - Exports: ComboboxOption, ComboboxProps
 * - option.group renders list separator (not Radix Select groups)
 */
export interface ComboboxOption {
  value: string;
  label: string;
  group?: string;
  disabled?: boolean;
  description?: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string, option: ComboboxOption | null) => void;
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
  filterOptions?: (option: ComboboxOption, inputValue: string) => boolean;
  id?: string;
  maxVisibleItems?: number;
  optionItemHeight?: number;
}

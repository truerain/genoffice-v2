/**
 * @file packages/ui/src/composed/comboBox/MultiCombobox.types.ts
 * @description Public props for MultiCombobox.
 * @created 2026-06-25
 *
 * @remark
 * - Exports: MultiComboboxProps
 * - values: string[]; reuses ComboboxOption from Combobox.types
 * - selectedTooltip: 'auto' shows tooltip when 2+ items selected (default)
 */
import type { ReactNode } from 'react';
import type { ComboboxOption } from './Combobox.types';

export type MultiComboboxSelectedTooltip = boolean | 'auto';

export interface MultiComboboxProps {
  options: ComboboxOption[];
  values?: string[];
  onValuesChange?: (values: string[], options: ComboboxOption[]) => void;
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
  formatDisplayValue?: (selectedOptions: ComboboxOption[]) => string;
  /** Show full selection list in tooltip. `auto` = when 2+ items (default). */
  selectedTooltip?: MultiComboboxSelectedTooltip;
  formatSelectedTooltip?: (selectedOptions: ComboboxOption[]) => ReactNode;
}

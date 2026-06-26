/**
 * @file packages/ui/src/composed/datePicker/RangeMonthPicker.types.ts
 * @description Public props for RangeMonthPicker.
 * @created 2026-06-25
 */
export type MonthRange = {
  from?: Date;
  to?: Date;
};

export interface RangeMonthPickerProps {
  value?: MonthRange;
  onChange?: (range?: MonthRange) => void;
  fromMonth?: Date;
  toMonth?: Date;
  placeholder?: string;
  disabled?: boolean;
  align?: 'start' | 'center' | 'end';
  locale?: string;
  format?: (date: Date) => string;
  clearable?: boolean;
  /** Stretch anchor to parent width (e.g. FilterBar grid cell) @default false */
  fullWidth?: boolean;
  className?: string;
}

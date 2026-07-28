/**
 * @file packages/ui/src/composed/datePicker/MultiMonthPicker.types.ts
 * @description Public props for MultiMonthPicker (non-contiguous multi-month selection).
 * @created 2026-07-29
 *
 * @remark
 * - value: Date[] with day=1; empty commit yields onChange(undefined)
 * - visibleYears 1|2 for dual year panels
 */

export interface MultiMonthPickerProps {
  value?: Date[];
  onChange?: (months?: Date[]) => void;
  fromMonth?: Date;
  toMonth?: Date;
  placeholder?: string;
  disabled?: boolean;
  align?: 'start' | 'center' | 'end';
  locale?: string;
  format?: (date: Date) => string;
  /** When selection count exceeds this, the field shows `{first} +{n} more`. Default: 2. */
  summaryThreshold?: number;
  /** Custom overflow label when count exceeds summaryThreshold. */
  formatSummary?: (firstLabel: string, restCount: number) => string;
  /** When true, shows a clear button in the popover. Default: true. */
  clearable?: boolean;
  /** Number of year panels in the popover. Default: 1. */
  visibleYears?: 1 | 2;
  /** Stretch anchor to parent width (e.g. FilterBar grid cell) @default false */
  fullWidth?: boolean;
  className?: string;
}

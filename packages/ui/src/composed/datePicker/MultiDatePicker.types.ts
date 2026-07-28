/**
 * @file packages/ui/src/composed/datePicker/MultiDatePicker.types.ts
 * @description Public props for MultiDatePicker (non-contiguous multi-date selection).
 * @created 2026-07-29
 *
 * @remark
 * - value: Date[]?; empty commit yields onChange(undefined)
 * - summaryThreshold default 2; formatSummary overrides overflow label
 */

import type { CalendarProps } from '../../core/calendar';

export interface MultiDatePickerProps {
  value?: Date[];
  onChange?: (dates?: Date[]) => void;
  placeholder?: string;
  disabled?: boolean;
  align?: 'start' | 'center' | 'end';
  locale?: string;
  format?: (date: Date) => string;
  formatOptions?: Intl.DateTimeFormatOptions;
  /** When selection count exceeds this, the field shows `{first} +{n} more`. Default: 2. */
  summaryThreshold?: number;
  /** Custom overflow label when count exceeds summaryThreshold. */
  formatSummary?: (firstLabel: string, restCount: number) => string;
  /** When true, shows a clear button in the popover. Default: true. */
  clearable?: boolean;
  /** Stretch anchor to parent width (e.g. FilterBar grid cell) @default false */
  fullWidth?: boolean;
  calendarProps?: Omit<CalendarProps, 'mode' | 'selected' | 'onSelect'>;
  className?: string;
}

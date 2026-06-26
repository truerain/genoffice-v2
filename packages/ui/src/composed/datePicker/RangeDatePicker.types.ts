/**
 * @file packages/ui/src/composed/datePicker/RangeDatePicker.types.ts
 * @description Public props for RangeDatePicker.
 * @created 2026-06-25
 */
import type { CalendarProps } from '../../core/calendar';

export type DateRange = {
  from?: Date;
  to?: Date;
};

export interface RangeDatePickerProps {
  value?: DateRange;
  onChange?: (range?: DateRange) => void;
  placeholder?: string;
  disabled?: boolean;
  align?: 'start' | 'center' | 'end';
  locale?: string;
  format?: (date: Date) => string;
  formatOptions?: Intl.DateTimeFormatOptions;
  clearable?: boolean;
  calendarProps?: Omit<CalendarProps, 'mode' | 'selected' | 'onSelect'>;
  className?: string;
}

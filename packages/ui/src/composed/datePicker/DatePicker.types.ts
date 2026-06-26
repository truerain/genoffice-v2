/**
 * @file packages/ui/src/composed/datePicker/DatePicker.types.ts
 * @description Public props for DatePicker.
 * @created 2026-06-25
 */
import type { DateYmdSeparator } from '@gen-office/utils';
import type { CalendarProps } from '../../core/calendar';

export interface DatePickerProps {
  value?: Date;
  onChange?: (date?: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  align?: 'start' | 'center' | 'end';
  locale?: string;
  format?: (date: Date) => string;
  /** Mask + parse separator @default '-' */
  separator?: DateYmdSeparator;
  parse?: (value: string) => Date | undefined;
  clearable?: boolean;
  /** Stretch anchor to parent width (e.g. FilterBar grid cell) @default false */
  fullWidth?: boolean;
  calendarProps?: Omit<CalendarProps, 'mode' | 'selected' | 'onSelect'>;
  className?: string;
}

/**
 * @file packages/ui/src/composed/datePicker/MonthPicker.types.ts
 * @description Public props for MonthPicker.
 * @created 2026-06-25
 */
import type { DateYmdSeparator } from '@gen-office/utils';

export interface MonthPickerProps {
  value?: Date;
  onChange?: (date?: Date) => void;
  fromMonth?: Date;
  toMonth?: Date;
  placeholder?: string;
  disabled?: boolean;
  align?: 'start' | 'center' | 'end';
  locale?: string;
  format?: (date: Date) => string;
  /** Mask separator @default '-' */
  separator?: DateYmdSeparator;
  clearable?: boolean;
  parse?: (value: string) => Date | undefined;
  className?: string;
  editorOverlay?: boolean;
}

/**
 * @file packages/ui/src/composed/datePicker/DatePicker.tsx
 * @description Single-date picker — MaskedInput (ymd) + Popover + Calendar.
 * @created 2026-06-25
 *
 * @remark
 * - value: Date?; typed commit via parseDateString / custom parse
 * - Calendar trigger lives in MaskedInput suffix (no split .field chrome)
 */
import { useCallback, useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { clsx } from 'clsx';
import { type CalendarProps, Calendar } from '../../core/calendar';
import { MaskedInput } from '../../core/maskedInput';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '../../core/popover';
import type { DateYmdSeparator } from '@gen-office/utils';
import { CalendarTrigger } from './CalendarTrigger';
import type { DatePickerProps } from './DatePicker.types';
import {
  DEFAULT_DATE_SEPARATOR,
  formatDateForYmdMask,
  parseYmdDisplay,
} from './datePickerUtils';
import styles from './DatePicker.module.css';

export function DatePicker({
  value,
  onChange,
  placeholder = 'yyyy-mm-dd',
  disabled,
  align = 'start',
  locale,
  format,
  separator = DEFAULT_DATE_SEPARATOR,
  clearable = false,
  fullWidth = false,
  parse,
  calendarProps,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState<Date | undefined>(value);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());

  const formattedValue = useMemo(
    () => (value ? formatDateForYmdMask(value, separator as DateYmdSeparator, format) : ''),
    [value, format, separator]
  );

  const syncDraftFromDisplay = useCallback((): Date | undefined => {
    return parseYmdDisplay(display, separator as DateYmdSeparator, parse);
  }, [display, separator, parse]);

  const applyDraft = useCallback(
    (nextDraft: Date | undefined) => {
      setDraftValue(nextDraft);
      if (nextDraft) {
        setCalendarMonth(new Date(nextDraft.getFullYear(), nextDraft.getMonth(), 1));
      }
    },
    []
  );

  useEffect(() => {
    if (!isEditing) setDisplay(formattedValue);
  }, [formattedValue, isEditing]);

  useEffect(() => {
    if (!open) return;
    const parsed = syncDraftFromDisplay();
    if (parsed) applyDraft(parsed);
  }, [open, syncDraftFromDisplay, applyDraft]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      const parsed = syncDraftFromDisplay();
      applyDraft(parsed ?? value);
    }
  };

  const commitDisplay = () => {
    if (!display.trim()) {
      onChange?.(undefined);
      return true;
    }

    const parsed = parseYmdDisplay(display, separator as DateYmdSeparator, parse);
    if (parsed && !Number.isNaN(parsed.getTime())) {
      onChange?.(parsed);
      return true;
    }

    return false;
  };

  const handleSelect = (next: Date | undefined) => {
    const nextValue = next ?? undefined;
    applyDraft(nextValue);
    onChange?.(nextValue);
    setIsEditing(false);
    setDisplay(nextValue ? formatDateForYmdMask(nextValue, separator as DateYmdSeparator, format) : '');
    setOpen(false);
  };

  const selectedValue = open ? draftValue : value;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverAnchor asChild>
        <div className={clsx(styles.anchor, fullWidth && styles.anchorFullWidth)}>
          <MaskedInput
            mask={{ preset: 'ymd', separator }}
            value={display}
            onChange={(next) => {
              setDisplay(next);
              setIsEditing(true);
              if (!next) onChange?.(undefined);
            }}
            onComplete={(next) => {
              const parsed = parseYmdDisplay(next, separator as DateYmdSeparator, parse);
              if (parsed) applyDraft(parsed);
            }}
            placeholder={placeholder}
            disabled={disabled}
            autoSelect={false}
            fullWidth
            clearable={clearable}
            onClear={() => {
              setDisplay('');
              setIsEditing(false);
              onChange?.(undefined);
            }}
            onFocus={() => setIsEditing(true)}
            onBlur={() => {
              setIsEditing(false);
              const committed = commitDisplay();
              if (!committed) setDisplay(formattedValue);
            }}
            onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
              if (event.key !== 'Enter') return;
              const committed = commitDisplay();
              if (committed) setOpen(false);
            }}
            suffix={
              <PopoverTrigger asChild>
                <CalendarTrigger aria-label="Open calendar" disabled={disabled} />
              </PopoverTrigger>
            }
          />
        </div>
      </PopoverAnchor>
      <PopoverContent align={align} className={className} data-date-picker-popover="true">
        <div className={styles.content}>
          <Calendar
            mode="single"
            locale={locale as CalendarProps['locale']}
            {...calendarProps}
            selected={selectedValue}
            onSelect={handleSelect}
            month={calendarMonth}
            onMonthChange={setCalendarMonth}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

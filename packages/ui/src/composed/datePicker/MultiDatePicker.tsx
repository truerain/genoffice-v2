/**
 * @file packages/ui/src/composed/datePicker/MultiDatePicker.tsx
 * @description Multi-select date picker — readOnly Input + Popover + Calendar multiple.
 * @created 2026-07-29
 *
 * @remark
 * - Draft selection until Confirm; Clear resets draft
 * - Chrome matches RangeDatePicker (Input + CalendarTrigger, no V1 .field)
 */

import { useEffect, useMemo, useState } from 'react';
import { Check, X } from 'lucide-react';
import { clsx } from 'clsx';
import type { PropsMulti } from '@daypicker/react';
import { Button } from '../../core/button';
import { type CalendarProps, Calendar } from '../../core/calendar';
import { Input } from '../../core/input';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '../../core/popover';
import { CalendarTrigger } from './CalendarTrigger';
import type { MultiDatePickerProps } from './MultiDatePicker.types';
import { datesSignature, normalizeDates } from './datePickerUtils';
import { formatMultiSelectionDisplay } from './multiSelectionDisplay';
import styles from './DatePicker.module.css';

const defaultFormatter = (date: Date, locale?: string, options?: Intl.DateTimeFormatOptions) => {
  const formatter = new Intl.DateTimeFormat(locale || undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options,
  });
  return formatter.format(date);
};

export function MultiDatePicker({
  value,
  onChange,
  placeholder = 'Select dates',
  disabled,
  align = 'start',
  locale,
  format,
  formatOptions,
  summaryThreshold,
  formatSummary,
  clearable = true,
  fullWidth = false,
  calendarProps,
  className,
}: MultiDatePickerProps) {
  const [open, setOpen] = useState(false);
  const valueSignature = datesSignature(value);
  const normalizedValue = useMemo(() => normalizeDates(value), [valueSignature]);
  const [draftValue, setDraftValue] = useState<Date[]>(normalizedValue);

  useEffect(() => {
    if (open) setDraftValue(normalizedValue);
  }, [open, normalizedValue]);

  const handleSelect: PropsMulti['onSelect'] = (next) => {
    setDraftValue(normalizeDates(next));
  };

  const handleClear = () => {
    setDraftValue([]);
  };

  const selectedValue = open ? draftValue : normalizedValue;
  const { label, title } = useMemo(() => {
    const formatItem = (date: Date) =>
      format ? format(date) : defaultFormatter(date, locale, formatOptions);
    return formatMultiSelectionDisplay(selectedValue, {
      summaryThreshold,
      formatItem,
      formatSummary,
    });
  }, [selectedValue, locale, format, formatOptions, summaryThreshold, formatSummary]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className={clsx(styles.anchor, fullWidth && styles.anchorFullWidth)}>
          <Input
            value={label}
            title={title}
            placeholder={placeholder}
            disabled={disabled}
            readOnly
            autoSelect={false}
            fullWidth
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            suffix={
              <PopoverTrigger asChild>
                <CalendarTrigger aria-label="Open multi date picker" disabled={disabled} />
              </PopoverTrigger>
            }
          />
        </div>
      </PopoverAnchor>
      <PopoverContent align={align} className={className}>
        <div className={styles.content}>
          <Calendar
            mode="multiple"
            selected={selectedValue}
            onSelect={handleSelect}
            locale={locale as CalendarProps['locale']}
            {...calendarProps}
          />
          <div className={styles.monthActions}>
            {clearable ? (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="Clear dates"
                onClick={handleClear}
                disabled={draftValue.length === 0}
              >
                <X className={styles.monthActionIcon} />
              </Button>
            ) : null}
            <Button
              type="button"
              size="icon"
              variant="primary"
              aria-label="Confirm dates"
              onClick={() => {
                const next = normalizeDates(draftValue);
                onChange?.(next.length ? next : undefined);
                setOpen(false);
              }}
            >
              <Check className={styles.monthActionIcon} />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

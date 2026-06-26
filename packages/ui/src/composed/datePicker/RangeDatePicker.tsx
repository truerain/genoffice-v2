/**
 * @file packages/ui/src/composed/datePicker/RangeDatePicker.tsx
 * @description Date range picker — readOnly Input + Popover + range Calendar.
 * @created 2026-06-25
 */
import { useEffect, useMemo, useState } from 'react';
import { Check, X } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '../../core/button';
import { type CalendarProps, Calendar } from '../../core/calendar';
import { Input } from '../../core/input';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '../../core/popover';
import { CalendarTrigger } from './CalendarTrigger';
import type { DateRange, RangeDatePickerProps } from './RangeDatePicker.types';
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

function formatRangeLabel(
  range: DateRange | undefined,
  locale?: string,
  format?: (date: Date) => string,
  formatOptions?: Intl.DateTimeFormatOptions
) {
  if (!range?.from && !range?.to) return '';
  const formatDate = (date: Date) =>
    format ? format(date) : defaultFormatter(date, locale, formatOptions);
  if (range.from && range.to) return `${formatDate(range.from)} ~ ${formatDate(range.to)}`;
  if (range.from) return `${formatDate(range.from)} ~`;
  return '';
}

export function RangeDatePicker({
  value,
  onChange,
  placeholder = 'Select date range',
  disabled,
  align = 'start',
  locale,
  format,
  formatOptions,
  clearable = true,
  fullWidth = false,
  calendarProps,
  className,
}: RangeDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [draftValue, setDraftValue] = useState<DateRange | undefined>(value);

  useEffect(() => {
    if (open) setDraftValue(value);
  }, [open, value]);

  const handleSelect = (next: DateRange | undefined) => {
    setDraftValue(next ?? undefined);
  };

  const handleClear = () => {
    setDraftValue(undefined);
  };

  const selectedValue = open ? draftValue : value;
  const label = useMemo(
    () => formatRangeLabel(selectedValue, locale, format, formatOptions),
    [selectedValue, locale, format, formatOptions]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className={clsx(styles.anchor, fullWidth && styles.anchorFullWidth)}>
          <Input
            value={label}
            placeholder={placeholder}
            disabled={disabled}
            readOnly
            autoSelect={false}
            fullWidth
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            suffix={
              <PopoverTrigger asChild>
                <CalendarTrigger aria-label="Open range calendar" disabled={disabled} />
              </PopoverTrigger>
            }
          />
        </div>
      </PopoverAnchor>
      <PopoverContent align={align} className={className}>
        <div className={styles.content}>
          <Calendar
            mode="range"
            selected={selectedValue}
            onSelect={handleSelect}
            locale={locale as CalendarProps['locale']}
            {...calendarProps}
          />
          <div className={styles.monthActions}>
            {clearable && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="Clear range"
                onClick={handleClear}
                disabled={!draftValue?.from}
              >
                <X className={styles.monthActionIcon} />
              </Button>
            )}
            <Button
              type="button"
              size="icon"
              variant="primary"
              aria-label="Confirm range"
              onClick={() => {
                onChange?.(draftValue);
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

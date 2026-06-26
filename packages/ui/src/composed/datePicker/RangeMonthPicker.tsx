/**
 * @file packages/ui/src/composed/datePicker/RangeMonthPicker.tsx
 * @description Month range picker — readOnly Input + Popover + month range grid.
 * @created 2026-06-25
 */
import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '../../core/button';
import { Input } from '../../core/input';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '../../core/popover';
import { CalendarTrigger } from './CalendarTrigger';
import type { MonthRange, RangeMonthPickerProps } from './RangeMonthPicker.types';
import { monthKey, normalizeMonth } from './datePickerUtils';
import styles from './DatePicker.module.css';

const defaultFormatter = (date: Date, locale?: string) => {
  const formatter = new Intl.DateTimeFormat(locale || undefined, {
    year: 'numeric',
    month: '2-digit',
  });
  return formatter.format(date);
};

const monthLabelFormatter = (month: number, locale?: string) =>
  new Intl.DateTimeFormat(locale || undefined, { month: 'short' }).format(new Date(2000, month, 1));

const normalizeRange = (range?: MonthRange): MonthRange | undefined => {
  if (!range?.from && !range?.to) return undefined;
  const from = normalizeMonth(range.from);
  const to = normalizeMonth(range.to);
  if (!from && !to) return undefined;
  if (from && to && monthKey(from) > monthKey(to)) {
    return { from: to, to: from };
  }
  return { from, to };
};

const formatRangeLabel = (range: MonthRange | undefined, locale?: string, format?: (date: Date) => string) => {
  if (!range?.from && !range?.to) return '';
  const formatDate = (date: Date) => (format ? format(date) : defaultFormatter(date, locale));
  if (range.from && range.to) return `${formatDate(range.from)} ~ ${formatDate(range.to)}`;
  if (range.from) return `${formatDate(range.from)} ~`;
  return '';
};

export function RangeMonthPicker({
  value,
  onChange,
  fromMonth,
  toMonth,
  placeholder = 'Select month range',
  disabled,
  align = 'start',
  locale,
  format,
  clearable = true,
  className,
}: RangeMonthPickerProps) {
  const [open, setOpen] = useState(false);
  const normalizedFromMonth = useMemo(() => normalizeMonth(fromMonth), [fromMonth]);
  const normalizedToMonth = useMemo(() => normalizeMonth(toMonth), [toMonth]);
  const normalizedValue = useMemo(
    () => normalizeRange(value),
    [value?.from?.getTime(), value?.to?.getTime()]
  );
  const [displayYear, setDisplayYear] = useState(
    () => normalizedValue?.from?.getFullYear() ?? new Date().getFullYear()
  );
  const [draftValue, setDraftValue] = useState<MonthRange | undefined>(normalizedValue);

  const isWithinRange = (date?: Date) => {
    if (!date) return true;
    const key = monthKey(date);
    if (normalizedFromMonth && key < monthKey(normalizedFromMonth)) return false;
    if (normalizedToMonth && key > monthKey(normalizedToMonth)) return false;
    return true;
  };

  const minYear = normalizedFromMonth?.getFullYear();
  const maxYear = normalizedToMonth?.getFullYear();

  useEffect(() => {
    if (open) {
      setDraftValue(normalizedValue);
      const fallbackYear = new Date().getFullYear();
      const baseYear = normalizedValue?.from?.getFullYear() ?? fallbackYear;
      const boundedYear =
        minYear !== undefined && baseYear < minYear
          ? minYear
          : maxYear !== undefined && baseYear > maxYear
            ? maxYear
            : baseYear;
      setDisplayYear(boundedYear);
    }
  }, [maxYear, minYear, normalizedValue, open]);

  const selectedValue = open ? draftValue : normalizedValue;

  const label = useMemo(() => formatRangeLabel(selectedValue, locale, format), [selectedValue, locale, format]);

  const canGoPrevYear = minYear === undefined || displayYear > minYear;
  const canGoNextYear = maxYear === undefined || displayYear < maxYear;

  const monthState = (month: number) => {
    const candidate = new Date(displayYear, month, 1);
    if (!selectedValue?.from) return { selected: false, inRange: false };

    const startKey = monthKey(selectedValue.from);
    const endKey = monthKey(selectedValue.to ?? selectedValue.from);
    const currentKey = monthKey(candidate);
    const inRange = currentKey >= Math.min(startKey, endKey) && currentKey <= Math.max(startKey, endKey);
    const selected = currentKey === startKey || currentKey === endKey;
    return { selected, inRange };
  };

  const handleMonthClick = (month: number) => {
    const candidate = new Date(displayYear, month, 1);
    if (!isWithinRange(candidate)) return;

    setDraftValue((prev) => {
      const base = normalizeRange(prev);
      if (!base?.from || (base.from && base.to)) {
        return { from: candidate, to: undefined };
      }
      const fromKey = monthKey(base.from);
      const nextKey = monthKey(candidate);
      if (nextKey < fromKey) return { from: candidate, to: base.from };
      return { from: base.from, to: candidate };
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className={styles.anchor}>
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
                <CalendarTrigger aria-label="Open month range picker" disabled={disabled} />
              </PopoverTrigger>
            }
          />
        </div>
      </PopoverAnchor>
      <PopoverContent align={align} className={`${styles.monthPopover} ${className ?? ''}`.trim()}>
        <div className={styles.monthContent}>
          <div className={styles.monthHeader}>
            <button
              type="button"
              className={styles.yearNav}
              aria-label="Previous year"
              disabled={!canGoPrevYear}
              onClick={() => setDisplayYear((prev) => prev - 1)}
            >
              <ChevronLeft className={styles.yearNavIcon} />
            </button>
            <span className={styles.yearLabel}>{displayYear}</span>
            <button
              type="button"
              className={styles.yearNav}
              aria-label="Next year"
              disabled={!canGoNextYear}
              onClick={() => setDisplayYear((prev) => prev + 1)}
            >
              <ChevronRight className={styles.yearNavIcon} />
            </button>
          </div>

          <div className={styles.monthGrid}>
            {Array.from({ length: 12 }, (_, month) => {
              const candidate = new Date(displayYear, month, 1);
              const disabledMonth = !isWithinRange(candidate);
              const { selected, inRange } = monthState(month);
              return (
                <button
                  key={month}
                  type="button"
                  className={styles.monthCell}
                  data-selected={selected ? 'true' : 'false'}
                  data-in-range={inRange ? 'true' : 'false'}
                  disabled={disabledMonth}
                  onClick={() => handleMonthClick(month)}
                >
                  {monthLabelFormatter(month, locale)}
                </button>
              );
            })}
          </div>

          <div className={styles.monthActions}>
            {clearable && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="Clear month range"
                onClick={() => setDraftValue(undefined)}
                disabled={!draftValue?.from}
              >
                <X className={styles.monthActionIcon} />
              </Button>
            )}
            <Button
              type="button"
              size="icon"
              variant="primary"
              aria-label="Confirm month range"
              onClick={() => {
                onChange?.(normalizeRange(draftValue));
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

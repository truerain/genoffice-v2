/**
 * @file packages/ui/src/composed/datePicker/MonthPicker.tsx
 * @description Single month picker — MaskedInput (ym) + Popover + month grid.
 * @created 2026-06-25
 */
import { useCallback, useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MaskedInput } from '../../core/maskedInput';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '../../core/popover';
import { CalendarTrigger } from './CalendarTrigger';
import type { MonthPickerProps } from './MonthPicker.types';
import {
  formatDateForYmMask,
  monthKey,
  normalizeMonth,
  parseYmDisplay,
} from './datePickerUtils';
import styles from './DatePicker.module.css';

const monthLabelFormatter = (month: number, locale?: string) =>
  new Intl.DateTimeFormat(locale || undefined, { month: 'short' }).format(new Date(2000, month, 1));

export function MonthPicker({
  value,
  onChange,
  fromMonth,
  toMonth,
  placeholder = 'yyyy-mm',
  disabled,
  align = 'start',
  locale,
  format,
  separator = '-',
  clearable = false,
  parse,
  className,
  editorOverlay = false,
}: MonthPickerProps) {
  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const normalizedFromMonth = normalizeMonth(fromMonth);
  const normalizedToMonth = normalizeMonth(toMonth);
  const [displayYear, setDisplayYear] = useState(() => value?.getFullYear() ?? new Date().getFullYear());
  const [draftValue, setDraftValue] = useState<Date | undefined>(value);

  const isWithinRange = (date?: Date) => {
    if (!date) return true;
    const key = monthKey(date);
    if (normalizedFromMonth && key < monthKey(normalizedFromMonth)) return false;
    if (normalizedToMonth && key > monthKey(normalizedToMonth)) return false;
    return true;
  };

  const minYear = normalizedFromMonth?.getFullYear();
  const maxYear = normalizedToMonth?.getFullYear();

  const formattedValue = useMemo(
    () => (value ? formatDateForYmMask(value, format) : ''),
    [value, format]
  );

  const syncDraftFromDisplay = useCallback((): Date | undefined => {
    return normalizeMonth(parseYmDisplay(display, parse));
  }, [display, parse]);

  const applyDraft = useCallback(
    (nextDraft: Date | undefined) => {
      setDraftValue(nextDraft);
      if (nextDraft) {
        setDisplayYear(nextDraft.getFullYear());
      }
    },
    []
  );

  useEffect(() => {
    if (!isEditing) setDisplay(formattedValue);
  }, [formattedValue, isEditing]);

  useEffect(() => {
    if (open) return;
    setIsEditing(false);
    setDisplay(formattedValue);
  }, [formattedValue, open]);

  useEffect(() => {
    if (!open) return;
    const parsed = syncDraftFromDisplay();
    if (parsed && isWithinRange(parsed)) applyDraft(parsed);
  }, [open, syncDraftFromDisplay, applyDraft]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) return;

    const parsed = syncDraftFromDisplay();
    const nextDraft = parsed && isWithinRange(parsed) ? parsed : value;
    applyDraft(nextDraft);

    if (!nextDraft) {
      const fallbackYear = new Date().getFullYear();
      const boundedYear =
        minYear !== undefined && fallbackYear < minYear
          ? minYear
          : maxYear !== undefined && fallbackYear > maxYear
            ? maxYear
            : fallbackYear;
      setDisplayYear(boundedYear);
    }
  };

  const commitDisplay = () => {
    if (!display.trim()) {
      onChange?.(undefined);
      return true;
    }

    const parsed = normalizeMonth(parseYmDisplay(display, parse));
    if (parsed && isWithinRange(parsed)) {
      onChange?.(parsed);
      setDisplayYear(parsed.getFullYear());
      return true;
    }

    return false;
  };

  const selectedValue = open ? draftValue : value;
  const isSelectedMonth = (month: number) =>
    Boolean(selectedValue && selectedValue.getFullYear() === displayYear && selectedValue.getMonth() === month);
  const canGoPrevYear = minYear === undefined || displayYear > minYear;
  const canGoNextYear = maxYear === undefined || displayYear < maxYear;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverAnchor asChild>
        <div className={styles.anchor}>
          <MaskedInput
            mask={{ preset: 'ym', separator }}
            value={display}
            onChange={(next) => {
              setDisplay(next);
              setIsEditing(true);
              if (!next) onChange?.(undefined);
            }}
            onComplete={(next) => {
              const parsed = normalizeMonth(parseYmDisplay(next, parse));
              if (parsed && isWithinRange(parsed)) applyDraft(parsed);
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
            onBlur={(event) => {
              const nextTarget = event.relatedTarget as HTMLElement | null;
              if (open && nextTarget?.closest('[data-month-picker-popover="true"]')) {
                return;
              }
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
                <CalendarTrigger aria-label="Open month picker" disabled={disabled} />
              </PopoverTrigger>
            }
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        align={align}
        className={`${styles.monthPopover} ${className ?? ''}`.trim()}
        data-month-picker-popover="true"
        data-gen-grid-editor-overlay={editorOverlay ? 'true' : undefined}
      >
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
              return (
                <button
                  key={month}
                  type="button"
                  className={styles.monthCell}
                  data-selected={isSelectedMonth(month) ? 'true' : 'false'}
                  disabled={disabledMonth}
                  onClick={() => {
                    applyDraft(candidate);
                    onChange?.(candidate);
                    setIsEditing(false);
                    setDisplay(formatDateForYmMask(candidate, format));
                    setOpen(false);
                  }}
                >
                  {monthLabelFormatter(month, locale)}
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

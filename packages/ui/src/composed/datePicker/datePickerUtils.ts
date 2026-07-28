/**
 * @file packages/ui/src/composed/datePicker/datePickerUtils.ts
 * @description Shared format/parse helpers for date picker composed components.
 * @created 2026-06-25
 * @updated 2026-07-29
 *
 * @remark
 * - Uses @gen-office/utils wire formats; MaskedInput owns display formatting
 * - custom format/parse props receive display strings (legacy-compatible)
 * - Multi*: normalizeDay/Dates, normalizeMonths + signature helpers for draft sync
 */
import {
  formatDateString,
  parseDateString,
  type DateYmdSeparator,
} from '@gen-office/utils';

export const DEFAULT_DATE_SEPARATOR: DateYmdSeparator = '-';

export function formatDateForYmdMask(
  date: Date,
  separator: DateYmdSeparator = DEFAULT_DATE_SEPARATOR,
  format?: (date: Date) => string
): string {
  if (format) return format(date);
  return formatDateString(date, 'ymd', separator) ?? '';
}

export function formatDateForYmMask(date: Date, format?: (date: Date) => string): string {
  if (format) return format(date);
  return formatDateString(date, 'yyyymm') ?? '';
}

export function parseYmdDisplay(
  display: string,
  separator: DateYmdSeparator = DEFAULT_DATE_SEPARATOR,
  parse?: (value: string) => Date | undefined
): Date | undefined {
  const trimmed = display.trim();
  if (!trimmed) return undefined;
  if (parse) return parse(trimmed);

  const digits = trimmed.replace(/\D/g, '').slice(0, 8);
  if (digits.length === 8) {
    return parseDateString(digits, 'yyyymmdd');
  }

  return parseDateString(trimmed, 'ymd', separator);
}

export function parseYmDisplay(
  display: string,
  parse?: (value: string) => Date | undefined
): Date | undefined {
  const trimmed = display.trim();
  if (!trimmed) return undefined;
  if (parse) return parse(trimmed);

  const digits = trimmed.replace(/\D/g, '').slice(0, 6);
  if (digits.length === 6) {
    return parseDateString(digits, 'yyyymm');
  }

  const match = trimmed.match(/^(\d{4})[-/.](\d{1,2})$/);
  if (!match) return undefined;

  const year = Number(match[1]);
  const month = Number(match[2]);
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return undefined;
  }

  const date = new Date(year, month - 1, 1);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function normalizeDay(date?: Date): Date | undefined {
  return date ? new Date(date.getFullYear(), date.getMonth(), date.getDate()) : undefined;
}

export function dayKey(date: Date): number {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

export function normalizeDates(dates?: Date[]): Date[] {
  if (!dates?.length) return [];
  const byKey = new Map<number, Date>();
  for (const item of dates) {
    const next = normalizeDay(item);
    if (!next) continue;
    byKey.set(dayKey(next), next);
  }
  return Array.from(byKey.values()).sort((a, b) => dayKey(a) - dayKey(b));
}

export function datesSignature(dates?: Date[]): string {
  return normalizeDates(dates)
    .map((date) => dayKey(date))
    .join(',');
}

export function normalizeMonth(date?: Date): Date | undefined {
  return date ? new Date(date.getFullYear(), date.getMonth(), 1) : undefined;
}

export function monthKey(date: Date): number {
  return date.getFullYear() * 12 + date.getMonth();
}

export function normalizeMonths(months?: Date[]): Date[] {
  if (!months?.length) return [];
  const byKey = new Map<number, Date>();
  for (const item of months) {
    const next = normalizeMonth(item);
    if (!next) continue;
    byKey.set(monthKey(next), next);
  }
  return Array.from(byKey.values()).sort((a, b) => monthKey(a) - monthKey(b));
}

export function monthsSignature(months?: Date[]): string {
  return normalizeMonths(months)
    .map((date) => monthKey(date))
    .join(',');
}

/**
 * @file packages/utils/src/format/date.ts
 * @description Date parse/format helpers for wire formats and ko-KR display.
 * @created 2026-06-23
 *
 * @remark
 * - Types: DateWireFormat, DateYmdSeparator, DateDisplayStyle
 * - Wire: parseDateString, formatDateString (`yyyymmdd` | `yyyymm` | `ymd` + separator)
 * - Display: formatDateDisplay, formatDateTime, formatTime, formatRelativeTime
 * - iso date = parseDateString(value, 'ymd', '-')
 * - V1 names live in ./date.v1 (deprecated compatibility)
 */

export type DateWireFormat = 'yyyymmdd' | 'yyyymm' | 'ymd';

export type DateYmdSeparator = '-' | '/' | '.';

export type DateDisplayStyle = 'short' | 'long' | 'full';

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toLocalDate = (year: number, month: number, day: number): Date | undefined => {
  if (month < 1 || month > 12 || day < 1 || day > 31) return undefined;

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }

  return date;
};

const parseYmdString = (value: string, separator: DateYmdSeparator): Date | undefined => {
  if (!value) return undefined;

  const pattern = new RegExp(
    `^\\d{4}${escapeRegExp(separator)}\\d{2}${escapeRegExp(separator)}\\d{2}$`,
  );
  if (!pattern.test(value)) return undefined;

  const [yearStr, monthStr, dayStr] = value.split(separator);
  return toLocalDate(Number(yearStr), Number(monthStr), Number(dayStr));
};

const parseYyyymmddString = (value: string): Date | undefined => {
  if (!/^\d{8}$/.test(value)) return undefined;

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));
  return toLocalDate(year, month, day);
};

const parseYyyymmString = (value: string): Date | undefined => {
  if (!/^\d{6}$/.test(value)) return undefined;

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  if (month < 1 || month > 12) return undefined;

  const date = new Date(year, month - 1, 1);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export const parseDateString = (
  value: string,
  format: DateWireFormat,
  separator: DateYmdSeparator = '-',
): Date | undefined => {
  switch (format) {
    case 'yyyymmdd':
      return parseYyyymmddString(value);
    case 'yyyymm':
      return parseYyyymmString(value);
    case 'ymd':
      return parseYmdString(value, separator);
    default:
      return undefined;
  }
};

export const formatDateString = (
  date: Date | undefined,
  format: DateWireFormat,
  separator: DateYmdSeparator = '-',
): string | undefined => {
  if (!date || Number.isNaN(date.getTime())) return undefined;

  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  switch (format) {
    case 'yyyymmdd':
      return `${year}${month}${day}`;
    case 'yyyymm':
      return `${year}${month}`;
    case 'ymd':
      return `${year}${separator}${month}${separator}${day}`;
    default:
      return undefined;
  }
};

export const formatDateDisplay = (
  date: Date | string,
  style: DateDisplayStyle = 'short',
): string => {
  const d = typeof date === 'string' ? new Date(date) : date;

  const formats: Record<DateDisplayStyle, Intl.DateTimeFormatOptions> = {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  };

  return new Intl.DateTimeFormat('ko-KR', formats[style]).format(d);
};

export const formatDateTime = (date: Date | string): string => {
  return formatDateDisplay(date, 'full');
};

export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(d);
};

export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return '방금 전';
};

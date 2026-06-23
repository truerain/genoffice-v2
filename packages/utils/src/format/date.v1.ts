/**
 * @file packages/utils/src/format/date.v1.ts
 * @description V1 @gen-office/utils date API compatibility aliases.
 * @created 2026-06-23
 *
 * @remark
 * - Thin wrappers around date.ts; remove after ui/V1 consumer migration
 * - V1 parseDateString was parseDate alias — do not confuse with V2 parseDateString(format)
 * - Exports: parseDate, parseApiDate, formatDate, formatApiDate, formatApiMonth, yyyymmToDate, dateToYyyymm
 */
import {
  formatDateDisplay,
  formatDateString,
  parseDateString,
} from './date';

/** @deprecated Use `parseDateString(value, 'ymd', '-')` from `./date` */
export const parseDate = (value: string): Date | undefined =>
  parseDateString(value, 'ymd', '-');

/** @deprecated Use `parseDateString(value, 'yyyymmdd')` from `./date` */
export const parseApiDate = (value: string): Date | undefined =>
  parseDateString(value, 'yyyymmdd');

/** @deprecated Use `formatDateDisplay` from `./date` */
export const formatDate = formatDateDisplay;

/** @deprecated Use `formatDateString(date, 'yyyymmdd')` from `./date` */
export const formatApiDate = (date: Date | undefined): string | undefined =>
  formatDateString(date, 'yyyymmdd');

/** @deprecated Use `formatDateString(date, 'yyyymm')` from `./date` */
export const formatApiMonth = (date: Date | undefined): string | undefined =>
  formatDateString(date, 'yyyymm');

/** @deprecated Use `parseDateString(value, 'yyyymm')` from `./date` */
export const yyyymmToDate = (value: string): Date | undefined =>
  parseDateString(value, 'yyyymm');

/** @deprecated Use `formatDateString(date, 'yyyymm')` from `./date` */
export const dateToYyyymm = (date: Date | undefined): string | undefined =>
  formatDateString(date, 'yyyymm');

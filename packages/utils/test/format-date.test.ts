/**
 * @file packages/utils/test/format-date.test.ts
 * @description Tests for date parse/format helpers.
 * @created 2026-06-23
 */
import { describe, expect, it } from 'vitest';

import {
  formatDateDisplay,
  formatDateString,
  formatDateTime,
  formatRelativeTime,
  formatTime,
  parseDateString,
} from '../src/format/date';
import {
  dateToYyyymm,
  formatApiDate,
  parseApiDate,
  yyyymmToDate,
} from '../src/format/date.v1';

describe('parseDateString', () => {
  it('parses ymd with default separator (-)', () => {
    const date = parseDateString('2024-03-15', 'ymd');
    expect(date?.getFullYear()).toBe(2024);
    expect(date?.getMonth()).toBe(2);
    expect(date?.getDate()).toBe(15);
  });

  it('parses ymd with slash and dot separators', () => {
    expect(parseDateString('2024/03/15', 'ymd', '/')?.getDate()).toBe(15);
    expect(parseDateString('2024.03.15', 'ymd', '.')?.getDate()).toBe(15);
  });

  it('returns undefined for invalid ymd input', () => {
    expect(parseDateString('', 'ymd')).toBeUndefined();
    expect(parseDateString('2024-03-15', 'ymd', '/')).toBeUndefined();
    expect(parseDateString('2024-02-30', 'ymd')).toBeUndefined();
  });

  it('parses yyyymmdd', () => {
    const date = parseDateString('20240315', 'yyyymmdd');
    expect(date?.getFullYear()).toBe(2024);
    expect(date?.getMonth()).toBe(2);
    expect(date?.getDate()).toBe(15);
  });

  it('returns undefined for invalid yyyymmdd length', () => {
    expect(parseDateString('2024031', 'yyyymmdd')).toBeUndefined();
  });

  it('parses yyyymm to first day of month', () => {
    const date = parseDateString('202403', 'yyyymm');
    expect(date?.getFullYear()).toBe(2024);
    expect(date?.getMonth()).toBe(2);
    expect(date?.getDate()).toBe(1);
  });

  it('rejects invalid yyyymm month', () => {
    expect(parseDateString('202413', 'yyyymm')).toBeUndefined();
  });
});

describe('formatDateString', () => {
  const sample = new Date(2024, 2, 15);

  it('formats yyyymmdd', () => {
    expect(formatDateString(sample, 'yyyymmdd')).toBe('20240315');
  });

  it('formats yyyymm', () => {
    expect(formatDateString(sample, 'yyyymm')).toBe('202403');
  });

  it('formats ymd with separators', () => {
    expect(formatDateString(sample, 'ymd', '-')).toBe('2024-03-15');
    expect(formatDateString(sample, 'ymd', '/')).toBe('2024/03/15');
    expect(formatDateString(sample, 'ymd', '.')).toBe('2024.03.15');
  });

  it('returns undefined for missing date', () => {
    expect(formatDateString(undefined, 'yyyymmdd')).toBeUndefined();
  });
});

describe('wire round-trip', () => {
  it('round-trips yyyymmdd', () => {
    const value = '20240315';
    expect(formatDateString(parseDateString(value, 'yyyymmdd'), 'yyyymmdd')).toBe(value);
  });

  it('round-trips yyyymm', () => {
    const value = '202403';
    expect(formatDateString(parseDateString(value, 'yyyymm'), 'yyyymm')).toBe(value);
  });

  it('round-trips ymd with separator', () => {
    const value = '2024/03/15';
    const date = parseDateString(value, 'ymd', '/');
    expect(formatDateString(date, 'ymd', '/')).toBe(value);
  });
});

describe('formatDateDisplay', () => {
  it('formats short style in ko-KR', () => {
    const formatted = formatDateDisplay(new Date(2024, 2, 15), 'short');
    expect(formatted).toContain('2024');
    expect(formatted).toContain('15');
  });
});

describe('formatDateTime', () => {
  it('formats full display style', () => {
    const formatted = formatDateTime(new Date(2024, 2, 15, 14, 30));
    expect(formatted).toContain('2024');
  });
});

describe('formatTime', () => {
  it('formats time in ko-KR', () => {
    const formatted = formatTime(new Date(2024, 2, 15, 9, 5, 3));
    expect(formatted).toMatch(/9/);
  });
});

describe('formatRelativeTime', () => {
  it('returns relative Korean label for recent past', () => {
    const recent = new Date(Date.now() - 30_000);
    expect(formatRelativeTime(recent)).toBe('방금 전');
  });
});

describe('date.v1 compatibility aliases', () => {
  it('delegates to V2 wire/display APIs', () => {
    const date = parseApiDate('20240315');
    expect(formatApiDate(date)).toBe('20240315');

    const monthDate = yyyymmToDate('202403');
    expect(dateToYyyymm(monthDate)).toBe('202403');
  });
});

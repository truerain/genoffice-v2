/**
 * @file packages/utils/test/format-number.test.ts
 * @description Tests for ko-KR number formatting helpers.
 * @created 2026-06-23
 */
import { describe, expect, it } from 'vitest';

import {
  formatCompactNumber,
  formatCurrency,
  formatDeltaFlag,
  formatFileSize,
  formatNegativeNumber,
  formatNumber,
  formatPercent,
} from '../src/format/number';

describe('formatNumber', () => {
  it('formats with ko-KR grouping', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });
});

describe('formatCurrency', () => {
  it('formats KRW by default', () => {
    expect(formatCurrency(1000)).toContain('1,000');
    expect(formatCurrency(1000)).toMatch(/₩|원/);
  });
});

describe('formatPercent', () => {
  it('formats percent from whole number input', () => {
    expect(formatPercent(50)).toContain('50');
    expect(formatPercent(50)).toMatch(/%/);
  });
});

describe('formatFileSize', () => {
  it('formats zero and non-zero bytes with English units', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
    expect(formatFileSize(1024)).toBe('1 KB');
  });
});

describe('formatCompactNumber', () => {
  it('formats large numbers in compact notation', () => {
    const formatted = formatCompactNumber(1_500_000);
    expect(formatted.length).toBeGreaterThan(0);
  });
});

describe('formatNegativeNumber', () => {
  it('prefixes negative values with triangle', () => {
    expect(formatNegativeNumber(-1200)).toBe('△1,200');
    expect(formatNegativeNumber(1200)).toBe('1,200');
  });
});

describe('formatDeltaFlag', () => {
  it('appends direction arrows', () => {
    expect(formatDeltaFlag(10)).toBe('10↑');
    expect(formatDeltaFlag(-10)).toBe('10↓');
    expect(formatDeltaFlag(0)).toBe('-0');
  });

  it('appends percent suffix when requested', () => {
    expect(formatDeltaFlag(5, { isPercent: true })).toBe('5%↑');
  });
});

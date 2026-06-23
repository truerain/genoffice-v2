/**
 * @file packages/utils/test/normalize.test.ts
 * @description Tests for back-office form normalization helpers.
 * @created 2026-06-23
 */
import { describe, expect, it } from 'vitest';

import {
  normalize,
  normalizeNullable,
  normalizeSortOrder,
  normalizeUppercode,
  normalizeUseYnWithDefault,
  normalizeWithDefault,
  normalizeYesNo,
} from '../src/normalize';
import { normalizeUseYn } from '../src/index';

describe('normalize', () => {
  it('trims and stringifies values', () => {
    expect(normalize('  foo  ')).toBe('foo');
    expect(normalize(null)).toBe('');
    expect(normalize(42)).toBe('42');
  });
});

describe('normalizeNullable', () => {
  it('returns null for blank values', () => {
    expect(normalizeNullable('   ')).toBeNull();
    expect(normalizeNullable('x')).toBe('x');
  });
});

describe('normalizeUppercode', () => {
  it('uppercases and strips invalid characters', () => {
    expect(normalizeUppercode(' foo bar ')).toBe('FOO_BAR');
    expect(normalizeUppercode('code-1!')).toBe('CODE1');
  });
});

describe('normalizeYesNo', () => {
  it('accepts Y and N (case insensitive)', () => {
    expect(normalizeYesNo('y')).toBe('Y');
    expect(normalizeYesNo(' N ')).toBe('N');
  });

  it('throws for invalid values', () => {
    expect(() => normalizeYesNo('yes')).toThrow(/Y.*N/);
  });
});

describe('normalizeSortOrder', () => {
  it('returns null for empty input', () => {
    expect(normalizeSortOrder('')).toBeNull();
  });

  it('parses non-negative numbers', () => {
    expect(normalizeSortOrder('10')).toBe(10);
    expect(normalizeSortOrder('0')).toBe(0);
  });

  it('throws for negative numbers', () => {
    expect(() => normalizeSortOrder('-1')).toThrow(/non-negative/);
  });
});

describe('normalizeWithDefault', () => {
  it('uses default when value is blank', () => {
    expect(normalizeWithDefault('', 'fallback')).toBe('fallback');
    expect(normalizeWithDefault('x', 'fallback')).toBe('x');
  });
});

describe('normalizeUseYnWithDefault', () => {
  it('returns default when value is invalid', () => {
    expect(normalizeUseYnWithDefault('invalid', 'N')).toBe('N');
    expect(normalizeUseYnWithDefault('Y', 'N')).toBe('Y');
  });
});

describe('normalize.v1 compatibility alias', () => {
  it('normalizeUseYn is exported from package barrel', () => {
    expect(normalizeUseYn('y')).toBe('Y');
    expect(normalizeUseYn('n')).toBe('N');
  });
});

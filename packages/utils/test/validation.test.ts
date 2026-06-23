/**
 * @file packages/utils/test/validation.test.ts
 * @description Tests for validation helpers.
 * @created 2026-06-23
 */
import { describe, expect, it } from 'vitest';

import {
  inRange,
  isAlphanumeric,
  isEmail,
  isEmpty,
  isNumeric,
  isPhone,
  isUrl,
  maxLength,
  minLength,
  validateNoWhitespace,
  validateNonNegativeNumber,
  validateRequired,
  validateUppercaseCode,
  validateYesNo,
} from '../src/validation';

describe('isEmail', () => {
  it('validates basic email shape', () => {
    expect(isEmail('user@example.com')).toBe(true);
    expect(isEmail('not-an-email')).toBe(false);
  });
});

describe('isPhone', () => {
  it('validates Korean mobile numbers', () => {
    expect(isPhone('01012345678')).toBe(true);
    expect(isPhone('0212345678')).toBe(false);
  });
});

describe('isUrl', () => {
  it('validates absolute URLs', () => {
    expect(isUrl('https://example.com')).toBe(true);
    expect(isUrl('not-a-url')).toBe(false);
  });
});

describe('isNumeric', () => {
  it('validates numeric strings', () => {
    expect(isNumeric('42')).toBe(true);
    expect(isNumeric('')).toBe(false);
    expect(isNumeric('abc')).toBe(false);
  });
});

describe('isAlphanumeric', () => {
  it('accepts letters and digits only', () => {
    expect(isAlphanumeric('Code1')).toBe(true);
    expect(isAlphanumeric('code-1')).toBe(false);
  });
});

describe('minLength / maxLength', () => {
  it('compares string length', () => {
    expect(minLength('abcd', 3)).toBe(true);
    expect(maxLength('abcd', 3)).toBe(false);
  });
});

describe('inRange', () => {
  it('checks inclusive numeric range', () => {
    expect(inRange(5, 1, 10)).toBe(true);
    expect(inRange(0, 1, 10)).toBe(false);
  });
});

describe('isEmpty', () => {
  it('detects empty values', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty('  ')).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty('x')).toBe(false);
  });
});

describe('validateYesNo', () => {
  it('does not throw for Y/N', () => {
    expect(() => validateYesNo('Y')).not.toThrow();
    expect(() => validateYesNo('n')).not.toThrow();
  });

  it('throws for other values', () => {
    expect(() => validateYesNo('X')).toThrow();
  });
});

describe('validateUppercaseCode', () => {
  it('throws when code contains lowercase or symbols', () => {
    expect(() => validateUppercaseCode('abc', 'code')).toThrow();
    expect(() => validateUppercaseCode('CODE_1', 'code')).not.toThrow();
  });
});

describe('validateRequired', () => {
  it('throws when value is blank', () => {
    expect(() => validateRequired('  ', 'name')).toThrow(/required/);
    expect(() => validateRequired('ok', 'name')).not.toThrow();
  });
});

describe('validateNoWhitespace', () => {
  it('throws when value contains whitespace', () => {
    expect(() => validateNoWhitespace('a b', 'code')).toThrow(/whitespace/);
    expect(() => validateNoWhitespace('CODE', 'code')).not.toThrow();
  });
});

describe('validateNonNegativeNumber', () => {
  it('throws for negative or non-finite numbers', () => {
    expect(() => validateNonNegativeNumber(-1, 'count')).toThrow(/non-negative/);
    expect(() => validateNonNegativeNumber(Number.NaN, 'count')).toThrow(/non-negative/);
    expect(() => validateNonNegativeNumber(0, 'count')).not.toThrow();
  });
});

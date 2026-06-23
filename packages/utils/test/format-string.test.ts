/**
 * @file packages/utils/test/format-string.test.ts
 * @description Tests for string formatting helpers.
 * @created 2026-06-23
 */
import { describe, expect, it } from 'vitest';

import { capitalize, toKebabCase } from '../src/format/string';

describe('capitalize', () => {
  it('capitalizes first letter and lowercases the rest', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('HELLO')).toBe('Hello');
  });

  it('returns empty string for empty input', () => {
    expect(capitalize('')).toBe('');
  });
});

describe('toKebabCase', () => {
  it('converts camelCase and spaces to kebab-case', () => {
    expect(toKebabCase('fooBar')).toBe('foo-bar');
    expect(toKebabCase('foo bar')).toBe('foo-bar');
  });
});

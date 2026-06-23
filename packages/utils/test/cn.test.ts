/**
 * @file packages/utils/test/cn.test.ts
 * @description Tests for cn() class name helper.
 * @created 2026-06-23
 */
import { describe, expect, it } from 'vitest';

import { cn } from '../src/cn';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });
});

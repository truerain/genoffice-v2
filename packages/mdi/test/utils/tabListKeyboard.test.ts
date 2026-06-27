/**
 * @file packages/mdi/test/utils/tabListKeyboard.test.ts
 * @description Unit tests for tab list keyboard index helper.
 * @created 2026-06-27
 */
import { describe, expect, it } from 'vitest';
import { isTabListNavigationKey, resolveNextTabIndex } from '../../src/utils/tabListKeyboard';

describe('tabListKeyboard', () => {
  it('detects navigation keys', () => {
    expect(isTabListNavigationKey('ArrowRight')).toBe(true);
    expect(isTabListNavigationKey('Enter')).toBe(false);
  });

  it('wraps ArrowRight at end', () => {
    expect(resolveNextTabIndex(2, 3, 'ArrowRight')).toBe(0);
  });

  it('wraps ArrowLeft at start', () => {
    expect(resolveNextTabIndex(0, 3, 'ArrowLeft')).toBe(2);
  });
});

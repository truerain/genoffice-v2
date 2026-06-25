/**
 * @file packages/utils/test/format-mask.test.ts
 * @description Tests for mask engine and date presets.
 * @created 2026-06-25
 */
import { describe, expect, it } from 'vitest';

import {
  appendDigit,
  applyPasteMask,
  backspaceDigit,
  createMaskState,
  createMaskStateFromDisplay,
  formatDigits,
  resolveMaskDefinition,
  resolveMaskPreset,
} from '../src/format/mask';

describe('mask engine', () => {
  const ymd = resolveMaskPreset({ preset: 'ymd', separator: '-' });

  it('formats sequential digits into ymd display', () => {
    expect(formatDigits('20260625', ymd)).toBe('2026-06-25');
    expect(formatDigits('202606', ymd)).toBe('2026-06');
    expect(formatDigits('2026', ymd)).toBe('2026');
  });

  it('builds complete state after eight digits', () => {
    let state = createMaskState('', ymd);
    for (const digit of '20260625') {
      state = appendDigit(state.digits, digit, ymd);
    }
    expect(state.display).toBe('2026-06-25');
    expect(state.complete).toBe(true);
  });

  it('removes trailing digit on backspace', () => {
    const state = backspaceDigit('202606', ymd);
    expect(state.display).toBe('2026-0');
    expect(state.complete).toBe(false);
  });

  it('normalizes pasted values', () => {
    const state = applyPasteMask('', '2026/06/25', ymd);
    expect(state.display).toBe('2026-06-25');
    expect(state.digits).toBe('20260625');
  });

  it('parses display back to digits', () => {
    const state = createMaskStateFromDisplay('2026-06-25', ymd);
    expect(state.digits).toBe('20260625');
    expect(state.complete).toBe(true);
  });

  it('resolves ym preset', () => {
    const ym = resolveMaskDefinition('ym');
    expect(createMaskState('202606', ym).display).toBe('2026-06');
  });
});

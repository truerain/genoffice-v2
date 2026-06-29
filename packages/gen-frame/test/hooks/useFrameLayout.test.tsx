/**
 * @file packages/gen-frame/test/hooks/useFrameLayout.test.tsx
 * @description Tests for useFrameLayout hook.
 * @created 2026-06-29
 */
import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import {
  FRAME_LAYOUT_STORAGE_KEY,
  isFrameLayoutMode,
  useFrameLayout,
} from '../../src/hooks/useFrameLayout';

describe('isFrameLayoutMode', () => {
  it('accepts known layout modes', () => {
    expect(isFrameLayoutMode('leftPanel')).toBe(true);
    expect(isFrameLayoutMode('titleBar')).toBe(true);
  });

  it('rejects unknown values', () => {
    expect(isFrameLayoutMode('unknown')).toBe(false);
  });
});

describe('useFrameLayout', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns default layout', () => {
    const { result } = renderHook(() => useFrameLayout('leftPanel'));
    expect(result.current.layout).toBe('leftPanel');
  });

  it('persists layout changes', () => {
    const { result } = renderHook(() => useFrameLayout('leftPanel'));

    act(() => {
      result.current.setLayout('titleBar');
    });

    expect(result.current.layout).toBe('titleBar');
    expect(window.localStorage.getItem(FRAME_LAYOUT_STORAGE_KEY)).toBe('titleBar');
  });

  it('reads stored layout on init', () => {
    window.localStorage.setItem(FRAME_LAYOUT_STORAGE_KEY, 'titleBar');
    const { result } = renderHook(() => useFrameLayout('leftPanel'));
    expect(result.current.layout).toBe('titleBar');
  });
});

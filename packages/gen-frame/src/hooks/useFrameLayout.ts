/**
 * @file packages/gen-frame/src/hooks/useFrameLayout.ts
 * @description Persists frame layout mode in localStorage for showcase.
 * @created 2026-06-29
 *
 * @remark
 * - Exports: useFrameLayout, FRAME_LAYOUT_STORAGE_KEY, isFrameLayoutMode
 *
 */

import { useCallback, useState } from 'react';
import type { FrameLayoutMode } from '../types';

export const FRAME_LAYOUT_STORAGE_KEY = 'gen-office-frame-layout';

const LAYOUT_MODES: FrameLayoutMode[] = ['leftPanel', 'titleBar', 'hybrid', 'rail'];

export function isFrameLayoutMode(value: string): value is FrameLayoutMode {
  return LAYOUT_MODES.includes(value as FrameLayoutMode);
}

function readStoredLayout(defaultLayout: FrameLayoutMode, storageKey: string): FrameLayoutMode {
  if (typeof window === 'undefined') return defaultLayout;
  const stored = window.localStorage.getItem(storageKey);
  if (stored && isFrameLayoutMode(stored)) return stored;
  return defaultLayout;
}

export function useFrameLayout(
  defaultLayout: FrameLayoutMode = 'leftPanel',
  storageKey: string = FRAME_LAYOUT_STORAGE_KEY,
) {
  const [layout, setLayoutState] = useState<FrameLayoutMode>(() =>
    readStoredLayout(defaultLayout, storageKey),
  );

  const setLayout = useCallback(
    (next: FrameLayoutMode) => {
      setLayoutState(next);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, next);
      }
    },
    [storageKey],
  );

  return { layout, setLayout };
}

/**
 * @file apps/demo/src/app/settings/useDemoPageChrome.ts
 * @description Persists demo PageLayout chrome prefs (page header visibility).
 * @created 2026-07-20
 *
 * @remark
 * - Exports: useDemoPageChrome, DEMO_PAGE_CHROME_STORAGE_KEY
 * - Mirrors useFrameLayout localStorage pattern
 *
 */

import { useCallback, useState } from 'react';

export const DEMO_PAGE_CHROME_STORAGE_KEY = 'gen-office-demo-page-chrome';

interface DemoPageChromeStored {
  showPageHeader: boolean;
}

function readStoredShowPageHeader(defaultValue: boolean): boolean {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = window.localStorage.getItem(DEMO_PAGE_CHROME_STORAGE_KEY);
    if (!raw) return defaultValue;
    const parsed = JSON.parse(raw) as Partial<DemoPageChromeStored>;
    if (typeof parsed.showPageHeader === 'boolean') return parsed.showPageHeader;
  } catch {
    // ignore corrupt storage
  }
  return defaultValue;
}

export function useDemoPageChrome(defaultShowPageHeader = true) {
  const [showPageHeader, setShowPageHeaderState] = useState(() =>
    readStoredShowPageHeader(defaultShowPageHeader),
  );

  const setShowPageHeader = useCallback((next: boolean) => {
    setShowPageHeaderState(next);
    if (typeof window !== 'undefined') {
      const payload: DemoPageChromeStored = { showPageHeader: next };
      window.localStorage.setItem(DEMO_PAGE_CHROME_STORAGE_KEY, JSON.stringify(payload));
    }
  }, []);

  return { showPageHeader, setShowPageHeader };
}

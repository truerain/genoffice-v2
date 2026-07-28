/**
 * @file apps/demo/src/app/settings/useDemoPageChrome.ts
 * @description Persists demo page chrome prefs (PageLayout header, CRUD ActionBar mode).
 * @created 2026-07-20
 * @updated 2026-07-20
 *
 * @remark
 * - Exports: useDemoPageChrome, DEMO_PAGE_CHROME_STORAGE_KEY
 * - Mirrors useFrameLayout localStorage pattern
 * - Storage: showPageHeader + actionBarButtonMode in one JSON object
 *
 */

import type { DataGridCrudActionBarButtonMode } from '@gen-office/gen-datagrid-crud';
import { useCallback, useState } from 'react';

export const DEMO_PAGE_CHROME_STORAGE_KEY = 'gen-office-demo-page-chrome';

interface DemoPageChromeStored {
  showPageHeader: boolean;
  actionBarButtonMode: DataGridCrudActionBarButtonMode;
}

const DEFAULT_CHROME: DemoPageChromeStored = {
  showPageHeader: true,
  actionBarButtonMode: 'label',
};

function isActionBarButtonMode(value: unknown): value is DataGridCrudActionBarButtonMode {
  return value === 'label' || value === 'icon';
}

function readStoredChrome(defaults: DemoPageChromeStored = DEFAULT_CHROME): DemoPageChromeStored {
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = window.localStorage.getItem(DEMO_PAGE_CHROME_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<DemoPageChromeStored>;
    return {
      showPageHeader:
        typeof parsed.showPageHeader === 'boolean'
          ? parsed.showPageHeader
          : defaults.showPageHeader,
      actionBarButtonMode: isActionBarButtonMode(parsed.actionBarButtonMode)
        ? parsed.actionBarButtonMode
        : defaults.actionBarButtonMode,
    };
  } catch {
    return defaults;
  }
}

function persistChrome(next: DemoPageChromeStored) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(DEMO_PAGE_CHROME_STORAGE_KEY, JSON.stringify(next));
  }
}

export function useDemoPageChrome(defaults: Partial<DemoPageChromeStored> = {}) {
  const resolvedDefaults: DemoPageChromeStored = {
    showPageHeader: defaults.showPageHeader ?? DEFAULT_CHROME.showPageHeader,
    actionBarButtonMode: defaults.actionBarButtonMode ?? DEFAULT_CHROME.actionBarButtonMode,
  };

  const [chrome, setChromeState] = useState(() => readStoredChrome(resolvedDefaults));

  const setShowPageHeader = useCallback((showPageHeader: boolean) => {
    setChromeState((prev) => {
      const next = { ...prev, showPageHeader };
      persistChrome(next);
      return next;
    });
  }, []);

  const setActionBarButtonMode = useCallback((actionBarButtonMode: DataGridCrudActionBarButtonMode) => {
    setChromeState((prev) => {
      const next = { ...prev, actionBarButtonMode };
      persistChrome(next);
      return next;
    });
  }, []);

  return {
    showPageHeader: chrome.showPageHeader,
    setShowPageHeader,
    actionBarButtonMode: chrome.actionBarButtonMode,
    setActionBarButtonMode,
  };
}

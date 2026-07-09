/**
 * @file apps/demo/src/app/mdi/demoMdiDevPersistence.ts
 * @description Dev-only sessionStorage snapshot for MDI tabs (survives Vite page reload).
 * @created 2026-07-09
 *
 * @remark
 * - `import.meta.env.DEV`에서만 사용 (`useDevMdiTabPersistence`)
 * - 탭 `meta.componentName`·`meta.params`로 복원
 *
 * @history
 * - 2026-07-09 신규 — userColumns 저장 시 page reload 대응
 */

import type { MDITab } from '@gen-office/mdi';

export const DEMO_MDI_DEV_STORAGE_KEY = 'gen-office-demo-dev-mdi-tabs';

export interface PersistedDemoMdiTab {
  id: string;
  title: string;
  closable: boolean;
  componentName: string;
  params?: Record<string, string>;
}

export interface PersistedDemoMdiState {
  tabs: PersistedDemoMdiTab[];
  activeTabId: string | null;
}

export function readDevMdiTabState(): PersistedDemoMdiState | null {
  if (typeof sessionStorage === 'undefined') return null;

  const raw = sessionStorage.getItem(DEMO_MDI_DEV_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PersistedDemoMdiState;
    if (!Array.isArray(parsed.tabs)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeDevMdiTabState(state: PersistedDemoMdiState): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(DEMO_MDI_DEV_STORAGE_KEY, JSON.stringify(state));
}

export function clearDevMdiTabState(): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.removeItem(DEMO_MDI_DEV_STORAGE_KEY);
}

export function tabToPersisted(tab: MDITab): PersistedDemoMdiTab | null {
  const componentName = tab.meta?.componentName;
  if (typeof componentName !== 'string' || !componentName) {
    return null;
  }

  const params = tab.meta?.params;
  const normalizedParams =
    params && typeof params === 'object' && !Array.isArray(params)
      ? (params as Record<string, string>)
      : undefined;

  return {
    id: tab.id,
    title: tab.title,
    closable: tab.closable !== false,
    componentName,
    params: normalizedParams,
  };
}

/**
 * @file apps/demo/src/app/url/demoUrlSync.ts
 * @description Demo URL helpers (`?menu=<pageId>`).
 * @created 2026-06-29
 *
 * @remark
 * - Deep link: same as menu click via openMenuItem; then clear query to root
 *
 */

import { createQueryTabUrlSyncAdapter } from '@gen-office/gen-frame';

export const demoUrlSyncAdapter = createQueryTabUrlSyncAdapter({ param: 'menu' });

export function readInitialDemoMenuPageId(): string | null {
  if (typeof window === 'undefined') return null;
  return demoUrlSyncAdapter.getPageIdFromUrl(window.location.href);
}

export function clearDemoMenuFromUrl(): void {
  if (typeof window === 'undefined') return;
  const cleared = demoUrlSyncAdapter.clearUrl();
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (cleared !== current) {
    window.history.replaceState(null, '', cleared);
  }
}

/**
 * @file apps/demo/src/app/url/demoUrlSync.ts
 * @description Demo URL sync adapter (`?tab=<pageId>`).
 * @created 2026-06-29
 *
 * @remark
 *
 */

import { createQueryTabUrlSyncAdapter } from '@gen-office/gen-frame';

export const demoUrlSyncAdapter = createQueryTabUrlSyncAdapter({ param: 'tab' });

export function hasDemoUrlTabParam(): boolean {
  if (typeof window === 'undefined') return false;
  return demoUrlSyncAdapter.getPageIdFromUrl(window.location.href) != null;
}

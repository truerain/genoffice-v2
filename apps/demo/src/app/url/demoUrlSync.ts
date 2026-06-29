/**
 * @file apps/demo/src/app/url/demoUrlSync.ts
 * @description Demo URL sync adapter (`?menu=<pageId>`).
 * @created 2026-06-29
 *
 * @remark
 * - MDI demo: deep-link only; param name `menu` (not `tab`)
 *
 */

import { createQueryTabUrlSyncAdapter } from '@gen-office/gen-frame';

export const demoUrlSyncAdapter = createQueryTabUrlSyncAdapter({ param: 'menu' });

export function hasDemoUrlMenuParam(): boolean {
  if (typeof window === 'undefined') return false;
  return demoUrlSyncAdapter.getPageIdFromUrl(window.location.href) != null;
}

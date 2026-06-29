/**
 * @file packages/gen-frame/src/types/url.types.ts
 * @description URL sync contracts for navigation (Gate F4).
 * @created 2026-06-29
 *
 * @remark
 * - Apps implement payload resolution; adapter only maps pageId ↔ URL
 *
 */

import type { FrameOpenPagePayload } from './navigation.types';
import type { NavigationController } from './navigation.types';

export interface UrlSyncAdapter {
  getPageIdFromUrl(url: string | URL): string | null;
  buildUrl(pageId: string, baseUrl?: string | URL): string;
  clearUrl(baseUrl?: string | URL): string;
}

export interface CreateQueryTabUrlSyncAdapterOptions {
  /** Query parameter name (default: `tab`) */
  param?: string;
}

export interface UseUrlSyncOptions {
  controller: NavigationController;
  adapter: UrlSyncAdapter;
  activePageId: string | null;
  tabIds: string[];
  resolvePayload?: (pageId: string) => FrameOpenPagePayload | null;
  enabled?: boolean;
}

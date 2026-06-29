/**
 * @file packages/gen-frame/src/url/createQueryTabUrlSyncAdapter.ts
 * @description Query-parameter URL adapter — `?tab=<pageId>` (Gate F4).
 * @created 2026-06-29
 *
 * @remark
 * - Exports: createQueryTabUrlSyncAdapter
 *
 */

import type { CreateQueryTabUrlSyncAdapterOptions, UrlSyncAdapter } from '../types';

function toUrl(url: string | URL, base?: string): URL {
  if (url instanceof URL) return url;
  const baseHref =
    base ?? (typeof window !== 'undefined' ? window.location.href : 'http://localhost/');
  return new URL(url, baseHref);
}

function formatUrl(url: URL): string {
  return `${url.pathname}${url.search}${url.hash}`;
}

export function createQueryTabUrlSyncAdapter(
  options: CreateQueryTabUrlSyncAdapterOptions = {},
): UrlSyncAdapter {
  const param = options.param ?? 'tab';

  return {
    getPageIdFromUrl(url) {
      const parsed = toUrl(url);
      const value = parsed.searchParams.get(param);
      return value && value.length > 0 ? value : null;
    },

    buildUrl(pageId, baseUrl) {
      const parsed = toUrl(baseUrl ?? (typeof window !== 'undefined' ? window.location.href : '/'));
      parsed.searchParams.set(param, pageId);
      return formatUrl(parsed);
    },

    clearUrl(baseUrl) {
      const parsed = toUrl(baseUrl ?? (typeof window !== 'undefined' ? window.location.href : '/'));
      parsed.searchParams.delete(param);
      return formatUrl(parsed);
    },
  };
}

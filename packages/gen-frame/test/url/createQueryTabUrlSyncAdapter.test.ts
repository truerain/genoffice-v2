/**
 * @file packages/gen-frame/test/url/createQueryTabUrlSyncAdapter.test.ts
 * @description Tests for createQueryTabUrlSyncAdapter.
 * @created 2026-06-29
 */
import { describe, expect, it } from 'vitest';
import { createQueryTabUrlSyncAdapter } from '../../src/url/createQueryTabUrlSyncAdapter';

describe('createQueryTabUrlSyncAdapter', () => {
  const adapter = createQueryTabUrlSyncAdapter({ param: 'tab' });

  it('reads pageId from query tab param', () => {
    expect(adapter.getPageIdFromUrl('http://localhost/app?tab=demo-chart')).toBe('demo-chart');
    expect(adapter.getPageIdFromUrl('http://localhost/')).toBeNull();
  });

  it('builds url with tab param', () => {
    expect(adapter.buildUrl('demo-chart', 'http://localhost/app')).toBe('/app?tab=demo-chart');
  });

  it('roundtrips pageId through buildUrl and getPageIdFromUrl', () => {
    const built = adapter.buildUrl('dashboard', 'http://localhost/?foo=1');
    expect(adapter.getPageIdFromUrl(`http://localhost${built}`)).toBe('dashboard');
  });

  it('clears tab param from url', () => {
    expect(adapter.clearUrl('http://localhost/app?tab=demo-chart&x=1')).toBe('/app?x=1');
  });
});

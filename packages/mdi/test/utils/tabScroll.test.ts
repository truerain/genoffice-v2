/**
 * @file packages/mdi/test/utils/tabScroll.test.ts
 * @description tabScroll helper tests.
 * @created 2026-06-27
 */
import { describe, expect, it, vi } from 'vitest';
import { getTabElementId } from '../../src/utils/tabFocus';
import {
  scrollTabElementIntoTabBar,
  scrollTabIntoTabBar,
  scrollTabIntoTabBarWhenReady,
} from '../../src/utils/tabScroll';

function mockRect(left: number, right: number): DOMRect {
  return {
    left,
    right,
    top: 0,
    bottom: 24,
    width: right - left,
    height: 24,
    x: left,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect;
}

function createTabBarScrollDom(tabId: string, offsetLeft = 0) {
  const scrollContainer = document.createElement('div');
  const tabList = document.createElement('div');
  const tabEl = document.createElement('button');

  tabEl.id = getTabElementId(tabId);
  tabList.appendChild(tabEl);
  scrollContainer.appendChild(tabList);
  document.body.appendChild(scrollContainer);

  Object.defineProperty(tabList, 'offsetLeft', { value: 0, configurable: true });
  Object.defineProperty(tabEl, 'offsetLeft', { value: offsetLeft, configurable: true });

  return { scrollContainer, tabList, tabEl };
}

describe('scrollTabIntoTabBar', () => {
  it('scrolls right when tab extends past container right edge', () => {
    const { scrollContainer, tabEl } = createTabBarScrollDom('far', 350);

    scrollContainer.scrollLeft = 0;
    Object.defineProperty(scrollContainer, 'clientWidth', { value: 100, configurable: true });
    Object.defineProperty(tabEl, 'offsetWidth', { value: 100, configurable: true });
    tabEl.getBoundingClientRect = () => mockRect(350, 450);
    scrollContainer.getBoundingClientRect = () => mockRect(0, 100);

    scrollTabIntoTabBar('far', scrollContainer);

    expect(scrollContainer.scrollLeft).toBe(350);

    document.body.removeChild(scrollContainer);
  });

  it('scrolls left when tab extends past container left edge', () => {
    const { scrollContainer, tabEl } = createTabBarScrollDom('left', 150);

    scrollContainer.scrollLeft = 200;
    Object.defineProperty(scrollContainer, 'clientWidth', { value: 200, configurable: true });
    Object.defineProperty(tabEl, 'offsetWidth', { value: 100, configurable: true });
    tabEl.getBoundingClientRect = () => mockRect(50, 150);
    scrollContainer.getBoundingClientRect = () => mockRect(100, 300);

    scrollTabIntoTabBar('left', scrollContainer);

    expect(scrollContainer.scrollLeft).toBe(150);

    document.body.removeChild(scrollContainer);
  });

  it('scrolls when tab is partially visible on the left (viewport rect nudge)', () => {
    const { scrollContainer, tabEl } = createTabBarScrollDom('partial-left', 320);

    scrollContainer.scrollLeft = 400;
    Object.defineProperty(scrollContainer, 'clientWidth', { value: 200, configurable: true });
    Object.defineProperty(tabEl, 'offsetWidth', { value: 180, configurable: true });
    tabEl.getBoundingClientRect = () => mockRect(20, 200);
    scrollContainer.getBoundingClientRect = () => mockRect(100, 300);

    scrollTabElementIntoTabBar(tabEl, scrollContainer);

    expect(scrollContainer.scrollLeft).toBe(320);

    document.body.removeChild(scrollContainer);
  });

  it('scrolls when tab is partially visible on the right (rect + offsetLeft)', () => {
    const { scrollContainer, tabEl } = createTabBarScrollDom('partial-right', 400);

    scrollContainer.scrollLeft = 350;
    Object.defineProperty(scrollContainer, 'clientWidth', { value: 200, configurable: true });
    Object.defineProperty(tabEl, 'offsetWidth', { value: 180, configurable: true });
    tabEl.getBoundingClientRect = () => mockRect(150, 330);
    scrollContainer.getBoundingClientRect = () => mockRect(100, 300);

    scrollTabElementIntoTabBar(tabEl, scrollContainer);

    expect(scrollContainer.scrollLeft).toBe(380);

    document.body.removeChild(scrollContainer);
  });

  it('scrolls left when clipped tabs collapse getBoundingClientRect at the container edge', () => {
    const { scrollContainer, tabEl } = createTabBarScrollDom('hidden-left', 0);

    scrollContainer.scrollLeft = 500;
    Object.defineProperty(scrollContainer, 'clientWidth', { value: 200, configurable: true });
    Object.defineProperty(tabEl, 'offsetWidth', { value: 180, configurable: true });
    tabEl.getBoundingClientRect = () => mockRect(100, 100);
    scrollContainer.getBoundingClientRect = () => mockRect(100, 300);

    scrollTabIntoTabBar('hidden-left', scrollContainer);

    expect(scrollContainer.scrollLeft).toBe(0);

    document.body.removeChild(scrollContainer);
  });

  it('does not scroll when tab is fully visible', () => {
    const { scrollContainer, tabEl } = createTabBarScrollDom('mid', 120);

    scrollContainer.scrollLeft = 40;
    Object.defineProperty(scrollContainer, 'clientWidth', { value: 300, configurable: true });
    Object.defineProperty(tabEl, 'offsetWidth', { value: 100, configurable: true });
    tabEl.getBoundingClientRect = () => mockRect(120, 220);
    scrollContainer.getBoundingClientRect = () => mockRect(100, 400);

    scrollTabIntoTabBar('mid', scrollContainer);

    expect(scrollContainer.scrollLeft).toBe(40);

    document.body.removeChild(scrollContainer);
  });
});

describe('scrollTabIntoTabBarWhenReady', () => {
  it('retries until tab layout is available', async () => {
    const rafCallbacks: FrameRequestCallback[] = [];
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      rafCallbacks.push(callback);
      return rafCallbacks.length;
    });
    vi.stubGlobal('cancelAnimationFrame', () => {});

    const { scrollContainer, tabEl } = createTabBarScrollDom('late', 350);

    scrollContainer.getBoundingClientRect = () => mockRect(0, 100);
    Object.defineProperty(scrollContainer, 'clientWidth', { value: 100, configurable: true });

    let width = 0;
    Object.defineProperty(tabEl, 'offsetWidth', {
      configurable: true,
      get: () => width,
    });
    tabEl.getBoundingClientRect = () => mockRect(width === 0 ? 0 : 350, width === 0 ? 0 : 450);

    scrollTabIntoTabBarWhenReady('late', scrollContainer, 4);
    expect(scrollContainer.scrollLeft).toBe(0);

    width = 100;
    rafCallbacks.shift()?.(0);

    expect(scrollContainer.scrollLeft).toBe(350);

    document.body.removeChild(scrollContainer);
    vi.unstubAllGlobals();
  });
});

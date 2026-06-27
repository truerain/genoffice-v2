/**
 * @file packages/mdi/src/utils/tabScroll.ts
 * @description Horizontal scroll helpers for MDI tab bar overflow.
 * @created 2026-06-27
 *
 * @remark
 * - Primary: getBoundingClientRect delta (pixel-accurate for partially clipped tabs)
 * - Fallback: offsetLeft content range (fully off-screen / collapsed rect)
 * - syncTabBarScrollToActiveTab: activeTab-driven scroll entry point
 */
import { getTabElementId } from './tabFocus';

const SCROLL_EPSILON = 1;

function getTabContentRange(
  tabEl: HTMLElement,
  scrollContainer: HTMLElement,
): { start: number; end: number } | null {
  const tabWidth = tabEl.offsetWidth;
  if (tabWidth === 0) return null;

  const tabList = tabEl.parentElement;
  if (tabList && tabList.parentElement === scrollContainer) {
    const start = tabList.offsetLeft + tabEl.offsetLeft;
    return { start, end: start + tabWidth };
  }

  const tabRect = tabEl.getBoundingClientRect();
  const containerRect = scrollContainer.getBoundingClientRect();
  const start = tabRect.left - containerRect.left + scrollContainer.scrollLeft;

  return { start, end: start + tabWidth };
}

function isTabFullyVisibleInTabBar(tabEl: HTMLElement, scrollContainer: HTMLElement): boolean {
  if (tabEl.offsetWidth === 0) return false;

  const viewWidth = scrollContainer.clientWidth || scrollContainer.getBoundingClientRect().width;
  if (viewWidth <= 0) return false;

  const tabRect = tabEl.getBoundingClientRect();
  const containerRect = scrollContainer.getBoundingClientRect();

  if (
    tabRect.width > 0 &&
    tabRect.left >= containerRect.left - SCROLL_EPSILON &&
    tabRect.right <= containerRect.right + SCROLL_EPSILON
  ) {
    return true;
  }

  const range = getTabContentRange(tabEl, scrollContainer);
  if (!range) return false;

  const viewStart = scrollContainer.scrollLeft;
  const viewEnd = viewStart + viewWidth;

  return range.start >= viewStart - SCROLL_EPSILON && range.end <= viewEnd + SCROLL_EPSILON;
}

/** Viewport rect delta — correct for partially clipped tabs (borders/subpixel). */
function applyViewportScrollAdjust(tabEl: HTMLElement, scrollContainer: HTMLElement): boolean {
  const tabRect = tabEl.getBoundingClientRect();
  const containerRect = scrollContainer.getBoundingClientRect();

  if (tabRect.width <= 0) return false;

  let adjusted = false;

  if (tabRect.left < containerRect.left - SCROLL_EPSILON) {
    scrollContainer.scrollLeft -= containerRect.left - tabRect.left;
    adjusted = true;
  } else if (tabRect.right > containerRect.right + SCROLL_EPSILON) {
    scrollContainer.scrollLeft += tabRect.right - containerRect.right;
    adjusted = true;
  }

  return adjusted;
}

/** Content offset fallback — when tab rect is collapsed (fully off-screen). */
function applyContentOffsetScroll(tabEl: HTMLElement, scrollContainer: HTMLElement): void {
  const range = getTabContentRange(tabEl, scrollContainer);
  if (!range) return;

  const viewWidth = scrollContainer.clientWidth || scrollContainer.getBoundingClientRect().width;
  const viewStart = scrollContainer.scrollLeft;
  const viewEnd = viewStart + viewWidth;

  if (range.start < viewStart - SCROLL_EPSILON) {
    scrollContainer.scrollLeft = Math.max(0, range.start);
  } else if (range.end > viewEnd + SCROLL_EPSILON) {
    scrollContainer.scrollLeft = Math.max(0, range.end - viewWidth);
  }
}

export function scrollTabElementIntoTabBar(tabEl: HTMLElement, scrollContainer: HTMLElement): boolean {
  if (tabEl.offsetWidth === 0) return false;

  const viewWidth = scrollContainer.clientWidth || scrollContainer.getBoundingClientRect().width;
  if (viewWidth <= 0) return false;

  if (isTabFullyVisibleInTabBar(tabEl, scrollContainer)) {
    return true;
  }

  const adjustedByViewport = applyViewportScrollAdjust(tabEl, scrollContainer);

  if (isTabFullyVisibleInTabBar(tabEl, scrollContainer)) {
    return true;
  }

  if (!adjustedByViewport) {
    applyContentOffsetScroll(tabEl, scrollContainer);
  } else {
    // Second pass after viewport nudge — active styling may still leave a subpixel gap
    applyViewportScrollAdjust(tabEl, scrollContainer);
  }

  return true;
}

export function scrollTabIntoTabBar(tabId: string, scrollContainer: HTMLElement): boolean {
  const tabEl = document.getElementById(getTabElementId(tabId));
  if (!tabEl) return false;

  return scrollTabElementIntoTabBar(tabEl, scrollContainer);
}

function scrollWhenReady(scroll: () => boolean, maxAttempts = 8): () => void {
  let attempts = 0;
  let frameId = 0;

  const run = () => {
    if (scroll() || attempts >= maxAttempts) return;
    attempts += 1;
    frameId = requestAnimationFrame(run);
  };

  if (scroll()) {
    return () => {};
  }

  frameId = requestAnimationFrame(run);

  return () => {
    if (frameId) cancelAnimationFrame(frameId);
  };
}

export function scrollTabIntoTabBarWhenReady(
  tabId: string,
  scrollContainer: HTMLElement,
  maxAttempts = 8,
): () => void {
  return scrollWhenReady(() => scrollTabIntoTabBar(tabId, scrollContainer), maxAttempts);
}

export function scrollTabElementIntoTabBarWhenReady(
  tabEl: HTMLElement,
  scrollContainer: HTMLElement,
  maxAttempts = 8,
): () => void {
  return scrollWhenReady(() => scrollTabElementIntoTabBar(tabEl, scrollContainer), maxAttempts);
}

/** activeTabId 기준 tab bar scroll — TabBar·hook 공통 진입점 */
export function syncTabBarScrollToActiveTab(
  activeTabId: string | null | undefined,
  scrollContainer: HTMLElement | null,
): () => void {
  if (!activeTabId || !scrollContainer) {
    return () => {};
  }

  return scrollTabIntoTabBarWhenReady(activeTabId, scrollContainer);
}

/**
 * @file packages/mdi/src/utils/tabFocus.ts
 * @description DOM focus helpers for MDI tab elements.
 * @created 2026-06-27
 */
export function getTabElementId(tabId: string): string {
  return `tab-${tabId}`;
}

export function focusTabById(tabId: string | null | undefined): void {
  if (!tabId) return;
  document.getElementById(getTabElementId(tabId))?.focus();
}

/**
 * @file packages/mdi/src/utils/tabListKeyboard.ts
 * @description WAI-ARIA tabs keyboard index resolution (horizontal tablist).
 * @created 2026-06-27
 */
const TABLIST_KEYS = new Set(['ArrowRight', 'ArrowLeft', 'Home', 'End']);

export function isTabListNavigationKey(key: string): boolean {
  return TABLIST_KEYS.has(key);
}

export function resolveNextTabIndex(
  currentIndex: number,
  tabCount: number,
  key: string,
): number | null {
  if (tabCount === 0 || currentIndex < 0) return null;

  switch (key) {
    case 'ArrowRight':
      return (currentIndex + 1) % tabCount;
    case 'ArrowLeft':
      return (currentIndex - 1 + tabCount) % tabCount;
    case 'Home':
      return 0;
    case 'End':
      return tabCount - 1;
    default:
      return null;
  }
}

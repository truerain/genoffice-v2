/**
 * @file packages/ui/src/composed/datePicker/multiSelectionDisplay.ts
 * @description Shared field label / title helpers for multi date and month pickers.
 * @created 2026-07-29
 *
 * @remark
 * - Default overflow: `{first} +{n} more` when count exceeds summaryThreshold (2)
 * - title always carries the full joined list for native tooltip
 */

export const DEFAULT_SUMMARY_THRESHOLD = 2;

export function joinFormattedItems(items: Date[], formatItem: (date: Date) => string) {
  return items.map(formatItem).join(', ');
}

export function formatMultiSelectionDisplay(
  items: Date[],
  options: {
    summaryThreshold?: number;
    formatItem: (date: Date) => string;
    formatSummary?: (firstLabel: string, restCount: number) => string;
  }
): { label: string; title?: string } {
  if (!items.length) return { label: '' };

  const threshold = options.summaryThreshold ?? DEFAULT_SUMMARY_THRESHOLD;
  const fullList = joinFormattedItems(items, options.formatItem);
  const formatSummary =
    options.formatSummary ?? ((firstLabel, restCount) => `${firstLabel} +${restCount} more`);

  const label =
    items.length > threshold
      ? formatSummary(options.formatItem(items[0]), items.length - 1)
      : fullList;

  return { label, title: fullList };
}

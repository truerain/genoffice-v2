/**
 * @file packages/ui/src/core/tree/Tree.types.ts
 * @description Public types for Tree component.
 * @created 2026-06-24
 */
import type * as React from 'react';

export type TreeId = string | number;

export type TreeProps<TItem> = {
  data: readonly TItem[];

  getId?: (item: TItem) => TreeId;
  getParentId?: (item: TItem) => TreeId | null | undefined;
  getLabel?: (item: TItem) => React.ReactNode;

  expandedIds?: readonly TreeId[];
  defaultExpandedIds?: readonly TreeId[];
  onExpandedIdsChange?: (next: TreeId[]) => void;

  selectedId?: TreeId;
  onSelect?: (item: TItem) => void;

  indent?: number;
  className?: string;
};

/**
 * @file packages/ui/src/composed/treeView/TreeView.types.ts
 * @description Public props for TreeView panel component.
 * @created 2026-06-25
 *
 * @remark
 * - Exports: TreeViewProps, TreeViewId
 * - Extends core TreeProps with panel chrome (title, expand/collapse all)
 */
import type * as React from 'react';
import type { TreeId, TreeProps } from '../../core/tree';

export type TreeViewProps<TItem> = TreeProps<TItem> & {
  title?: React.ReactNode;
  showControls?: boolean;
  expandAllAriaLabel?: string;
  collapseAllAriaLabel?: string;
  className?: string;
  treeClassName?: string;
};

export type TreeViewId = TreeId;

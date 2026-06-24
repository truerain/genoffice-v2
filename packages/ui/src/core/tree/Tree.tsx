/**
 * @file packages/ui/src/core/tree/Tree.tsx
 * @description Flat-data hierarchical tree with expand/collapse and selection.
 * @created 2026-06-24
 */
import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import type { TreeId, TreeProps } from './Tree.types';
import styles from './Tree.module.css';

type TreeState<TItem> = {
  rootIds: TreeId[];
  nodesById: Map<TreeId, TItem>;
  childrenById: Map<TreeId, TreeId[]>;
};

function buildTree<TItem>(
  data: readonly TItem[],
  getId: (item: TItem) => TreeId,
  getParentId: (item: TItem) => TreeId | null | undefined
): TreeState<TItem> {
  const nodesById = new Map<TreeId, TItem>();
  const parentById = new Map<TreeId, TreeId | null | undefined>();
  const childrenById = new Map<TreeId, TreeId[]>();
  const rootIds: TreeId[] = [];

  for (const item of data) {
    const id = getId(item);
    nodesById.set(id, item);
    parentById.set(id, getParentId(item));
  }

  for (const item of data) {
    const id = getId(item);
    const parentId = parentById.get(id);
    if (parentId == null || !nodesById.has(parentId)) {
      rootIds.push(id);
      continue;
    }
    const list = childrenById.get(parentId);
    if (list) list.push(id);
    else childrenById.set(parentId, [id]);
  }

  return { rootIds, nodesById, childrenById };
}

export function Tree<TItem>(props: TreeProps<TItem>) {
  const {
    data,
    getId = (item: any) => item.id,
    getParentId = (item: any) => item.parent_id,
    getLabel = (item: any) => item.label,
    expandedIds,
    defaultExpandedIds,
    onExpandedIdsChange,
    selectedId,
    onSelect,
    indent = 16,
    className,
  } = props;

  const { rootIds, nodesById, childrenById } = React.useMemo(
    () => buildTree(data, getId, getParentId),
    [data, getId, getParentId]
  );

  const [uncontrolledExpanded, setUncontrolledExpanded] = React.useState<Set<TreeId>>(
    () => new Set(defaultExpandedIds ?? [])
  );

  const isControlled = expandedIds !== undefined;
  const expandedSet = React.useMemo(() => {
    return isControlled ? new Set(expandedIds) : uncontrolledExpanded;
  }, [expandedIds, isControlled, uncontrolledExpanded]);

  const setExpanded = React.useCallback(
    (next: Set<TreeId>) => {
      if (!isControlled) setUncontrolledExpanded(new Set(next));
      onExpandedIdsChange?.(Array.from(next));
    },
    [isControlled, onExpandedIdsChange]
  );

  const toggle = React.useCallback(
    (id: TreeId) => {
      const next = new Set(expandedSet);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setExpanded(next);
    },
    [expandedSet, setExpanded]
  );

  const renderNode = (id: TreeId, depth: number): React.ReactNode => {
    const node = nodesById.get(id);
    if (!node) return null;

    const children = childrenById.get(id) ?? [];
    const hasChildren = children.length > 0;
    const isExpanded = expandedSet.has(id);
    const label = getLabel(node);
    const isSelected = selectedId != null && String(selectedId) === String(id);

    const itemStyle = { ['--tree-depth' as string]: depth } as React.CSSProperties;

    return (
      <li
        key={String(id)}
        className={styles.item}
        style={itemStyle}
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
      >
        <div className={styles.row}>
          {hasChildren ? (
            <button
              type="button"
              className={styles.toggle}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
              aria-expanded={isExpanded}
              onClick={() => toggle(id)}
            >
              <ChevronRight
                className={clsx(styles.chevron, isExpanded && styles.chevronExpanded)}
              />
            </button>
          ) : (
            <span className={styles.leafBullet} aria-hidden="true">
              &bull;
            </span>
          )}
          <button
            type="button"
            className={clsx(styles.label, isSelected && styles.labelSelected)}
            aria-selected={isSelected}
            onClick={() => onSelect?.(node)}
          >
            {label}
          </button>
        </div>
        {hasChildren && isExpanded ? (
          <ul className={styles.children} role="group">
            {children.map((childId) => renderNode(childId, depth + 1))}
          </ul>
        ) : null}
      </li>
    );
  };

  const rootStyle = {
    ['--tree-indent' as string]: `${indent}px`,
  } as React.CSSProperties;

  return (
    <div
      className={clsx(styles.root, className)}
      style={rootStyle}
    >
      <ul className={styles.list} role="tree">
        {rootIds.map((id) => renderNode(id, 0))}
      </ul>
    </div>
  );
}

/**
 * @file packages/ui/src/composed/treeView/TreeView.tsx
 * @description Panel chrome around core Tree — title, expand/collapse all, scroll body.
 * @created 2026-06-25
 *
 * @remark
 * - Exports: TreeView
 * - Wraps core Tree; forwards TreeProps except panel-specific props
 * - Parent must provide height (flex chain min-height: 0) for full panel fill
 */
import * as React from 'react';
import { clsx } from 'clsx';
import { ListChevronsDownUp, ListChevronsUpDown } from 'lucide-react';
import { Button } from '../../core/button';
import { Tree } from '../../core/tree';
import type { TreeId } from '../../core/tree';
import type { TreeViewProps } from './TreeView.types';
import styles from './TreeView.module.css';

function collectExpandableIds<TItem>(
  data: readonly TItem[],
  getId: (item: TItem) => TreeId,
  getParentId: (item: TItem) => TreeId | null | undefined
) {
  const childrenById = new Map<TreeId, number>();
  const nodesById = new Set<TreeId>();

  for (const item of data) {
    nodesById.add(getId(item));
  }

  for (const item of data) {
    const parentId = getParentId(item);
    if (parentId == null || !nodesById.has(parentId)) continue;
    childrenById.set(parentId, (childrenById.get(parentId) ?? 0) + 1);
  }

  return Array.from(childrenById.keys());
}

export function TreeView<TItem>(props: TreeViewProps<TItem>) {
  const {
    data,
    title = 'Tree',
    showControls = true,
    expandAllAriaLabel = 'Expand all',
    collapseAllAriaLabel = 'Collapse all',
    expandedIds: expandedIdsProp,
    selectedId: selectedIdProp,
    onSelect: onSelectProp,
    defaultExpandedIds,
    onExpandedIdsChange,
    className,
    treeClassName,
    getId = (item: any) => item.id,
    getParentId = (item: any) => item.parent_id,
    ...rest
  } = props;

  const isControlled = expandedIdsProp !== undefined;
  const [expandedIdsState, setExpandedIdsState] = React.useState<TreeId[]>(
    () => (defaultExpandedIds ? Array.from(defaultExpandedIds) : [])
  );
  const expandedIds = isControlled ? expandedIdsProp! : expandedIdsState;

  const setExpanded = React.useCallback(
    (next: TreeId[]) => {
      if (!isControlled) setExpandedIdsState(next);
      onExpandedIdsChange?.(next);
    },
    [isControlled, onExpandedIdsChange]
  );

  const expandableIds = React.useMemo(
    () => collectExpandableIds(data, getId, getParentId),
    [data, getId, getParentId]
  );

  const isSelectedControlled = selectedIdProp !== undefined;
  const [selectedIdState, setSelectedIdState] = React.useState<TreeId | undefined>(
    () => selectedIdProp
  );
  const selectedId = isSelectedControlled ? selectedIdProp : selectedIdState;

  const handleSelect = React.useCallback(
    (item: TItem) => {
      if (!isSelectedControlled) setSelectedIdState(getId(item));
      onSelectProp?.(item);
    },
    [getId, isSelectedControlled, onSelectProp]
  );

  const handleExpandAll = React.useCallback(() => {
    setExpanded(expandableIds);
  }, [expandableIds, setExpanded]);

  const handleCollapseAll = React.useCallback(() => {
    setExpanded([]);
  }, [setExpanded]);

  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        {showControls ? (
          <div className={styles.actions}>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className={styles.actionButton}
              aria-label={expandAllAriaLabel}
              onClick={handleExpandAll}
            >
              <ListChevronsUpDown size={16} aria-hidden={true} />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className={styles.actionButton}
              aria-label={collapseAllAriaLabel}
              onClick={handleCollapseAll}
            >
              <ListChevronsDownUp size={16} aria-hidden={true} />
            </Button>
          </div>
        ) : null}
      </div>
      <div className={styles.body}>
        <Tree
          {...rest}
          data={data}
          className={clsx(styles.tree, treeClassName)}
          expandedIds={expandedIds}
          onExpandedIdsChange={setExpanded}
          selectedId={selectedId}
          onSelect={handleSelect}
          getId={getId}
          getParentId={getParentId}
        />
      </div>
    </div>
  );
}

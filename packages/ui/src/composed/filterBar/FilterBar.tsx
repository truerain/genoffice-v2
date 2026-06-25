/**
 * @file packages/ui/src/composed/filterBar/FilterBar.tsx
 * @description Compound layout for filter fields (grid) and optional actions column.
 * @created 2026-06-25
 *
 * @remark
 * - collapseToggle: border (default) | actions-icon — chevron on bottom border edge
 */
import { createContext, useContext } from 'react';
import { clsx } from 'clsx';
import type { FilterBarCollapseToggle, FilterBarItemLayout, FilterBarItemProps, FilterBarProps } from './FilterBar.types';
import { FilterBarCollapseToggle as CollapseToggleButton } from './FilterBarCollapseToggle';
import {
  countCompoundChildren,
  countSimpleMarkedChildren,
  DEFAULT_COLLAPSED_COUNT,
  filterCompoundChildrenForCollapse,
  shouldShowCollapseToggle,
  useFilterBarExpanded,
} from './filterBarCollapse';
import { resolveFilterItemSize } from './resolveFilterItemSize';
import styles from './FilterBar.module.css';

export type {
  FilterBarActionsPlacement,
  FilterBarCollapseOptions,
  FilterBarCollapseToggle,
  FilterBarFieldSize,
  FilterBarItemLayout,
  FilterBarItemProps,
  FilterBarProps,
} from './FilterBar.types';

const FilterBarItemLayoutContext = createContext<FilterBarItemLayout>('vertical');

function resolveCollapseToggle(
  collapseToggle: FilterBarProps['collapseToggle'],
  actionsPlacement: FilterBarProps['actionsPlacement']
): FilterBarCollapseToggle {
  if (collapseToggle === 'actions-icon') return 'actions-icon';
  if (collapseToggle === 'divider' || collapseToggle === 'border') return 'border';
  return actionsPlacement === 'inline' ? 'actions-icon' : 'border';
}

export function FilterBar({
  children,
  actions,
  className,
  itemLayout = 'vertical',
  actionsPlacement = 'column',
  borderedPanel = false,
  collapsible = false,
  collapsedCount = DEFAULT_COLLAPSED_COUNT,
  defaultExpanded = false,
  expanded: expandedProp,
  onExpandedChange,
  collapseToggle: collapseToggleProp,
  expandLabel = '상세',
  collapseLabel = '간단히',
}: FilterBarProps) {
  const collapseToggle = resolveCollapseToggle(collapseToggleProp, actionsPlacement);

  const { expanded, setExpanded } = useFilterBarExpanded({
    defaultExpanded,
    expanded: expandedProp,
    onExpandedChange,
  });

  const totalCount = countCompoundChildren(children);
  const simpleMarkedCount = countSimpleMarkedChildren(children);
  const showToggle = shouldShowCollapseToggle(
    totalCount,
    collapsedCount,
    collapsible,
    simpleMarkedCount
  );
  const visibleChildren = showToggle
    ? filterCompoundChildrenForCollapse(children, expanded, collapsedCount)
    : children;

  const handleToggle = () => setExpanded(!expanded);

  const collapseToggleNode = showToggle ? (
    <CollapseToggleButton
      expanded={expanded}
      onToggle={handleToggle}
      expandLabel={expandLabel}
      collapseLabel={collapseLabel}
      variant={collapseToggle === 'actions-icon' ? 'icon' : 'pill'}
    />
  ) : null;

  const fields = <div className={styles.filterFields}>{visibleChildren}</div>;

  const actionToggle =
    showToggle && collapseToggle === 'actions-icon' ? collapseToggleNode : null;

  const actionNode =
    actions || actionToggle ? (
      <div
        className={
          actionsPlacement === 'inline' ? styles.filterActionsInline : styles.filterActionsColumn
        }
      >
        {actionToggle}
        {actions}
      </div>
    ) : null;

  const useBottomEdgeToggle = showToggle && collapseToggle === 'border';

  const bottomEdgeToggle = useBottomEdgeToggle ? (
    <div className={styles.filterCollapseBorder}>{collapseToggleNode}</div>
  ) : null;

  return (
    <FilterBarItemLayoutContext.Provider value={itemLayout}>
      <div
        className={clsx(
          styles.filterBar,
          useBottomEdgeToggle && styles.filterBarHasBorderToggle,
          useBottomEdgeToggle && !borderedPanel && styles.filterBarBorderlessBottom,
          className
        )}
      >
        {actionsPlacement === 'inline' ? (
          <div className={styles.filterRowInline}>
            {fields}
            {actionNode}
          </div>
        ) : (
          <div className={styles.filterBarMain}>
            {fields}
            {actionNode}
          </div>
        )}
        {bottomEdgeToggle}
      </div>
    </FilterBarItemLayoutContext.Provider>
  );
}

FilterBar.Item = function FilterBarItem({
  label,
  children,
  size,
  flex,
  width,
  className,
  layout,
}: FilterBarItemProps) {
  const defaultLayout = useContext(FilterBarItemLayoutContext);
  const resolvedLayout = layout ?? defaultLayout;
  const { sizeClass, style } = resolveFilterItemSize({ size, flex, width });

  return (
    <div
      className={clsx(
        styles.filterItem,
        sizeClass,
        resolvedLayout === 'horizontal' && styles.filterItemHorizontal,
        className
      )}
      style={style}
    >
      {label ? <div className={styles.filterItemLabel}>{label}</div> : null}
      <div className={styles.filterItemControl}>{children}</div>
    </div>
  );
};

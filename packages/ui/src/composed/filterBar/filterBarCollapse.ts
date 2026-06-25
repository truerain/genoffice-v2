/**
 * @file packages/ui/src/composed/filterBar/filterBarCollapse.ts
 * @description Helpers for FilterBar simple/detail (collapsed) field visibility.
 * @created 2026-06-25
 */
import {
  Children,
  isValidElement,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import type { FilterBarCollapseOptions, FilterBarItemProps } from './FilterBar.types';

export type { FilterBarCollapseOptions } from './FilterBar.types';

export const DEFAULT_COLLAPSED_COUNT = 3;

export function shouldShowCollapseToggle(
  totalCount: number,
  collapsedCount: number,
  collapsible: boolean,
  simpleMarkedCount: number
): boolean {
  if (!collapsible) return false;
  if (simpleMarkedCount > 0) return simpleMarkedCount < totalCount;
  return totalCount > collapsedCount;
}

export function filterFieldsForCollapse<T extends { simple?: boolean }>(
  fields: T[],
  expanded: boolean,
  collapsedCount: number
): T[] {
  if (expanded) return fields;

  const simpleMarked = fields.filter((field) => field.simple === true);
  if (simpleMarked.length > 0) return simpleMarked;

  return fields.slice(0, collapsedCount);
}

export function filterCompoundChildrenForCollapse(
  children: ReactNode,
  expanded: boolean,
  collapsedCount: number
): ReactNode[] {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<FilterBarItemProps>[];

  if (expanded) return items;

  const simpleMarked = items.filter((item) => item.props.simple === true);
  if (simpleMarked.length > 0) return simpleMarked;

  return items.slice(0, collapsedCount);
}

export function countSimpleMarkedChildren(children: ReactNode): number {
  return Children.toArray(children).filter(
    (child) => isValidElement<FilterBarItemProps>(child) && child.props.simple === true
  ).length;
}

export function countCompoundChildren(children: ReactNode): number {
  return Children.toArray(children).filter(isValidElement).length;
}

export function useFilterBarExpanded({
  defaultExpanded = false,
  expanded: expandedProp,
  onExpandedChange,
}: Pick<FilterBarCollapseOptions, 'defaultExpanded' | 'expanded' | 'onExpandedChange'>) {
  const [expandedState, setExpandedState] = useState(defaultExpanded);
  const expanded = expandedProp ?? expandedState;

  const setExpanded = (next: boolean) => {
    onExpandedChange?.(next);
    if (expandedProp === undefined) setExpandedState(next);
  };

  return { expanded, setExpanded };
}

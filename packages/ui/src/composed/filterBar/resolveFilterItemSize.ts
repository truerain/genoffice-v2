/**
 * @file packages/ui/src/composed/filterBar/resolveFilterItemSize.ts
 * @description Maps FilterBar.Item size presets and legacy flex/width to layout classes.
 * @created 2026-06-25
 */
import type { CSSProperties } from 'react';
import type { FilterBarFieldSize, FilterBarItemProps } from './FilterBar.types';
import styles from './FilterBar.module.css';

const SIZE_CLASS: Record<FilterBarFieldSize, string> = {
  xs: styles.filterItemSizeXs,
  sm: styles.filterItemSizeSm,
  md: styles.filterItemSizeMd,
  lg: styles.filterItemSizeLg,
  xl: styles.filterItemSizeXl,
  fill: styles.filterItemSizeFill,
};

export function resolveFilterItemSize({
  size,
  flex,
  width,
}: Pick<FilterBarItemProps, 'size' | 'flex' | 'width'>): {
  sizeClass: string;
  style: CSSProperties;
} {
  if (size) {
    return { sizeClass: SIZE_CLASS[size], style: {} };
  }

  const style: CSSProperties = {};

  if (width !== undefined) {
    style.width = width;
    style.minWidth = width;
    style.maxWidth = '100%';
  }

  if (flex !== undefined && flex > 0 && width === undefined) {
    return { sizeClass: SIZE_CLASS.fill, style: {} };
  }

  if (width !== undefined || flex !== undefined) {
    return { sizeClass: styles.filterItemLegacy, style };
  }

  return { sizeClass: SIZE_CLASS.md, style: {} };
}

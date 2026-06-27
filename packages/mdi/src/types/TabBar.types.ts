/**
 * @file packages/mdi/src/types/TabBar.types.ts
 * @description Public props and i18n labels for TabBar.
 * @created 2026-06-27
 */
import type { TabPosition } from './mdi.types';

export interface TabBarLabels {
  close?: string;
  closeOthers?: string;
  closeAll?: string;
}

export const DEFAULT_TAB_BAR_LABELS: Required<TabBarLabels> = {
  close: 'Close',
  closeOthers: 'Close Others',
  closeAll: 'Close All',
};

export interface TabBarProps {
  position: TabPosition;
  labels?: TabBarLabels;
  className?: string;
}

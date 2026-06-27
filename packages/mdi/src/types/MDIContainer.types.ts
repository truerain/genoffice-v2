/**
 * @file packages/mdi/src/types/MDIContainer.types.ts
 * @description Public props for MDIContainer.
 * @created 2026-06-27
 */
import type { ReactNode } from 'react';
import type { TabBarLabels } from './TabBar.types';
import type { TabPosition } from './mdi.types';

export interface MDIContainerProps {
  maxTabs?: number;
  tabPosition?: TabPosition;
  emptyContent?: ReactNode;
  onMaxTabsReached?: () => void;
  /** TabBar 컨텍스트 메뉴 라벨 (i18n) */
  tabBarLabels?: TabBarLabels;
  className?: string;
}

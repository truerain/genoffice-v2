/**
 * @file packages/gen-frame/src/types/host.types.ts
 * @description Page host component props (Gate F3).
 * @created 2026-06-29
 *
 * @remark
 *
 */

import type { ReactNode } from 'react';
import type { TabBarLabels } from '@gen-office/mdi';
import type { SinglePageState } from './navigation.types';

export type MdiTabPosition = 'top' | 'bottom';

export interface MdiPageHostProps {
  maxTabs?: number;
  tabPosition?: MdiTabPosition;
  tabBarLabels?: TabBarLabels;
  emptyContent?: ReactNode;
  onMaxTabsReached?: () => void;
  className?: string;
}

export interface SinglePageHostProps {
  page: SinglePageState | null;
  emptyContent?: ReactNode;
  className?: string;
}

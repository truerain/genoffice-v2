/**
 * @file packages/ui/src/composed/pageLayout/PageLayout.types.ts
 * @description Public types for PageLayout and PageHeader.
 * @created 2026-07-01
 *
 * @remark
 * - Parent (MDI tab panel) should provide flex height chain with min-height: 0
 *
 */

import type { ReactNode } from 'react';

export type PageLayoutContentVariant = 'scroll' | 'fill';

export interface PageLayoutProps {
  header?: ReactNode;
  filter?: ReactNode;
  children: ReactNode;
  /** `fill` — grid/chart height chain (overflow hidden). Default `scroll`. */
  contentVariant?: PageLayoutContentVariant;
  className?: string;
}

export interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/**
 * @file packages/ui/src/composed/pageLayout/index.ts
 * @description Barrel exports for PageLayout page chrome.
 * @created 2026-07-01
 * @updated 2026-07-20
 *
 * @remark
 * - Public: PageLayout, PageHeader, PageLayoutChromeProvider, usePageLayoutChrome
 * - Types: PageLayoutProps, PageHeaderProps, PageLayoutChromeValue, PageLayoutChromeProviderProps
 *
 */

export { PageLayout } from './PageLayout';
export { PageHeader } from './PageHeader';
export {
  PageLayoutChromeProvider,
  usePageLayoutChrome,
} from './PageLayoutChrome';
export type {
  PageLayoutChromeProviderProps,
  PageLayoutChromeValue,
} from './PageLayoutChrome';
export type {
  PageHeaderProps,
  PageLayoutContentVariant,
  PageLayoutProps,
} from './PageLayout.types';

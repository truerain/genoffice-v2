/**
 * @file packages/ui/src/composed/pageLayout/PageLayoutChrome.tsx
 * @description App-level chrome preferences for PageLayout (header visibility).
 * @created 2026-07-20
 *
 * @remark
 * - Public: PageLayoutChromeProvider, usePageLayoutChrome
 * - Default showHeader=true when no provider is present
 * - PageLayout skips the header slot when showHeader is false; filter/content stay
 *
 */

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

export interface PageLayoutChromeValue {
  showHeader: boolean;
}

export interface PageLayoutChromeProviderProps {
  showHeader: boolean;
  children: ReactNode;
}

const DEFAULT_CHROME: PageLayoutChromeValue = { showHeader: true };

const PageLayoutChromeContext = createContext<PageLayoutChromeValue>(DEFAULT_CHROME);

export function PageLayoutChromeProvider({
  showHeader,
  children,
}: PageLayoutChromeProviderProps) {
  const value = useMemo(() => ({ showHeader }), [showHeader]);
  return (
    <PageLayoutChromeContext.Provider value={value}>
      {children}
    </PageLayoutChromeContext.Provider>
  );
}

export function usePageLayoutChrome(): PageLayoutChromeValue {
  return useContext(PageLayoutChromeContext);
}

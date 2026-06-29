/**
 * @file apps/demo/src/app/navigation/DemoNavigationContext.tsx
 * @description Open MDI pages from tab content (in-app, no URL reload).
 * @created 2026-06-29
 *
 * @remark
 * - Exports: DemoNavigationProvider, useDemoNavigation
 *
 */

import { createContext, useContext, type ReactNode } from 'react';

export interface DemoNavigationContextValue {
  openMenuByPageId: (pageId: string) => void;
}

const DemoNavigationContext = createContext<DemoNavigationContextValue | null>(null);

export function DemoNavigationProvider({
  openMenuByPageId,
  children,
}: DemoNavigationContextValue & { children: ReactNode }) {
  return (
    <DemoNavigationContext.Provider value={{ openMenuByPageId }}>
      {children}
    </DemoNavigationContext.Provider>
  );
}

export function useDemoNavigation(): DemoNavigationContextValue {
  const context = useContext(DemoNavigationContext);
  if (!context) {
    throw new Error('useDemoNavigation must be used within DemoNavigationProvider');
  }
  return context;
}

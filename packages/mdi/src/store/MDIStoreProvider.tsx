/**
 * @file packages/mdi/src/store/MDIStoreProvider.tsx
 * @description Isolated MDI Zustand store per React subtree (Storybook Docs, multi-pane).
 * @created 2026-06-27
 */
import { useState, type ReactNode } from 'react';
import { createMDIStore, MDIStoreContext } from './mdiStore';

export type MDIStoreProviderProps = {
  children: ReactNode;
};

export function MDIStoreProvider({ children }: MDIStoreProviderProps) {
  const [store] = useState(() => createMDIStore());

  return <MDIStoreContext.Provider value={store}>{children}</MDIStoreContext.Provider>;
}

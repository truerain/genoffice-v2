/**
 * @file packages/mdi/src/store/mdiStore.ts
 * @description Zustand store for MDI tab state and actions.
 * @created 2026-06-27
 *
 * @remark
 * - defaultMDIStore: demo·tests (singleton)
 * - MDIStoreProvider + createMDIStore: Storybook Docs 등 인스턴스 격리
 */
import { createContext, useContext } from 'react';
import { createStore, type StoreApi } from 'zustand';
import { useStore } from 'zustand';
import type { MDIStore } from '../types';
import { createMdiStoreState } from './createMdiStoreState';

export const MDIStoreContext = createContext<StoreApi<MDIStore> | null>(null);

export function createMDIStore(): StoreApi<MDIStore> {
  return createStore(createMdiStoreState);
}

export const defaultMDIStore = createMDIStore();

function useMDIStoreApi(): StoreApi<MDIStore> {
  return useContext(MDIStoreContext) ?? defaultMDIStore;
}

export { useMDIStoreApi };

function useMDIStoreHook<T>(selector: (state: MDIStore) => T): T {
  return useStore(useMDIStoreApi(), selector);
}

type UseMDIStore = typeof useMDIStoreHook & Pick<StoreApi<MDIStore>, 'getState' | 'setState' | 'subscribe'>;

export const useMDIStore = Object.assign(useMDIStoreHook, {
  getState: defaultMDIStore.getState.bind(defaultMDIStore),
  setState: defaultMDIStore.setState.bind(defaultMDIStore),
  subscribe: defaultMDIStore.subscribe.bind(defaultMDIStore),
}) as UseMDIStore;

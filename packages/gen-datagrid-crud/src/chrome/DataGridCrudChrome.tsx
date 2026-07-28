/**
 * @file packages/gen-datagrid-crud/src/chrome/DataGridCrudChrome.tsx
 * @description App-level chrome preferences for GenDataGridCrud ActionBar.
 * @created 2026-07-20
 *
 * @remark
 * - Public: DataGridCrudChromeProvider, useDataGridCrudChrome
 * - Default buttonMode=label when no provider is present
 * - DataGridCrudActionBar: options.buttonMode overrides context
 *
 */

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

import type { DataGridCrudActionBarButtonMode } from '../GenDataGridCrud.types';

export interface DataGridCrudChromeValue {
  buttonMode: DataGridCrudActionBarButtonMode;
}

export interface DataGridCrudChromeProviderProps {
  buttonMode: DataGridCrudActionBarButtonMode;
  children: ReactNode;
}

const DEFAULT_CHROME: DataGridCrudChromeValue = { buttonMode: 'label' };

const DataGridCrudChromeContext = createContext<DataGridCrudChromeValue>(DEFAULT_CHROME);

export function DataGridCrudChromeProvider({
  buttonMode,
  children,
}: DataGridCrudChromeProviderProps) {
  const value = useMemo(() => ({ buttonMode }), [buttonMode]);
  return (
    <DataGridCrudChromeContext.Provider value={value}>
      {children}
    </DataGridCrudChromeContext.Provider>
  );
}

export function useDataGridCrudChrome(): DataGridCrudChromeValue {
  return useContext(DataGridCrudChromeContext);
}

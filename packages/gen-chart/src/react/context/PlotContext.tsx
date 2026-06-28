/**
 * @file packages/gen-chart/src/react/context/PlotContext.tsx
 * @description Plot-area React context for cartesian SVG layers.
 * @created 2026-06-27
 *
 * @remark
 * - Exports: PlotContext, PlotContextProvider, usePlotContext
 */

import { createContext, useContext, type ReactNode } from 'react';
import type { PlotArea } from '../../types/model';

export interface PlotContextValue {
  plotArea: PlotArea;
  width: number;
  height: number;
}

const PlotContext = createContext<PlotContextValue | null>(null);

export interface PlotContextProviderProps {
  value: PlotContextValue;
  children: ReactNode;
}

export function PlotContextProvider({ value, children }: PlotContextProviderProps) {
  return <PlotContext.Provider value={value}>{children}</PlotContext.Provider>;
}

export function usePlotContext(): PlotContextValue {
  const context = useContext(PlotContext);
  if (!context) {
    throw new Error('usePlotContext must be used within CartesianChart');
  }
  return context;
}

export { PlotContext };

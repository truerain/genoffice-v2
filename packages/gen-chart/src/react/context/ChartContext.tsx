/**
 * @file packages/gen-chart/src/react/context/ChartContext.tsx
 * @description Chart-level React context (model, layout, tokens).
 * @created 2026-06-27
 *
 * @remark
 * - Exports: ChartContext, ChartContextProvider, useChartContext
 */

import { createContext, useContext, type ReactNode } from 'react';
import type { ChartTokens } from '../../types/tokens';
import type { UseGenChartResult } from '../../types/model';

export interface ChartContextValue<TDatum> {
  chart: UseGenChartResult<TDatum>;
  tokens: ChartTokens;
}

const ChartContext = createContext<ChartContextValue<unknown> | null>(null);

export interface ChartContextProviderProps<TDatum> {
  value: ChartContextValue<TDatum>;
  children: ReactNode;
}

export function ChartContextProvider<TDatum>({
  value,
  children,
}: ChartContextProviderProps<TDatum>) {
  return (
    <ChartContext.Provider value={value as ChartContextValue<unknown>}>
      {children}
    </ChartContext.Provider>
  );
}

export function useChartContext<TDatum>(): ChartContextValue<TDatum> {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error('useChartContext must be used within ChartRoot');
  }
  return context as ChartContextValue<TDatum>;
}

export { ChartContext };

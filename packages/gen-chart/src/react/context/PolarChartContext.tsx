/**
 * @file packages/gen-chart/src/react/context/PolarChartContext.tsx
 * @description Polar chart-level React context.
 * @created 2026-06-27
 *
 * @remark
 * - Exports: PolarChartContextProvider, usePolarChartContext
 */

import { createContext, useContext, type ReactNode } from 'react';
import type { UsePolarChartResult } from '../../types/model';
import type { ChartTokens } from '../../types/tokens';

export interface PolarChartContextValue<TDatum> {
  chart: UsePolarChartResult<TDatum>;
  tokens: ChartTokens;
}

const PolarChartContext = createContext<PolarChartContextValue<unknown> | null>(null);

export interface PolarChartContextProviderProps<TDatum> {
  value: PolarChartContextValue<TDatum>;
  children: ReactNode;
}

export function PolarChartContextProvider<TDatum>({
  value,
  children,
}: PolarChartContextProviderProps<TDatum>) {
  return (
    <PolarChartContext.Provider value={value as PolarChartContextValue<unknown>}>
      {children}
    </PolarChartContext.Provider>
  );
}

export function usePolarChartContext<TDatum>(): PolarChartContextValue<TDatum> {
  const context = useContext(PolarChartContext);
  if (!context) {
    throw new Error('usePolarChartContext must be used within PolarChart');
  }
  return context as PolarChartContextValue<TDatum>;
}

export { PolarChartContext };

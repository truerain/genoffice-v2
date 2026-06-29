/**
 * @file packages/gen-frame/src/navigation/useSingleNavigationController.ts
 * @description React hook for single-page NavigationController (Gate F5).
 * @created 2026-06-29
 *
 * @remark
 * - Returns controller + currentPage for SinglePageHost
 *
 */

import { useMemo, useRef, useState } from 'react';
import { createSingleNavigationController } from './createSingleNavigationController';
import type {
  SinglePageState,
  UseSingleNavigationControllerOptions,
  UseSingleNavigationControllerResult,
} from '../types';

export function useSingleNavigationController({
  resolvePage,
}: UseSingleNavigationControllerOptions): UseSingleNavigationControllerResult {
  const [currentPage, setCurrentPage] = useState<SinglePageState | null>(null);
  const pageRef = useRef(currentPage);
  pageRef.current = currentPage;

  const controller = useMemo(
    () =>
      createSingleNavigationController({
        store: {
          getPage: () => pageRef.current,
          setPage: setCurrentPage,
        },
        resolvePage,
      }),
    [resolvePage],
  );

  return useMemo(
    () => ({
      controller,
      currentPage,
    }),
    [controller, currentPage],
  );
}

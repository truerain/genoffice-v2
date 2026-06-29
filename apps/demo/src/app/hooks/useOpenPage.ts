/**
 * @file apps/demo/src/app/hooks/useOpenPage.ts
 * @description Hook to open demo MDI tabs from shell (Gate D1).
 * @created 2026-06-28
 *
 * @remark
 * - Exports: useOpenPage
 *
 */

import { useCallback } from 'react';
import { useMDIStore } from '@gen-office/mdi';
import { createPlaceholderTab } from '../openPage';

export function useOpenPage() {
  const addTab = useMDIStore((state) => state.addTab);

  const openPlaceholder = useCallback(() => {
    addTab(createPlaceholderTab());
  }, [addTab]);

  return { openPlaceholder };
}

/**
 * @file apps/demo/src/app/hooks/useOpenPage.ts
 * @description Hook to open MDI tabs via componentRegistry (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 * - Exports: useOpenPage
 * - openPage / openMenuItem — same pageId re-open activates tab
 *
 */

import { useCallback } from 'react';
import { useMDIStore } from '@gen-office/mdi';
import type { AppMenuItem } from '../menu/menu.types';
import type { OpenPagePayload } from '../config/componentRegistry.types';
import { createPageTab, createTabFromMenuItem, resolveMenuTitle } from '../openPage';
import { useI18n } from '../../i18n';

export function useOpenPage() {
  const addTab = useMDIStore((state) => state.addTab);
  const { locale } = useI18n();

  const openPage = useCallback(
    (payload: OpenPagePayload) => {
      addTab(createPageTab(payload));
    },
    [addTab],
  );

  const openMenuItem = useCallback(
    (item: AppMenuItem) => {
      const title = resolveMenuTitle(item, locale);
      addTab(createTabFromMenuItem(item, title));
    },
    [addTab, locale],
  );

  return { openPage, openMenuItem };
}

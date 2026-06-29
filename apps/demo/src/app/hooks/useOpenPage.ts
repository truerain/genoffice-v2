/**
 * @file apps/demo/src/app/hooks/useOpenPage.ts
 * @description Hook to open MDI tabs via gen-frame NavigationController (Gate F3).
 * @created 2026-06-28
 * @updated 2026-06-29
 *
 * @remark
 * - Exports: useOpenPage
 * - resolveTab stays in demo (componentRegistry)
 *
 * @history
 * - 2026-06-29 F3: useMdiNavigationController from @gen-office/gen-frame
 */

import { useCallback, useMemo } from 'react';
import {
  useMdiNavigationController,
  type FrameOpenPagePayload,
  type MdiTabInput,
} from '@gen-office/gen-frame';
import type { AppMenuItem } from '../menu/menu.types';
import type { OpenPagePayload } from '../config/componentRegistry.types';
import { isComponentName } from '../config/componentRegistry';
import { createPageTab, resolveMenuTitle } from '../openPage';
import { useI18n } from '../../i18n';

export function useOpenPage() {
  const { locale } = useI18n();

  const resolveTab = useCallback((payload: FrameOpenPagePayload): MdiTabInput => {
    const componentName = payload.meta?.componentName;
    if (typeof componentName !== 'string' || !isComponentName(componentName)) {
      throw new Error(`Unknown componentName: ${String(componentName)}`);
    }

    const tab = createPageTab({
      pageId: payload.pageId,
      title: payload.title,
      componentName,
      params: payload.params,
    });

    return {
      id: tab.id,
      title: tab.title,
      content: tab.content,
      closable: tab.closable,
    };
  }, []);

  const controller = useMdiNavigationController({ resolveTab });

  const openPage = useCallback(
    (payload: OpenPagePayload) => {
      controller.open({
        pageId: payload.pageId,
        title: payload.title,
        params: payload.params,
        meta: { componentName: payload.componentName },
      });
    },
    [controller],
  );

  const openMenuItem = useCallback(
    (item: AppMenuItem) => {
      controller.open({
        pageId: item.pageId,
        title: resolveMenuTitle(item, locale),
        meta: {
          componentName: item.componentName,
          path: item.path,
          titleKey: item.titleKey,
        },
      });
    },
    [controller, locale],
  );

  return useMemo(
    () => ({
      openPage,
      openMenuItem,
      controller,
    }),
    [controller, openMenuItem, openPage],
  );
}

/**
 * @file apps/demo/src/app/openPage.tsx
 * @description Build MDI tab payloads from registry (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 * - Exports: createPageTab, resolveMenuTitle
 * - pageId = tab id (duplicate → focus only)
 *
 */

import type { MDITab } from '@gen-office/mdi';
import type { AppMenuItem } from './menu/menu.types';
import { RegistryPageContent } from './config/RegistryPageContent';
import type { OpenPagePayload } from './config/componentRegistry.types';
import { isComponentName } from './config/componentRegistry';
import { resolveMessage, type Locale } from '../i18n';

export function resolveMenuTitle(
  item: Pick<AppMenuItem, 'title' | 'titleKey'>,
  locale: Locale = 'ko',
): string {
  if (item.title) return item.title;
  if (item.titleKey) return resolveMessage(locale, item.titleKey);
  return item.titleKey ?? 'Page';
}

export function createPageTab(payload: OpenPagePayload): MDITab {
  if (!isComponentName(payload.componentName)) {
    throw new Error(`Unknown componentName: ${payload.componentName}`);
  }

  return {
    id: payload.pageId,
    title: payload.title,
    content: (
      <RegistryPageContent
        componentName={payload.componentName}
        params={payload.params}
      />
    ),
    closable: true,
  };
}

export function createTabFromMenuItem(
  item: AppMenuItem,
  title: string,
): MDITab {
  return createPageTab({
    pageId: item.pageId,
    title,
    componentName: item.componentName,
  });
}

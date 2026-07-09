/**
 * @file apps/demo/src/app/openPage.tsx
 * @description Build MDI tab payloads from registry (Gate D2).
 * @created 2026-06-28
 * @updated 2026-06-29
 *
 * @remark
 * - Exports: createPageTab, resolveMenuTitle
 * - pageId = tab id (duplicate → focus only)
 * - Welcome pin policy: AppShell `pinnedPages` → useOpenPage → gen-frame
 *
 * @history
 * - 2026-06-29 pinnedPages in gen-frame (removed createWelcomePinTab)
 */

import type { MDITab } from '@gen-office/mdi';
import type { AppMenuItem } from './menu/menu.types';
import { DEMO_HOME_PAGE_ID } from './menu/demoPageIds';
import { RegistryPageContent } from './config/RegistryPageContent';
import type { OpenPagePayload } from './config/componentRegistry.types';
import { isComponentName } from './config/componentRegistry';
import { resolveMessage, type Locale } from '../i18n';

export function resolveMenuTitle(
  item: Pick<AppMenuItem, 'title' | 'titleEng' | 'titleKey'>,
  locale: Locale = 'ko',
): string {
  if (locale === 'en' && item.titleEng) return item.titleEng;
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
    closable: payload.pageId !== DEMO_HOME_PAGE_ID,
    meta: {
      componentName: payload.componentName,
      params: payload.params,
    },
  };
}

export function createTabFromMenuItem(
  item: AppMenuItem,
  title: string,
): MDITab {
  if (!item.componentName) {
    throw new Error(`Menu item ${item.pageId} has no componentName`);
  }

  return createPageTab({
    pageId: item.pageId,
    title,
    componentName: item.componentName,
    params:
      item.componentName === 'ComingSoonPage'
        ? { title }
        : undefined,
  });
}

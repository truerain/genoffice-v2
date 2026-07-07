/**
 * @file apps/demo/src/app/menu/mapAppMenuToFrame.ts
 * @description Map demo AppMenuItem[] to gen-frame FrameMenuItem[].
 * @created 2026-06-29
 *
 * @remark
 * - componentName stays in meta for registry resolution
 *
 */

import type { FrameMenuItem } from '@gen-office/gen-frame';
import type { Locale } from '../../i18n';
import type { AppMenuItem } from './menu.types';
import { resolveMenuTitle } from '../openPage';

function mapItem(item: AppMenuItem, locale: Locale): FrameMenuItem {
  return {
    id: item.pageId,
    label: resolveMenuTitle(item, locale),
    icon: item.icon,
    children: item.children?.map((child) => mapItem(child, locale)),
    meta: {
      componentName: item.componentName,
      path: item.path,
      titleKey: item.titleKey,
    },
  };
}

export function mapAppMenuToFrameItems(items: AppMenuItem[], locale: Locale): FrameMenuItem[] {
  return items.map((item) => mapItem(item, locale));
}

export function findAppMenuItemByPageId(
  items: AppMenuItem[],
  pageId: string,
): AppMenuItem | undefined {
  for (const item of items) {
    if (item.pageId === pageId) return item;
    if (item.children) {
      const nested = findAppMenuItemByPageId(item.children, pageId);
      if (nested) return nested;
    }
  }
  return undefined;
}

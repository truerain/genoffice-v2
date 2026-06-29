/**
 * @file apps/demo/src/app/menu/menu.types.ts
 * @description App menu item shape from API or mock (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 * - componentName maps to componentRegistry keys
 * - titleKey optional — resolved via i18n when title absent
 *
 */

import type { ComponentName } from '../config/componentRegistry.types';

export interface AppMenuItem {
  pageId: string;
  componentName: ComponentName;
  title?: string;
  titleKey?: string;
  path?: string;
  icon?: string;
  children?: AppMenuItem[];
}

export interface AppMenuResponse {
  items: AppMenuItem[];
}

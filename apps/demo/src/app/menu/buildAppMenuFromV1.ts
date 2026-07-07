/**
 * @file apps/demo/src/app/menu/buildAppMenuFromV1.ts
 * @description Build V2 AppMenuItem tree from V1 flat mock menu rows.
 * @created 2026-07-07
 *
 * @remark
 * - V1 execComponent → V2 componentRegistry (aliases + ComingSoonPage fallback)
 *
 */

import type { V1AppMenu } from '../../mocks/data/menu.types';
import { isComponentName } from '../config/componentRegistry';
import type { ComponentName } from '../config/componentRegistry.types';
import type { AppMenuItem } from './menu.types';

const V1_COMPONENT_ALIASES: Record<string, ComponentName> = {
  CoActualsPage: 'ActualsPage',
};

const V2_READY_COMPONENTS = new Set<ComponentName>([
  'CustomerInfoPage',
  'ActualsPage',
  'UserManagementPage',
  'MenuManagementPage',
  'ChartDemoPage',
  'DashboardDemoPage',
]);

function isYes(value: string | undefined): boolean {
  return String(value ?? '').trim().toUpperCase() === 'Y';
}

function normalizeParentMenuId(value: number | null | undefined): string | null {
  return value == null || value === 0 ? null : String(value);
}

function resolveComponentName(execComponent: string | undefined): ComponentName | undefined {
  const trimmed = String(execComponent ?? '').trim();
  if (!trimmed) return undefined;

  const candidate = V1_COMPONENT_ALIASES[trimmed] ?? trimmed;
  if (isComponentName(candidate) && V2_READY_COMPONENTS.has(candidate)) {
    return candidate;
  }

  return 'ComingSoonPage';
}

type FlatAppMenuItem = {
  pageId: string;
  title: string;
  titleEng: string;
  icon?: string;
  componentName?: ComponentName;
  parentPageId: string | null;
  sortOrder: number;
  isActive?: boolean;
};

function mapFlatRow(menu: V1AppMenu): FlatAppMenuItem {
  return {
    pageId: String(menu.menuId),
    title: menu.menuName || menu.menuNameEng || String(menu.menuId),
    titleEng: menu.menuNameEng || menu.menuName,
    icon: menu.menuIcon,
    componentName: resolveComponentName(menu.execComponent),
    parentPageId: normalizeParentMenuId(menu.parentMenuId),
    sortOrder: menu.sortOrder,
    isActive: menu.useYn == null ? undefined : isYes(menu.useYn),
  };
}

function buildMenuTree(
  items: FlatAppMenuItem[],
  parentId: string | null = null,
  ancestors: Set<string> = new Set(),
): AppMenuItem[] {
  return items
    .filter((item) => {
      const itemParentId = item.parentPageId ?? null;
      if (item.pageId === parentId) return false;
      return itemParentId === parentId;
    })
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((item) => {
      const { parentPageId: _parent, sortOrder: _order, isActive: _active, ...rest } = item;

      if (ancestors.has(item.pageId)) {
        return rest;
      }

      const nextAncestors = new Set(ancestors);
      nextAncestors.add(item.pageId);

      const children = buildMenuTree(items, item.pageId, nextAncestors);
      return children.length > 0 ? { ...rest, children } : rest;
    });
}

export function buildAppMenuItemsFromV1(menus: readonly V1AppMenu[]): AppMenuItem[] {
  const flatItems = menus
    .filter((menu) => isYes(menu.displayYn))
    .map((menu) => mapFlatRow(menu));

  return buildMenuTree(flatItems);
}

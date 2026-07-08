/**
 * @file apps/demo/src/pages/admin/menu/menuData.ts
 * @description Mock hierarchical menu rows (Gate D4).
 * @created 2026-06-29
 *
 * @remark
 *
 */

import type { DataGridCrudCommitArgs } from '@gen-office/gen-datagrid-crud';
import type { MenuRow } from './menu.types';

export const INITIAL_MENU_ROWS: MenuRow[] = [
  {
    menuId: 'menu-system',
    menuName: 'System',
    menuPath: '/system',
    componentName: '',
    sortOrder: 10,
    useYn: true,
    children: [
      {
        menuId: 'menu-system-users',
        menuName: 'User Management',
        menuPath: '/admin/user',
        componentName: 'UserPage',
        sortOrder: 1,
        useYn: true,
      },
      {
        menuId: 'menu-system-menus',
        menuName: 'Menu Management',
        menuPath: '/admin/menu',
        componentName: 'MenuPage',
        sortOrder: 2,
        useYn: true,
      },
    ],
  },
  {
    menuId: 'menu-demo',
    menuName: 'Demo',
    menuPath: '/demo',
    componentName: '',
    sortOrder: 20,
    useYn: true,
    children: [
      {
        menuId: 'menu-demo-chart',
        menuName: 'Chart Demo',
        menuPath: '/demo/chart',
        componentName: 'ChartDemoPage',
        sortOrder: 1,
        useYn: true,
      },
      {
        menuId: 'menu-demo-dashboard',
        menuName: 'Dashboard Demo',
        menuPath: '/demo/dashboard',
        componentName: 'DashboardDemoPage',
        sortOrder: 2,
        useYn: true,
      },
    ],
  },
  {
    menuId: 'menu-co',
    menuName: 'CO',
    menuPath: '/co',
    componentName: '',
    sortOrder: 30,
    useYn: true,
    children: [
      {
        menuId: 'menu-co-actuals',
        menuName: 'Actuals',
        menuPath: '/co/actuals',
        componentName: 'ActualsPage',
        sortOrder: 1,
        useYn: true,
      },
    ],
  },
];

export const DEFAULT_TREE_EXPANDED: Record<string, boolean> = {
  'menu-system': true,
  'menu-demo': true,
  'menu-co': true,
};

function updateMenuTree(
  rows: readonly MenuRow[],
  rowId: string,
  patch: Partial<MenuRow>,
): MenuRow[] {
  return rows.map((row) => {
    if (row.menuId === rowId) {
      return { ...row, ...patch };
    }
    if (row.children?.length) {
      return { ...row, children: updateMenuTree(row.children, rowId, patch) };
    }
    return row;
  });
}

function deleteFromMenuTree(
  rows: readonly MenuRow[],
  rowId: string,
): MenuRow[] {
  return rows
    .filter((row) => row.menuId !== rowId)
    .map((row) =>
      row.children?.length
        ? { ...row, children: deleteFromMenuTree(row.children, rowId) }
        : row,
    );
}

export function applyMenuCommit(
  rows: readonly MenuRow[],
  args: DataGridCrudCommitArgs<MenuRow>,
): MenuRow[] {
  let next = [...rows];

  for (const item of args.changeSet.deleted) {
    next = deleteFromMenuTree(next, item.rowId);
  }

  for (const item of args.changeSet.updated) {
    next = updateMenuTree(next, item.rowId, item.patch);
  }

  return [...args.changeSet.created, ...next];
}

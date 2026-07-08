/**
 * @file apps/demo/src/pages/admin/menu/menu.types.ts
 * @description Row type for Menu tree CRUD (Gate D4).
 * @created 2026-06-29
 *
 * @remark
 *
 */

export type MenuRow = {
  menuId: string;
  menuName: string;
  menuPath: string;
  componentName: string;
  sortOrder: number;
  useYn: boolean;
  children?: MenuRow[];
};

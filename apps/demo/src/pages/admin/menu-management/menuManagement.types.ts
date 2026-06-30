/**
 * @file apps/demo/src/pages/admin/menu-management/menuManagement.types.ts
 * @description Row type for MenuManagement tree CRUD (Gate D4).
 * @created 2026-06-29
 *
 * @remark
 *
 */

export type MenuManagementRow = {
  menuId: string;
  menuName: string;
  menuPath: string;
  componentName: string;
  sortOrder: number;
  useYn: boolean;
  children?: MenuManagementRow[];
};

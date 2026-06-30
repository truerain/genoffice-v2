/**
 * @file apps/demo/src/pages/admin/user-management/userManagement.types.ts
 * @description Row type for UserManagement demo CRUD (Gate D4).
 * @created 2026-06-29
 *
 * @remark
 *
 */

export type DemoUserRow = {
  userId: string;
  loginId: string;
  displayName: string;
  email: string;
  active: boolean;
};

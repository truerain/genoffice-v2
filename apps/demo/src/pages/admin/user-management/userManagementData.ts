/**
 * @file apps/demo/src/pages/admin/user-management/userManagementData.ts
 * @description Mock user rows for UserManagement (Gate D4).
 * @created 2026-06-29
 *
 * @remark
 *
 */

import type { DemoUserRow } from './userManagement.types';

export const INITIAL_DEMO_USERS: DemoUserRow[] = [
  {
    userId: 'u-1',
    loginId: 'admin',
    displayName: 'System Admin',
    email: 'admin@example.com',
    active: true,
  },
  {
    userId: 'u-2',
    loginId: 'jdoe',
    displayName: 'Jane Doe',
    email: 'jane.doe@example.com',
    active: true,
  },
  {
    userId: 'u-3',
    loginId: 'inactive',
    displayName: 'Inactive User',
    email: 'inactive@example.com',
    active: false,
  },
];

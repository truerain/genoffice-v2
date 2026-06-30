/**
 * @file apps/demo/src/pages/admin/user-management/userManagementColumns.tsx
 * @description Column definitions for UserManagement (Gate D4).
 * @created 2026-06-29
 *
 * @remark
 *
 */

import type { ColumnDef } from '@tanstack/react-table';
import type { DemoUserRow } from './userManagement.types';

export const userManagementColumns: ColumnDef<DemoUserRow, unknown>[] = [
  {
    accessorKey: 'loginId',
    header: 'Login ID',
    size: 140,
    meta: { editable: true },
  },
  {
    accessorKey: 'displayName',
    header: 'Display name',
    size: 180,
    meta: { editable: true },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 220,
    meta: { editable: true },
  },
  {
    accessorKey: 'active',
    header: 'Active',
    size: 90,
    meta: { editable: true, align: 'center' },
  },
];

/**
 * @file apps/demo/src/pages/admin/user/userColumns.tsx
 * @description Column definitions for User admin (Gate D4).
 * @created 2026-06-29
 *
 * @remark
 *
 */

import type { ColumnDef } from '@tanstack/react-table';
import type { DemoUserRow } from './user.types';

export const userColumns: ColumnDef<DemoUserRow, unknown>[] = [
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

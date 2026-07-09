/**
 * @file apps/demo/src/pages/admin/user/userColumns.ts
 * @description Column definitions for User admin (Gate D4).
 * @created 2026-06-29
 *
 * @remark
 * - JSX 없음 → `.ts` (React Fast Refresh 시 page reload 방지)
 *
 * @history
 * - 2026-07-09 userColumns.tsx → userColumns.ts
 */

import type { ColumnDef } from '@tanstack/react-table';
import type { UserRow } from './user.types';

/**
 * Grid Columns 정의
 */
export const userColumns: ColumnDef<UserRow, unknown>[] = [
  {
    accessorKey: 'userId',
    header: '사용자 ID',
    size: 100,
    meta: { editable: true },
  },
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

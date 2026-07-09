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
    meta: { 
      editable: true ,
      align: 'center',
    },
  },
  {
    accessorKey: 'loginId',
    header: 'Login ID',
    size: 140,
    meta: { editable: true },
  },
  {
    accessorKey: 'empNo',
    header: '사번',
    size: 120,
    meta: { 
      editable: true ,
      align: 'center',
    },
  },
  {
    accessorKey: 'empName',
    header: '사용자명',
    size: 130,
    meta: { 
      editable: true,
    },
  },
  {
    accessorKey: 'empNameEng',
    header: '사용자명(영문)',
    size: 180,
    meta: { 
      editable: true,
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 300,
    meta: { editable: true },
  },
  {
    accessorKey: 'titleName',
    header: '직책',
    size: 150,
    meta: { 
      editable: true,
      align: 'center',
    },
  },
  {
    accessorKey: 'orgName',
    header: '부서',
    size: 150,
    meta: { 
      editable: true,
      align: 'center',
    },
  },
  {
    accessorKey: 'active',
    header: 'Active',
    size: 90,
    meta: { editable: true, align: 'center' },
  },
  {
    accessorKey: 'lastUpdatedDate',
    header: '최종수정시간',
    size: 150,
    meta: { editable: true, align: 'center' },
  },
  {
    accessorKey: 'lastUpdatedName',
    header: '최종수정자',
    size: 160,
    meta: { editable: true, align: 'center' },
  },
];

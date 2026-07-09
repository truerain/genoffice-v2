/**
 * @file apps/demo/src/pages/admin/user/userColumns.ts
 * @description Column definitions for User admin (Gate D4).
 * @created 2026-06-29
 *
 * @remark
 * - JSX 없음 → `.ts` (React Fast Refresh 시 page reload 방지)
 *
 * - userId: 신규 행만 셀 표시, 편집 불가
 * - loginId: 소문자만 입력 (userColumnEditors)
 *
 * @history
 * - 2026-07-09 loginId: 소문자 전용 editor
 * - 2026-07-09 userId: 신규 행만 셀 표시
 * - 2026-07-09 userId: 신규 행(NEW_ROW_ID_PREFIX)은 편집 불가
 * - 2026-07-09 userColumns.tsx → userColumns.ts
 */

import type { ColumnDef } from '@tanstack/react-table';
import { NEW_ROW_ID_PREFIX, type UserRow } from './user.types';
import { lowercaseTextEditor } from './userColumnEditors';

/**
 * Grid Columns 정의
 */
export const userColumns: ColumnDef<UserRow, unknown>[] = [
  {
    accessorKey: 'userId',
    header: '사용자 ID',
    size: 100,
    meta: {
      editable: false,
      align: 'center',
    },
    cell: ({ row, getValue }) =>
      row.original.userId.startsWith(NEW_ROW_ID_PREFIX)
        ?  '' : String(getValue() ?? ''),
  },
  {
    accessorKey: 'loginId',
    header: 'Login ID',
    size: 140,
    meta: {
      editable: true,
      editType: 'text',
      renderEditor: lowercaseTextEditor,
    },
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

/**
 * @file apps/demo/src/pages/admin/user/userColumns.ts
 * @description Column definitions for User admin (Gate D4).
 * @created 2026-06-29
 *
 * @remark
 * - JSX 없음 → `.ts` (React Fast Refresh 시 page reload 방지)
 *
 * - userId: 신규 행만 셀 표시, 편집 불가 (`meta.renderCell` + rowStatus)
 * - loginId: 소문자만 입력 (userColumnEditors)
 * - empNo: 최대 10자 (userColumnEditors)
 * - titleCd: 공통코드 lookup → titleName 표시, select editor
 * - useYn: Y/N Switch — 셀 render 자체가 toggle (편집 모드 없음)
 *
 * @history
 * - 2026-07-09 userId: meta.renderCell + rowStatus로 신규 행 표시 (sentinel 우회 제거)
 * - 2026-07-09 매핑 없는 선행 컬럼 추가(Expand toggle anchor)
 * - 2026-07-09 useYn: 셀 render Switch toggle (emitCellValueChange)
 * - 2026-07-09 orgName: 부서 Popup lookup (orgId)
 * - 2026-07-09 empNo: 최대 10자 editor
 * - 2026-07-09 userId: 신규 행만 셀 표시
 * - 2026-07-09 userColumns.tsx → userColumns.ts
 */

import type * as React from 'react';
import type { GenDataGridCellContext, GenDataGridColumnDef } from '@gen-office/gen-datagrid';
import type { Lkup } from '../../../shared/domain/lkup.types';
import type { Org } from '../../../shared/domain/org.types';
import { lkupNameByCd, toLkupEditOptions } from '../../../shared/domain/lkupResolve';
import { orgNameById } from '../../../shared/domain/orgResolve';
import type { UserRow } from './user.types';
import { empNoEditor, lowercaseTextEditor } from './userColumnEditors';
import { createOrgLookupEditor } from './orgLookupEditor';
import { createUseYnToggleCell } from './userColumnCells';
import type { UserGridCellBridge } from './userGridCellBridge';

/**
 * 공통코드·부서 lookup이 필요한 Grid Columns 정의.
 */
export function createUserColumns(
  titleCodes: readonly Lkup[],
  orgs: readonly Org[],
  cellBridgeRef: React.RefObject<UserGridCellBridge>,
): GenDataGridColumnDef<UserRow, unknown>[] {
  const titleNameByCd = (titleCd?: string) => lkupNameByCd(titleCodes, titleCd);
  const titleEditOptions = toLkupEditOptions(titleCodes);
  const orgLookupEditor = createOrgLookupEditor(orgs);
  const useYnToggleCell = createUseYnToggleCell(cellBridgeRef);

  return [
    {
      id: '_leading',
      header: '',
      size: 40,
      minSize: 40,
      maxSize: 40,
      enableResizing: false,
      enableColumnFilter: false,
      meta: {
        editable: false,
        align: 'center',
      },
      cell: () => '',
    },
    {
      accessorKey: 'userId',
      header: '사용자 ID',
      size: 100,
      meta: {
        editable: false,
        align: 'center',
        renderCell: ({ rowStatus, value }: GenDataGridCellContext) =>
          rowStatus === 'created' ? '' : String(value ?? ''),
      },
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
        editable: true,
        align: 'center',
        editType: 'text',
        renderEditor: empNoEditor,
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
      accessorKey: 'titleCd',
      header: '직책',
      size: 150,
      meta: {
        editable: true,
        align: 'center',
        editType: 'select',
        getEditOptions: () => titleEditOptions,
      },
      cell: ({ row }) => {
        const titleCd = row.original.titleCd;
        return titleNameByCd(titleCd) || row.original.titleName || titleCd || '';
      },
    },
    {
      accessorKey: 'orgId',
      header: '부서',
      size: 180,
      meta: {
        editable: true,
        align: 'center',
        editBlurOwnership: 'modal',
        renderEditor: orgLookupEditor,
      },
      cell: ({ row }) => {
        const id = row.original.orgId;
        return orgNameById(orgs, id) || row.original.orgName || id || '';
      },
    },
    {
      accessorKey: 'useYn',
      header: '사용',
      size: 90,
      meta: {
        editable: false,
        align: 'center',
      },
      cell: useYnToggleCell,
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
}

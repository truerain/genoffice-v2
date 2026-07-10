/**
 * @file apps/demo/src/pages/admin/user/userColumns.ts
 * @description Column definitions for User admin (Gate D4).
 * @created 2026-06-29
 *
 * @remark
 * - JSX 없음 → `.ts` (React Fast Refresh 시 page reload 방지)
 *
 * - userId: 신규 행만 셀 표시, 편집 불가 (`meta.renderCell` + rowStatus)
 * - loginId: 소문자만 입력 (`editType: lowercaseText`)
 * - empNo: 최대 10자 (`editMaxLength`)
 * - titleCd: 공통코드 lookup → titleName 표시, select editor
 * - useYn: Y/N Switch — 셀 render 자체가 toggle (편집 모드 없음)
 *
 * @history
 * - 2026-07-09 loginId/empNo: built-in editor meta로 전환 (userColumnEditors 제거)
 * - 2026-07-09 userId: meta.renderCell + rowStatus로 신규 행 표시 (sentinel 우회 제거)
 * - 2026-07-10 masterDetail chevron toggle (`renderDetailChevronToggle`) on `_leading`
 * - 2026-07-09 useYn: 셀 render Switch toggle (emitCellValueChange)
 * - 2026-07-10 orgId: editLookup.mapSelection으로 orgId·orgName 동시 반영
 * - 2026-07-09 empNo: 최대 10자 editor
 * - 2026-07-09 userId: 신규 행만 셀 표시
 * - 2026-07-09 userColumns.tsx → userColumns.ts
 */

import * as React from 'react';
import type { GenDataGridCellContext, GenDataGridColumnDef } from '@gen-office/gen-datagrid';
import type { Lkup } from '../../../shared/domain/lkup.types';
import type { Org } from '../../../shared/domain/org.types';
import { orgNameById } from '../../../shared/domain/orgResolve';
import { lkupNameByCd, toLkupEditOptions } from '../../../shared/domain/lkupResolve';
import type { UserRow } from './user.types';
import { EMP_NO_MAX_LENGTH } from './user.types';
import { OrgLookupModal } from './orgLookupModal';
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
        renderCell: ({ rowStatus, value }: GenDataGridCellContext<UserRow>) =>
          rowStatus === 'created' ? '' : String(value ?? ''),
      },
    },
    {
      accessorKey: 'loginId',
      header: 'Login ID',
      size: 140,
      meta: {
        editable: true,
        editType: 'lowercaseText',
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
        editMaxLength: EMP_NO_MAX_LENGTH,
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
      accessorKey: 'orgName',
      header: '부서',
      size: 180,
      meta: {
        editable: true,
        align: 'center',
        editType: 'lookup',
        editLookup: {
          allowCellEdit: true,
          triggerAriaLabel: '부서 조회',
          getDisplayValue: (value, { row }) => {
            const id = value == null || value === '' ? row.orgId : String(value);
            return orgNameById(orgs, id) || row.orgName || id || '';
          },
          mapSelection: (org: Org) => ({
            orgId: org.orgId,
            orgName: org.orgName,
          }),
          renderModal: (ctx) => React.createElement(OrgLookupModal, { ctx, orgs }),
        },
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
      meta: { editable: false, align: 'center' },
    },
    {
      accessorKey: 'lastUpdatedName',
      header: '최종수정자',
      size: 160,
      meta: { editable: false, align: 'center' },
    },
  ];
}

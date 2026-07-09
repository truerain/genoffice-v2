/**
 * @file apps/demo/src/pages/admin/menu/menuColumns.ts
 * @description Column definitions for Menu tree grid (Gate D4).
 * @created 2026-06-29
 *
 * @remark
 * - JSX 없음 → `.ts` (React Fast Refresh 시 page reload 방지)
 *
 * @history
 * - 2026-07-09 menuColumns.tsx → menuColumns.ts
 */

import type { ColumnDef } from '@tanstack/react-table';
import type { MenuRow } from './menu.types';

export const menuColumns: ColumnDef<MenuRow, unknown>[] = [
  {
    accessorKey: 'menuName',
    header: 'Menu name',
    size: 220,
    meta: { editable: true },
  },
  {
    accessorKey: 'menuPath',
    header: 'Path',
    size: 200,
    meta: { editable: true },
  },
  {
    accessorKey: 'componentName',
    header: 'Component',
    size: 180,
    meta: { editable: true },
  },
  {
    accessorKey: 'sortOrder',
    header: 'Sort',
    size: 80,
    meta: { editable: true, align: 'right' },
  },
  {
    accessorKey: 'useYn',
    header: 'Use',
    size: 70,
    meta: { editable: true, align: 'center' },
  },
];

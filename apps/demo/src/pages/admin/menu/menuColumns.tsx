/**
 * @file apps/demo/src/pages/admin/menu/menuColumns.tsx
 * @description Column definitions for Menu tree grid (Gate D4).
 * @created 2026-06-29
 *
 * @remark
 *
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

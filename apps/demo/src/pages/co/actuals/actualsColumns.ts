/**
 * @file apps/demo/src/pages/co/actuals/actualsColumns.ts
 * @description Column definitions for Actuals readonly grid (Gate D4).
 * @created 2026-06-29
 *
 * @remark
 * - acctCd headerSpan: 2 — merges acctCd/acctName header band
 * - JSX 없음 → `.ts` (React Fast Refresh 시 page reload 방지)
 *
 * @history
 * - 2026-07-09 actualsColumns.tsx → actualsColumns.ts
 */

import type { ColumnDef } from '@tanstack/react-table';
import type { ActualsRow } from './actuals.types';

const amountFormatter = new Intl.NumberFormat('ko-KR');

function formatAmount(value: number) {
  return amountFormatter.format(value);
}

export const actualsColumns: ColumnDef<ActualsRow, unknown>[] = [
  {
    accessorKey: 'fiscalMonth',
    header: 'Fiscal Month',
    size: 110,
  },
  {
    accessorKey: 'orgCd',
    header: 'Org',
    size: 80,
  },
  {
    accessorKey: 'orgName',
    header: 'Organization',
    size: 160,
  },
  {
    accessorKey: 'acctCd',
    header: 'Account',
    size: 90,
    meta: { headerSpan: 2 },
  },
  {
    accessorKey: 'acctName',
    header: 'Account Name',
    size: 180,
  },
  {
    accessorKey: 'budgetAmt',
    header: 'Budget',
    size: 120,
    meta: { align: 'right' },
    cell: ({ getValue }) => formatAmount(getValue<number>()),
  },
  {
    accessorKey: 'actualAmt',
    header: 'Actual',
    size: 120,
    meta: { align: 'right' },
    cell: ({ getValue }) => formatAmount(getValue<number>()),
  },
  {
    accessorKey: 'varianceAmt',
    header: 'Variance',
    size: 120,
    meta: { align: 'right' },
    cell: ({ getValue }) => formatAmount(getValue<number>()),
  },
];

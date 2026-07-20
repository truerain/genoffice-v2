'use client';

/**
 * @file apps/docs/src/examples/QuickStartGrid.tsx
 * @description Minimal GenDataGrid live example for Key Features (grid-only track).
 * @created 2026-07-13
 */

import { GenDataGrid } from '@gen-office/gen-datagrid';
import type { ColumnDef } from '@tanstack/react-table';
import { DocsExample } from '@/components/DocsExample';

type Car = {
  id: string;
  make: string;
  model: string;
  price: number;
  electric: boolean;
};

const rowData: Car[] = [
  { id: '1', make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
  { id: '2', make: 'Ford', model: 'F-Series', price: 33850, electric: false },
  { id: '3', make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
];

const columns: ColumnDef<Car, unknown>[] = [
  { accessorKey: 'make', header: 'Make', size: 120 },
  { accessorKey: 'model', header: 'Model', size: 140 },
  { accessorKey: 'price', header: 'Price', size: 100 },
  { accessorKey: 'electric', header: 'Electric', size: 100 },
];

export function QuickStartGrid() {
  return (
    <DocsExample>
      <GenDataGrid<Car>
        data={rowData}
        columns={columns}
        getRowId={(row) => row.id}
        gridId="docs-quick-start"
        style={{ height: 220, width: '100%' }}
      />
    </DocsExample>
  );
}

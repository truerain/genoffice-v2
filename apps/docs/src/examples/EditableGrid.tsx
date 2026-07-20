'use client';

/**
 * @file apps/docs/src/examples/EditableGrid.tsx
 * @description Editable GenDataGrid snippet for Key Features.
 * @created 2026-07-13
 */

import { GenDataGrid, type GenDataGridCellValueChange } from '@gen-office/gen-datagrid';
import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { DocsExample } from '@/components/DocsExample';

type Person = {
  id: string;
  name: string;
  role: string;
};

const initialRows: Person[] = [
  { id: '1', name: 'Ada Lovelace', role: 'Analyst' },
  { id: '2', name: 'Grace Hopper', role: 'Engineer' },
  { id: '3', name: 'Katherine Johnson', role: 'Reviewer' },
];

const columns: ColumnDef<Person, unknown>[] = [
  { accessorKey: 'name', header: 'Name', size: 180, meta: { editable: true } },
  { accessorKey: 'role', header: 'Role', size: 160, meta: { editable: true } },
];

export function EditableGrid() {
  const [rows, setRows] = useState(initialRows);

  const onCellValueChange = ({ rowId, columnId, value }: GenDataGridCellValueChange<Person>) => {
    setRows((current) =>
      current.map((row) => (row.id === rowId ? { ...row, [columnId]: value } : row)),
    );
  };

  return (
    <DocsExample>
      <GenDataGrid<Person>
        data={rows}
        columns={columns}
        getRowId={(row) => row.id}
        gridId="docs-editable"
        onCellValueChange={onCellValueChange}
        style={{ height: 200, width: '100%' }}
      />
    </DocsExample>
  );
}

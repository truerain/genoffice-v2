'use client';

/**
 * @file apps/docs/src/examples/CrudGrid.tsx
 * @description GenDataGridCrud live example for First CRUD tutorial.
 * @created 2026-07-13
 */

import { GenDataGridCrud, type DataGridCrudCommitArgs } from '@gen-office/gen-datagrid-crud';
import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { DocsExample } from '@/components/DocsExample';

type Person = {
  id: string;
  name: string;
  role: string;
  active: boolean;
};

const initialRows: Person[] = [
  { id: '1', name: 'Ada Lovelace', role: 'Analyst', active: true },
  { id: '2', name: 'Grace Hopper', role: 'Engineer', active: true },
  { id: '3', name: 'Katherine Johnson', role: 'Reviewer', active: false },
];

const columns: ColumnDef<Person, unknown>[] = [
  { accessorKey: 'name', header: 'Name', size: 180, meta: { editable: true } },
  { accessorKey: 'role', header: 'Role', size: 140, meta: { editable: true } },
  { accessorKey: 'active', header: 'Active', size: 90 },
];

function applyCommit(rows: readonly Person[], args: DataGridCrudCommitArgs<Person>) {
  const updates = new Map(args.changeSet.updated.map((item) => [item.rowId, item.patch]));
  const deleted = new Set(args.changeSet.deleted.map((item) => item.rowId));
  const nextRows = rows
    .filter((row) => !deleted.has(row.id))
    .map((row) => ({ ...row, ...(updates.get(row.id) ?? {}) }));
  return [...args.changeSet.created, ...nextRows];
}

export function CrudGrid() {
  const [rows, setRows] = useState(initialRows);

  return (
    <DocsExample>
      <GenDataGridCrud
        title="People"
        data={rows}
        columns={columns}
        getRowId={(row) => row.id}
        createRow={({ data }) => ({
          id: `new-${data.length + 1}`,
          name: 'New person',
          role: 'Analyst',
          active: true,
        })}
        onCommit={async (args) => {
          setRows((current) => applyCommit(current, args));
          return { ok: true };
        }}
        gridProps={{ style: { height: 280, width: '100%' } }}
      />
    </DocsExample>
  );
}

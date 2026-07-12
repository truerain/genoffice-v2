// packages/gen-datagrid-crud/src/stories/GenDataGridCrud.stories.tsx
// Provides Storybook smoke stories for the GenDataGridCrud thin shell.

import * as React from 'react';
import type { Meta } from '@storybook/react';
import type { ColumnDef } from '@tanstack/react-table';
import { GenDataGrid, renderDetailChevronToggle } from '@gen-office/gen-datagrid';
import { Settings } from 'lucide-react';

import { DataGridCrudActionBar } from '../components/DataGridCrudActionBar';
import { useDataGridCrudController } from '../crud/useDataGridCrudController';
import { GenDataGridCrud } from '../GenDataGridCrud';
import type { DataGridCrudCommitArgs } from '../GenDataGridCrud.types';

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

const masterDetailLeadingColumns: ColumnDef<Person, unknown>[] = [
  {
    id: '_leading',
    header: '',
    size: 40,
    minSize: 40,
    maxSize: 40,
    enableResizing: false,
    meta: { align: 'center' },
    cell: () => '',
  },
  ...columns,
];

function applyCommit(rows: readonly Person[], args: DataGridCrudCommitArgs<Person>) {
  const updates = new Map(args.changeSet.updated.map((item) => [item.rowId, item.patch]));
  const deleted = new Set(args.changeSet.deleted.map((item) => item.rowId));
  const nextRows = rows
    .filter((row) => !deleted.has(row.id))
    .map((row) => ({ ...row, ...(updates.get(row.id) ?? {}) }));
  return [...args.changeSet.created, ...nextRows];
}

function renderPersonDetailPanel({ row, collapse }: { row: Person; collapse: () => void }) {
  return (
    <div style={{ display: 'grid', gap: 8, fontSize: 13 }}>
      <strong>{row.name}</strong>
      <div style={{ display: 'grid', gridTemplateColumns: '96px 1fr', gap: 6 }}>
        <span>Role</span>
        <span>{row.role}</span>
        <span>Active</span>
        <span>{row.active ? 'Yes' : 'No'}</span>
      </div>
      <button type="button" onClick={collapse}>
        Collapse detail
      </button>
    </div>
  );
}

function DirtySaveShellStory() {
  const [rows, setRows] = React.useState(initialRows);
  return (
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
      createdRowPosition='bottom'
      gridProps={{ style: { height: 320 } }}
    />
  );
}

function MasterDetailShellStory({
  toggleVariant,
}: {
  toggleVariant: 'default' | 'chevron';
}) {
  const [rows, setRows] = React.useState(initialRows);
  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({ '1': true });

  return (
    <GenDataGridCrud
      title="People"
      data={rows}
      columns={masterDetailLeadingColumns}
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
      gridProps={{ style: { height: 360 } }}
      masterDetail={{
        expandedRows,
        onExpandedRowsChange: setExpandedRows,
        renderDetailPanel: renderPersonDetailPanel,
        panelHeight: 160,
        toggle:
          toggleVariant === 'chevron'
            ? { columnId: '_leading', render: renderDetailChevronToggle }
            : { columnId: '_leading' },
      }}
    />
  );
}

const meta = {
  title: 'Packages/GenDataGridCrud/GenDataGridCrud',
  component: GenDataGridCrud,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof GenDataGridCrud>;

export default meta;

export const ReadonlyWithActionBar = {
  render: () => (
    <GenDataGridCrud
      title="Readonly People"
      readonly
      data={initialRows}
      columns={columns}
      getRowId={(row) => row.id}
      gridProps={{ style: { height: 320 } }}
    />
  ),
};

export const DirtySaveShell = {
  render: () => <DirtySaveShellStory />,
};

export const CustomActions = {
  render: () => (
    <GenDataGridCrud
      title="People"
      data={initialRows}
      columns={columns}
      getRowId={(row) => row.id}
      actionBar={{
        customActions: [
          {
            key: 'settings',
            label: 'Settings',
            icon: <Settings aria-hidden size={16} />,
            side: 'right',
            order: 5,
            onClick: ({ state }) => {
              window.alert(`Rows: ${state.data.length}`);
            },
          },
        ],
      }}
      gridProps={{ style: { height: 320 } }}
    />
  ),
};

function HeadlessControllerCustomActionBarStory() {
  const [rows, setRows] = React.useState(initialRows);
  const [statusLine, setStatusLine] = React.useState('idle');

  const controller = useDataGridCrudController<Person>({
    data: rows,
    getRowId: (row) => row.id,
    createRow: ({ data }) => ({
      id: `new-${data.length + 1}`,
      name: 'New person',
      role: 'Analyst',
      active: true,
    }),
    onCommit: async (args) => {
      setRows((current) => applyCommit(current, args));
      return { ok: true };
    },
    onStateChange: (state) => {
      setStatusLine(
        state.isCommitting
          ? 'committing…'
          : `dirty=${state.dirty} selected=${state.selectedRowIds.length} created=${state.createdRows.length}`
      );
    },
  });

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <button type="button" onClick={() => controller.actionApi.addRow()}>
          Custom Add
        </button>
        <button
          type="button"
          disabled={controller.state.readonly || controller.state.isCommitting}
          onClick={() => void controller.actionApi.save()}
        >
          Custom Save
        </button>
        <DataGridCrudActionBar
          state={controller.state}
          actionApi={controller.actionApi}
          options={{
            title: 'Headless shell',
            includeBuiltIns: ['reset', 'filter'],
            customActions: [
              {
                key: 'settings',
                label: 'Settings',
                icon: <Settings aria-hidden size={16} />,
                side: 'right',
                order: 5,
                onClick: ({ state }) => {
                  window.alert(`Rows: ${state.data.length}`);
                },
              },
            ],
          }}
        />
        <span style={{ fontSize: 12, color: '#57606a' }}>{statusLine}</span>
      </div>
      <GenDataGrid<Person>
        ref={controller.gridRef}
        {...controller.gridStateProps}
        data={[...controller.gridData]}
        columns={columns}
        getRowId={(row) => row.id}
        editSelectOnFocus
        style={{ height: 320, border: '1px solid #d0d7de', borderRadius: 6 }}
      />
    </div>
  );
}

/** Controller + custom toolbar + GenDataGrid (no GenDataGridCrud wrapper). */
export const HeadlessControllerCustomActionBar = {
  render: () => <HeadlessControllerCustomActionBarStory />,
};

export const MasterDetailLeadingColumn = {
  render: () => <MasterDetailShellStory toggleVariant="default" />,
};

export const MasterDetailChevronToggle = {
  render: () => <MasterDetailShellStory toggleVariant="chevron" />,
};

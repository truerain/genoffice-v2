// packages/gen-datagrid-crud/test/masterDetailConfig.test.tsx
// Verifies CRUD masterDetail config normalization and grid wiring.

import * as React from 'react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';

import { GenDataGridCrud, resolveMasterDetailGridProps } from '../src';
import type { GenDataGridColumnDef } from '@gen-office/gen-datagrid';

type Person = {
  id: string;
  name: string;
};

const rows: Person[] = [{ id: '1', name: 'Ada' }];

const columns: GenDataGridColumnDef<Person, unknown>[] = [
  { id: '_leading', header: '', size: 40, cell: () => '' },
  { accessorKey: 'name', header: 'Name', size: 120 },
];

beforeAll(() => {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  });
  Object.defineProperty(window, 'ResizeObserver', {
    configurable: true,
    value: ResizeObserverMock,
  });
  Object.defineProperty(globalThis, 'ResizeObserver', {
    configurable: true,
    value: ResizeObserverMock,
  });
});

afterEach(() => {
  cleanup();
});

describe('resolveMasterDetailGridProps', () => {
  it('returns empty object when config is undefined', () => {
    expect(resolveMasterDetailGridProps(undefined)).toEqual({});
  });

  it('maps CRUD config fields to GenDataGrid flat props', () => {
    const onExpandedRowsChange = vi.fn();
    const renderDetailPanel = vi.fn(() => null);
    const renderDetailToggle = vi.fn(() => null);

    expect(
      resolveMasterDetailGridProps({
        enabled: true,
        expandedRows: { '1': true },
        onExpandedRowsChange,
        renderDetailPanel,
        panelHeight: 200,
        toggle: {
          columnId: '_leading',
          render: renderDetailToggle,
          props: { className: 'custom-toggle' },
        },
      })
    ).toEqual({
      enableMasterDetail: true,
      expandedRows: { '1': true },
      defaultExpandedRows: undefined,
      onExpandedRowsChange,
      getRowCanExpand: undefined,
      renderDetailPanel,
      detailPanelHeight: 200,
      detailToggleColumnId: '_leading',
      renderDetailToggle,
      detailToggleProps: { className: 'custom-toggle' },
    });
  });

  it('sets enableMasterDetail false when explicitly disabled', () => {
    expect(
      resolveMasterDetailGridProps({
        enabled: false,
        renderDetailPanel: () => null,
      }).enableMasterDetail
    ).toBe(false);
  });
});

describe('GenDataGridCrud masterDetail prop', () => {
  it('renders detail panel from masterDetail config', async () => {
    const { container, getByText } = render(
      <GenDataGridCrud
        data={rows}
        columns={columns}
        getRowId={(row) => row.id}
        actionBar={{ enabled: false }}
        masterDetail={{
          expandedRows: { '1': true },
          renderDetailPanel: ({ rowId }) => <span>Detail {rowId}</span>,
          toggle: { columnId: '_leading' },
        }}
      />
    );

    expect(getByText('Detail 1')).toBeTruthy();

    const toggle = container.querySelector<HTMLButtonElement>(
      '[data-gen-datagrid-cell="true"][data-colid="_leading"] [data-gen-datagrid-detail-toggle="true"]'
    );
    expect(toggle).not.toBeNull();
  });

  it('toggles detail panel through masterDetail expandedRows control', async () => {
    function ControlledCrud() {
      const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({});

      return (
        <GenDataGridCrud
          data={rows}
          columns={columns}
          getRowId={(row) => row.id}
          actionBar={{ enabled: false }}
          masterDetail={{
            expandedRows,
            onExpandedRowsChange: setExpandedRows,
            renderDetailPanel: ({ rowId }) => <span>Detail {rowId}</span>,
            toggle: { columnId: '_leading' },
          }}
        />
      );
    }

    const { container, queryByText } = render(<ControlledCrud />);

    expect(queryByText('Detail 1')).toBeNull();

    const toggle = container.querySelector<HTMLButtonElement>(
      '[data-gen-datagrid-detail-toggle="true"]'
    );
    if (!toggle) throw new Error('Missing detail toggle');

    fireEvent.click(toggle);

    await waitFor(() => {
      expect(queryByText('Detail 1')).toBeTruthy();
    });
  });
});

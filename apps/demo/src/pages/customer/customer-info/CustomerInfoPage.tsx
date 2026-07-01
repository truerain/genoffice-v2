/**
 * @file apps/demo/src/pages/customer/customer-info/CustomerInfoPage.tsx
 * @description Customer CRUD demo — GenDataGridCrud editing regression (V1 port).
 * @created 2026-07-01
 *
 * @remark
 * - In-memory mock data; text/select/date editors + CRUD default edit policy
 *
 */

import { useCallback, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { GenDataGridCrud } from '@gen-office/gen-datagrid-crud';
import type { DataGridCrudCommitArgs } from '@gen-office/gen-datagrid-crud';

import { PageHeader, PageLayout } from '@gen-office/ui';
import { useI18n } from '../../../i18n';
import { CustomerFilterBar } from './CustomerFilterBar';
import { customerInfoColumns } from './customerInfoColumns';
import { filterCustomers, INITIAL_CUSTOMERS } from './customerInfoData';
import type { Customer, CustomerFilterState } from './customerInfo.types';
import styles from './CustomerInfoPage.module.css';

const EMPTY_FILTERS: CustomerFilterState = {
  search: '',
  status: 'all',
  grade: 'all',
};

function applyCustomerCommit(
  rows: readonly Customer[],
  args: DataGridCrudCommitArgs<Customer>,
): Customer[] {
  const updates = new Map(args.changeSet.updated.map((item) => [item.rowId, item.patch]));
  const deleted = new Set(args.changeSet.deleted.map((item) => item.rowId));
  const nextRows = rows
    .filter((row) => !deleted.has(row.id))
    .map((row) => ({ ...row, ...(updates.get(row.id) ?? {}) }));
  return [...args.changeSet.created, ...nextRows];
}

export function CustomerInfoPage() {
  const { t } = useI18n();
  const [sourceRows, setSourceRows] = useState<Customer[]>(() => [...INITIAL_CUSTOMERS]);
  const [draftFilters, setDraftFilters] = useState<CustomerFilterState>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<CustomerFilterState>(EMPTY_FILTERS);
  const [dataVersion, setDataVersion] = useState(0);
  const tempIdRef = useRef(1);

  const displayRows = useMemo(
    () => filterCustomers(sourceRows, appliedFilters),
    [sourceRows, appliedFilters, dataVersion],
  );

  const handleSearch = useCallback(() => {
    setAppliedFilters({ ...draftFilters });
    setDataVersion((version) => version + 1);
  }, [draftFilters]);

  const getRowId = useCallback((row: Customer) => row.id, []);

  const createRow = useCallback(() => {
    const nextId = `temp-${tempIdRef.current}`;
    tempIdRef.current += 1;
    return {
      id: nextId,
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'PENDING' as const,
      registeredAt: '',
      lastContactAt: '',
      totalOrders: 0,
      totalSpent: 0,
      grade: 'bronze' as const,
    } satisfies Customer;
  }, []);

  const handleCommit = useCallback(
    async (args: DataGridCrudCommitArgs<Customer>) => {
      setSourceRows((rows) => applyCustomerCommit(rows, args));
      setDataVersion((version) => version + 1);
      return { ok: true };
    },
    [],
  );

  const actionBar = useMemo(
    () => ({
      includeBuiltIns: ['add', 'delete', 'save', 'reset'] as const,
      customActions: [
        {
          key: 'search',
          label: t('page.customerInfo.actions.search'),
          icon: <Search aria-hidden size={16} />,
          side: 'left' as const,
          order: 1,
          onClick: () => handleSearch(),
        },
      ],
    }),
    [handleSearch, t],
  );

  const gridProps = useMemo(
    () => ({
      rowHeight: 36,
      enablePinning: true,
      enableColumnSizing: true,
      enableVirtualization: true,
      defaultColumnPinning: {
        left: ['id', 'name'],
      },
    }),
    [],
  );

  const validateCommit = useCallback(
    (args: DataGridCrudCommitArgs<Customer>) => {
      const fieldErrors: Record<string, string> = {};

      for (const item of args.changeSet.updated) {
        const current = args.data.find((row) => row.id === item.rowId);
        const name = String(item.patch.name ?? current?.name ?? '').trim();
        if (!name) {
          fieldErrors[`${item.rowId}.name`] = t('page.customerInfo.validation.name');
        }
      }

      for (const row of args.changeSet.created) {
        if (!row.name?.trim()) {
          fieldErrors[`${row.id}.name`] = t('page.customerInfo.validation.name');
        }
      }

      return Object.keys(fieldErrors).length > 0 ? { valid: false, fieldErrors } : true;
    },
    [t],
  );

  return (
    <PageLayout
      contentVariant="fill"
      header={
        <PageHeader
          title={t('menu.customerInfo')}
          description={t('page.customerInfo.description')}
        />
      }
      filter={
        <CustomerFilterBar
          value={draftFilters}
          onChange={setDraftFilters}
          onSearch={handleSearch}
        />
      }
    >
      <div className={styles.workarea}>
        <GenDataGridCrud
          className={styles.crud}
          title={t('menu.customerInfo')}
          data={displayRows}
          columns={customerInfoColumns}
          getRowId={getRowId}
          dataVersion={dataVersion}
          createRow={createRow}
          validateCommit={validateCommit}
          onCommit={handleCommit}
          actionBar={actionBar}
          gridProps={gridProps}
        />
      </div>
    </PageLayout>
  );
}

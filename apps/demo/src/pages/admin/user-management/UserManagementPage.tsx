/**
 * @file apps/demo/src/pages/admin/user-management/UserManagementPage.tsx
 * @description Reference admin CRUD screen — GenDataGridCrud + mock data (Gate D4).
 * @created 2026-06-29
 *
 * @remark
 * - Controlled data + onCommit applies changeSet in-memory
 *
 */

import { useCallback, useState } from 'react';
import { GenDataGridCrud } from '@gen-office/gen-datagrid-crud';
import type { DataGridCrudCommitArgs } from '@gen-office/gen-datagrid-crud';
import { PageHeader, PageLayout } from '@gen-office/ui';
import { useI18n } from '../../../i18n';
import { userManagementColumns } from './userManagementColumns';
import { INITIAL_DEMO_USERS } from './userManagementData';
import type { DemoUserRow } from './userManagement.types';
import styles from './UserManagementPage.module.css';

function applyUserCommit(
  rows: readonly DemoUserRow[],
  args: DataGridCrudCommitArgs<DemoUserRow>,
): DemoUserRow[] {
  const updates = new Map(args.changeSet.updated.map((item) => [item.rowId, item.patch]));
  const deleted = new Set(args.changeSet.deleted.map((item) => item.rowId));
  const nextRows = rows
    .filter((row) => !deleted.has(row.userId))
    .map((row) => ({ ...row, ...(updates.get(row.userId) ?? {}) }));
  return [...args.changeSet.created, ...nextRows];
}

export function UserManagementPage() {
  const { t } = useI18n();
  const [rows, setRows] = useState<DemoUserRow[]>(() => [...INITIAL_DEMO_USERS]);
  const [dataVersion, setDataVersion] = useState(0);

  const validateCommit = useCallback((args: DataGridCrudCommitArgs<DemoUserRow>) => {
    const fieldErrors: Record<string, string> = {};

    for (const item of args.changeSet.updated) {
      const current = args.data.find((row) => row.userId === item.rowId);
      const loginId = String(item.patch.loginId ?? current?.loginId ?? '').trim();
      if (!loginId) {
        fieldErrors[`${item.rowId}.loginId`] = t('page.userManagement.validation.loginId');
      }
    }

    for (const row of args.changeSet.created) {
      if (!row.loginId?.trim()) {
        fieldErrors[`${row.userId}.loginId`] = t('page.userManagement.validation.loginId');
      }
    }

    return Object.keys(fieldErrors).length > 0 ? { valid: false, fieldErrors } : true;
  }, [t]);

  return (
    <PageLayout
      contentVariant="fill"
      header={
        <PageHeader
          title={t('menu.userManagement')}
          description={t('page.userManagement.description')}
        />
      }
    >
      <div className={styles.workarea}>
        <GenDataGridCrud
          className={styles.crud}
          title={t('menu.userManagement')}
          data={rows}
          columns={userManagementColumns}
          getRowId={(row) => row.userId}
          dataVersion={dataVersion}
          createRow={() => ({
            userId: `new-${Date.now()}`,
            loginId: '',
            displayName: t('page.userManagement.newUser'),
            email: '',
            active: true,
          })}
          validateCommit={validateCommit}
          onCommit={async (args) => {
            setRows(applyUserCommit(rows, args));
            setDataVersion((version) => version + 1);
            return { ok: true };
          }}
          gridProps={{
            enableColumnFilters: true,
            enableColumnSizing: true,
          }}
        />
      </div>
    </PageLayout>
  );
}

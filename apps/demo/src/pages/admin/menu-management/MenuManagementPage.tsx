/**
 * @file apps/demo/src/pages/admin/menu-management/MenuManagementPage.tsx
 * @description Hierarchical menu admin — GenDataGridCrud + tree rows (Gate D4).
 * @created 2026-06-29
 *
 * @remark
 * - enableTreeRows + nested children mock data
 *
 */

import { useCallback, useState } from 'react';
import { GenDataGridCrud } from '@gen-office/gen-datagrid-crud';
import type { DataGridCrudCommitArgs } from '@gen-office/gen-datagrid-crud';
import { PageHeader, PageLayout } from '@gen-office/ui';
import { useI18n } from '../../../i18n';
import { menuManagementColumns } from './menuManagementColumns';
import {
  applyMenuCommit,
  DEFAULT_TREE_EXPANDED,
  INITIAL_MENU_ROWS,
} from './menuManagementData';
import type { MenuManagementRow } from './menuManagement.types';
import styles from './MenuManagementPage.module.css';

export function MenuManagementPage() {
  const { t } = useI18n();
  const [rows, setRows] = useState<MenuManagementRow[]>(() =>
    structuredClone(INITIAL_MENU_ROWS),
  );
  const [dataVersion, setDataVersion] = useState(0);
  const [treeExpandedRows, setTreeExpandedRows] = useState<Record<string, boolean>>(
    () => ({ ...DEFAULT_TREE_EXPANDED }),
  );

  const validateCommit = useCallback(
    (args: DataGridCrudCommitArgs<MenuManagementRow>) => {
      const fieldErrors: Record<string, string> = {};

      const checkRow = (row: MenuManagementRow) => {
        if (!row.menuName?.trim()) {
          fieldErrors[`${row.menuId}.menuName`] = t('page.menuManagement.validation.menuName');
        }
      };

      for (const item of args.changeSet.updated) {
        const current = args.data.find((row) => row.menuId === item.rowId);
        const menuName = String(item.patch.menuName ?? current?.menuName ?? '').trim();
        if (!menuName) {
          fieldErrors[`${item.rowId}.menuName`] = t('page.menuManagement.validation.menuName');
        }
      }

      for (const row of args.changeSet.created) {
        checkRow(row);
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
          title={t('menu.menuManagement')}
          description={t('page.menuManagement.description')}
        />
      }
    >
      <div className={styles.workarea}>
        <GenDataGridCrud
          className={styles.crud}
          title={t('menu.menuManagement')}
          data={rows}
          columns={menuManagementColumns}
          getRowId={(row) => row.menuId}
          dataVersion={dataVersion}
          createRow={() => ({
            menuId: `menu-new-${Date.now()}`,
            menuName: t('page.menuManagement.newMenu'),
            menuPath: '/new',
            componentName: '',
            sortOrder: 99,
            useYn: true,
          })}
          validateCommit={validateCommit}
          onCommit={async (args) => {
            setRows(applyMenuCommit(rows, args));
            setDataVersion((version) => version + 1);
            return { ok: true };
          }}
          gridProps={{
            enableTreeRows: true,
            getSubRows: (row: MenuManagementRow) => row.children,
            treeExpandedRows,
            onTreeExpandedRowsChange: setTreeExpandedRows,
            treeIndentWidth: 18,
            enableColumnFilters: true,
            enableColumnSizing: true,
            rowHeight: 34,
          }}
        />
      </div>
    </PageLayout>
  );
}

export default MenuManagementPage;

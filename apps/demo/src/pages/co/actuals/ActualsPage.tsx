/**
 * @file apps/demo/src/pages/co/actuals/ActualsPage.tsx
 * @description Readonly actuals inquiry — GenDataGridCrud (Gate D4 / Gate 12).
 * @created 2026-06-29
 *
 * @remark
 * - Mock refetch via dataVersion; chart context menu excluded per migration guide
 *
 */

import { useCallback, useMemo, useState } from 'react';
import { RefreshCw, Search, Settings } from 'lucide-react';
import { GenDataGridCrud } from '@gen-office/gen-datagrid-crud';
import { Button, StandardDialog } from '@gen-office/ui';
import { AdminPageLayout } from '../../../shared/components/AdminPageLayout';
import { PageHeader } from '../../../shared/components/PageHeader';
import { useI18n } from '../../../i18n';
import { ActualsFilterBar } from './ActualsFilterBar';
import { actualsColumns } from './actualsColumns';
import { filterActualsRows, MOCK_ACTUALS_SOURCE } from './actualsData';
import type { ActualsFilterState } from './actuals.types';
import styles from './ActualsPage.module.css';

const EMPTY_FILTERS: ActualsFilterState = {
  fiscalMonth: '',
  orgCd: '',
  acctCd: '',
};

export function ActualsPage() {
  const { t } = useI18n();
  const [draftFilters, setDraftFilters] = useState<ActualsFilterState>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<ActualsFilterState>(EMPTY_FILTERS);
  const [dataVersion, setDataVersion] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const rows = useMemo(
    () => filterActualsRows(MOCK_ACTUALS_SOURCE, appliedFilters),
    [appliedFilters, dataVersion],
  );

  const handleSearch = useCallback(() => {
    setAppliedFilters({ ...draftFilters });
    setDataVersion((version) => version + 1);
  }, [draftFilters]);

  const handleRefresh = useCallback(() => {
    setDataVersion((version) => version + 1);
  }, []);

  return (
    <AdminPageLayout
      contentVariant="fill"
      header={
        <PageHeader
          title={t('menu.actuals')}
          description={t('page.actuals.description')}
        />
      }
      filter={<ActualsFilterBar value={draftFilters} onChange={setDraftFilters} />}
    >
      <div className={styles.workarea}>
        <GenDataGridCrud
          className={styles.crud}
          title={t('menu.actuals')}
          readonly
          data={rows}
          columns={actualsColumns}
          getRowId={(row) => row.rowId}
          dataVersion={dataVersion}
          onExport={() => {
            window.alert(t('page.actuals.exportShell'));
          }}
          actionBar={{
            includeBuiltIns: ['filter', 'columnReorder', 'excel'],
            customActions: [
              {
                key: 'search',
                label: t('page.actuals.actions.search'),
                icon: <Search aria-hidden size={16} />,
                side: 'left',
                order: 1,
                onClick: () => handleSearch(),
              },
              {
                key: 'settings',
                label: t('page.actuals.actions.settings'),
                icon: <Settings aria-hidden size={16} />,
                side: 'right',
                order: 1,
                onClick: () => setSettingsOpen(true),
              },
              {
                key: 'refresh',
                label: t('page.actuals.actions.refresh'),
                icon: <RefreshCw aria-hidden size={16} />,
                side: 'right',
                order: 2,
                onClick: () => handleRefresh(),
              },
            ],
          }}
          gridProps={{
            enableVirtualization: true,
            enablePinning: true,
            enableColumnSizing: true,
            rowHeight: 32,
            defaultColumnPinning: {
              left: ['fiscalMonth', 'orgCd', 'orgName', 'acctCd', 'acctName'],
            },
          }}
        />
      </div>

      <StandardDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        title={t('page.actuals.settings.title')}
        footer={
          <Button type="button" size="sm" onClick={() => setSettingsOpen(false)}>
            {t('page.actuals.settings.close')}
          </Button>
        }
      >
        <div className={styles.settingsBody}>
          <p>{t('page.actuals.settings.description')}</p>
          <p>{t('page.actuals.settings.rowHeight')}</p>
          <p>{t('page.actuals.settings.virtualization')}</p>
        </div>
      </StandardDialog>
    </AdminPageLayout>
  );
}

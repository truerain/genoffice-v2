/**
 * @file apps/demo/src/pages/admin/user/UserPage.tsx
 * @description Reference admin CRUD screen — GenDataGridCrud + TanStack Query (Gate 데이터계층).
 * @created 2026-06-29
 *
 * @remark
 * - 데이터: useUsersQuery(파라미터 조회) + useCommitUsersMutation(쓰기)
 * - 필터: StandardFilterBar(draft) → 검색 시 applied 반영 → queryKey 변경으로 refetch
 * - onCommit → buildUserCommitPayload(changeSet) 전송 후 목록 invalidate
 *
 * @history
 * - 2026-07-08 데이터계층: 직접 import → react-query 훅 + httpClient
 * - 2026-07-08 V1 패턴: 파라미터 필터(StandardFilterBar) + 커밋 매핑 격리
 */

import { useCallback, useMemo, useState } from 'react';
import { GenDataGridCrud } from '@gen-office/gen-datagrid-crud';
import type { DataGridCrudCommitArgs } from '@gen-office/gen-datagrid-crud';
import { PageHeader, PageLayout, StandardFilterBar } from '@gen-office/ui';
import type { FilterField } from '@gen-office/ui';
import { useI18n } from '../../../i18n';
import { userColumns } from './userColumns';
import { NEW_ROW_ID_PREFIX, type DemoUserRow, type UserListParams } from './user.types';
import { useCommitUsersMutation, useUsersQuery } from './useUsers';
import { buildUserCommitPayload } from './userCommit';
import styles from './UserPage.module.css';

const EMPTY_FILTERS: UserListParams = { empName: '' };

export function UserPage() {
  const { t } = useI18n();
  const [draftFilters, setDraftFilters] = useState<UserListParams>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<UserListParams>(EMPTY_FILTERS);

  const queryParams = useMemo<UserListParams>(
    () => ({ empName: appliedFilters.empName?.trim() || undefined }),
    [appliedFilters],
  );

  const { data: rows = [], dataUpdatedAt, refetch } = useUsersQuery(queryParams);
  const commitUsers = useCommitUsersMutation();

  const filterFields = useMemo<FilterField<UserListParams>[]>(
    () => [
      {
        key: 'empName',
        type: 'text',
        label: t('page.userManagement.filters.empName'),
        placeholder: t('page.userManagement.filters.empNamePlaceholder'),
        enterToSearch: true,
        size: 'md',
      },
    ],
    [t],
  );

  const handleSearch = useCallback(() => {
    if ((draftFilters.empName ?? '') === (appliedFilters.empName ?? '')) {
      void refetch();
      return;
    }
    setAppliedFilters({ ...draftFilters });
  }, [draftFilters, appliedFilters, refetch]);

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

  const handleCommit = useCallback(
    async (args: DataGridCrudCommitArgs<DemoUserRow>) => {
      await commitUsers.mutateAsync(buildUserCommitPayload(args));
      return { ok: true };
    },
    [commitUsers],
  );

  return (
    <PageLayout
      contentVariant="fill"
      header={
        <PageHeader
          title={t('menu.userManagement')}
          description={t('page.userManagement.description')}
        />
      }
      filter={
        <StandardFilterBar
          value={draftFilters}
          fields={filterFields}
          onChange={setDraftFilters}
          onSearch={handleSearch}
          searchLabel={t('page.userManagement.filters.search')}
        />
      }
    >
      <div className={styles.workarea}>
        <GenDataGridCrud
          className={styles.crud}
          title={t('menu.userManagement')}
          data={rows}
          columns={userColumns}
          getRowId={(row) => row.userId}
          dataVersion={dataUpdatedAt}
          createRow={() => ({
            userId: `${NEW_ROW_ID_PREFIX}${Date.now()}`,
            loginId: '',
            empNo: '',
            empName: '',
            empNameEng: '',
            displayName: t('page.userManagement.newUser'),
            email: '',
            langCd: 'ko',
            active: true,
          })}
          validateCommit={validateCommit}
          onCommit={handleCommit}
          gridProps={{
            enableColumnFilters: true,
            enableColumnSizing: true,
          }}
        />
      </div>
    </PageLayout>
  );
}

export default UserPage;

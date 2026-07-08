/**
 * @file apps/demo/src/pages/admin/user/UserPage.tsx
 * @description Reference admin CRUD screen — GenDataGridCrud + TanStack Query (Gate 데이터계층).
 * @created 2026-06-29
 *
 * @remark
 * - 조회: userQuery(useUsersQuery) / 쓰기: userMutation(useUserMutations)
 * - 필터: StandardFilterBar(draft) → 검색 시 applied 반영 → queryKey 변경으로 refetch
 *
 * @history
 * - 2026-07-08 데이터계층: 직접 import → react-query 훅 + httpClient
 * - 2026-07-08 V1 패턴: 파라미터 필터(StandardFilterBar) + 커밋 매핑 격리
 * - 2026-07-08 데이터 훅 분리: userQuery(조회)/userMutation(쓰기) 컨벤션
 */

import { useCallback, useMemo, useState } from 'react';
import { GenDataGridCrud } from '@gen-office/gen-datagrid-crud';
import { PageHeader, PageLayout, StandardFilterBar } from '@gen-office/ui';
import type { FilterField } from '@gen-office/ui';
import { useI18n } from '../../../i18n';
import { userColumns } from './userColumns';
import type { UserListParams } from './user.types';
import { useUsersQuery } from './userQuery';
import { useUserMutations } from './userMutation';
import styles from './UserPage.module.css';

const EMPTY_FILTERS: UserListParams = { empName: '' };

export function UserPage() {
  const { t } = useI18n();
  // 화면 검색조건 (입력중=draft, 조회적용=applied) 
  const [draftFilters, setDraftFilters] = useState<UserListParams>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<UserListParams>(EMPTY_FILTERS);

  // API 호출용 검색조건
  const queryParams = useMemo<UserListParams>(
    () => ({ empName: appliedFilters.empName?.trim() || undefined }),
    [appliedFilters],
  );

  // 데이터 조회용 Hook 호출
  const { data: rows = [], dataUpdatedAt, refetch } = useUsersQuery(queryParams);
  // CUD용 Hook 호출
  const { newRow, validateCommit, handleCommit } = useUserMutations();

  // 검색조건 필드 정의
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

  // 검색실행(검색버튼 클릭, 필드에서 Enter등) Handler
  const handleSearch = useCallback(() => {
    if ((draftFilters.empName ?? '') === (appliedFilters.empName ?? '')) {
      void refetch();
      return;
    }
    setAppliedFilters({ ...draftFilters });
  }, [draftFilters, appliedFilters, refetch]);

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
          createRow={newRow}
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

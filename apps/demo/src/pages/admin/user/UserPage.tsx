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
 * - 2026-07-09 Gate 8.2 패턴: MasterDetail Row 사용자 상세 폼 조회
 * - 2026-07-08 데이터계층: 직접 import → react-query 훅 + httpClient
 * - 2026-07-08 V1 패턴: 파라미터 필터(StandardFilterBar) + 커밋 매핑 격리
 * - 2026-07-08 데이터 훅 분리: userQuery(조회)/userMutation(쓰기) 컨벤션
 * - 2026-07-09 useYn: 셀 render Switch toggle (편집 모드 없음)
 * - 2026-07-09 orgId 부서 Modal lookup 검색
 * - 2026-07-09 TITLE_CD 공통코드 — titleCd select·titleName 표시
 * - 2026-07-09 USE_YN 공통코드 FilterBar select 연동
 */

import { useCallback, useMemo, useRef, useState } from 'react';
import type { GenDataGridHandle } from '@gen-office/gen-datagrid';
import { GenDataGridCrud } from '@gen-office/gen-datagrid-crud';
import { PageHeader, PageLayout, StandardFilterBar } from '@gen-office/ui';
import type { FilterField } from '@gen-office/ui';
import { useI18n } from '../../../i18n';
import { useCommonCodesQuery } from '../../../shared/api/commonCodeQuery';
import { useOrgsQuery } from '../../../shared/api/orgQuery';
import { LKUP_CLSS_CD } from '../../../shared/domain/lkupClssCd';
import { createUserColumns } from './userColumns';
import { EMPTY_USER_GRID_CELL_BRIDGE } from './userGridCellBridge';
import type { UserListParams, UserRow } from './user.types';
import { useUsersQuery } from './userQuery';
import { useUserMutations } from './userMutation';
import styles from '../../../shared/styles/standardLayout.module.css';
import detailStyles from './userDetailPanel.module.css';

const EMPTY_FILTERS: UserListParams = { empName: '', useYn: '' };

export function UserPage() {
  const { t } = useI18n();
  // 화면 검색조건 (입력중=draft, 조회적용=applied) 
  const [draftFilters, setDraftFilters] = useState<UserListParams>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<UserListParams>(EMPTY_FILTERS);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // API 호출용 검색조건
  const queryParams = useMemo<UserListParams>(
    () => ({
      empName: appliedFilters.empName?.trim() || undefined,
      useYn: appliedFilters.useYn?.trim() || undefined,
    }),
    [appliedFilters],
  );

  const { data: useYnCodes = [] } = useCommonCodesQuery(LKUP_CLSS_CD.USE_YN);
  const { data: titleCodes = [] } = useCommonCodesQuery(LKUP_CLSS_CD.TITLE_CD);
  const { data: orgs = [] } = useOrgsQuery();

  const gridRef = useRef<GenDataGridHandle<UserRow>>(null);
  const cellBridgeRef = useRef({ ...EMPTY_USER_GRID_CELL_BRIDGE });
  cellBridgeRef.current.emitCellValueChange = (args) => {
    gridRef.current?.emitCellValueChange(args);
  };
  cellBridgeRef.current.readonly = false;

  const columns = useMemo(
    () => createUserColumns(titleCodes, orgs, cellBridgeRef),
    [titleCodes, orgs],
  );

  // 데이터 조회용 Hook 호출
  const { data: rows = [], dataUpdatedAt, refetch } = useUsersQuery(queryParams);
  // CUD용 Hook 호출
  const { newRow, validateCommit, handleCommit } = useUserMutations();

  const renderDetailPanel = useCallback(
    ({ row, collapse }: { row: UserRow; collapse: () => void }) => (
      <div className={detailStyles.panel}>
        <div className={detailStyles.titleRow}>
          <strong>{row.empName || row.loginId || row.userId || '사용자 상세'}</strong>
          <button
            type="button"
            className={detailStyles.collapseButton}
            onClick={collapse}
          >
            닫기
          </button>
        </div>
        <div className={detailStyles.formGrid}>
          <span className={detailStyles.label}>사용자 ID</span>
          <span className={detailStyles.value}>{row.userId || '-'}</span>
          <span className={detailStyles.label}>Login ID</span>
          <span className={detailStyles.value}>{row.loginId || '-'}</span>
          <span className={detailStyles.label}>사번</span>
          <span className={detailStyles.value}>{row.empNo || '-'}</span>
          <span className={detailStyles.label}>사용자명</span>
          <span className={detailStyles.value}>{row.empName || '-'}</span>
          <span className={detailStyles.label}>영문명</span>
          <span className={detailStyles.value}>{row.empNameEng || '-'}</span>
          <span className={detailStyles.label}>Email</span>
          <span className={detailStyles.value}>{row.email || '-'}</span>
          <span className={detailStyles.label}>부서</span>
          <span className={detailStyles.value}>{row.orgName || row.orgId || '-'}</span>
          <span className={detailStyles.label}>직책</span>
          <span className={detailStyles.value}>{row.titleName || row.titleCd || '-'}</span>
          <span className={detailStyles.label}>사용 여부</span>
          <span className={detailStyles.value}>{row.useYn === 'Y' ? '사용' : '미사용'}</span>
          <span className={detailStyles.label}>최종수정시간</span>
          <span className={detailStyles.value}>{row.lastUpdatedDate || '-'}</span>
          <span className={detailStyles.label}>최종수정자</span>
          <span className={detailStyles.value}>{row.lastUpdatedName || '-'}</span>
        </div>
      </div>
    ),
    [],
  );

  const useYnOptions = useMemo(
    () => [
      { label: t('page.userManagement.filters.useYnAll'), value: '' },
      ...useYnCodes.map((code) => ({ label: code.lkupName, value: code.lkupCd })),
    ],
    [t, useYnCodes],
  );

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
      {
        key: 'useYn',
        type: 'select',
        label: t('page.userManagement.filters.useYn'),
        options: useYnOptions,
        size: 'sm',
      },
    ],
    [t, useYnOptions],
  );

  // 검색실행(검색버튼 클릭, 필드에서 Enter등) Handler
  const handleSearch = useCallback(() => {
    const draftEmp = draftFilters.empName ?? '';
    const appliedEmp = appliedFilters.empName ?? '';
    const draftUseYn = draftFilters.useYn ?? '';
    const appliedUseYn = appliedFilters.useYn ?? '';
    if (draftEmp === appliedEmp && draftUseYn === appliedUseYn) {
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
          className={styles.fill}
          title={t('menu.userManagement')}
          data={rows}
          columns={columns}
          getRowId={(row: UserRow) => row.userId}
          dataVersion={dataUpdatedAt}
          createRow={newRow}
          validateCommit={validateCommit}
          onCommit={handleCommit}
          gridRef={gridRef}
          gridProps={{
            enableColumnFilters: true,
            enableColumnSizing: true,
            enableMasterDetail: true,
            expandedRows,
            onExpandedRowsChange: setExpandedRows,
            renderDetailPanel,
            detailPanelHeight: 248,
          }}
        />
      </div>
    </PageLayout>
  );
}

export default UserPage;

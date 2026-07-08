/**
 * @file apps/demo/src/pages/admin/user/userMutation.ts
 * @description User admin 쓰기(CUD) 훅 — 행 생성/검증/커밋 매핑 + 커밋 mutation.
 * @created 2026-07-08
 *
 * @remark
 * - useUserMutations(): newRow / validateCommit / handleCommit / isCommitting 제공(페이지 결선용)
 * - 순수 매핑 toUserRequest / buildUserCommitPayload는 훅이 소비
 * - 조회는 userQuery.ts(useUsersQuery)로 분리(읽기/쓰기 분리)
 *
 */

import { useCallback } from 'react';
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';
import type {
  DataGridCrudCommitArgs,
  DataGridCrudValidationResult,
} from '@gen-office/gen-datagrid-crud';
import { useI18n } from '../../../i18n';
import { buildCommitPayload } from '../../../shared/api/commit';
import { commitUsers, userKeys, type UserCommitPayload } from './userApi';
import { NEW_ID, NEW_ROW_ID_PREFIX, type UserRow, type UserRequest } from './user.types';

/**
 * [메인] Page가 사용하는 쓰기(CUD) 훅.
 * 페이지는 이 훅만 연결하면 되고, 아래의 세부 함수는 몰라도 됩니다.
 * - newRow: 그리드 '행 추가' 시 넣을 빈 행을 만든다
 * - validateCommit: 저장 직전 입력값을 검증한다
 * - handleCommit: 변경분을 서버로 저장한다
 * - isCommitting: 저장 진행 중 여부(저장 버튼 비활성화 등에 사용)
 */
export function useUserMutations() {
  const { t } = useI18n();
  const commit = useCommitUsersMutation();

  // 그리드에서 '행 추가'를 누르면 들어갈 기본값 행. 임시 id(new-*)를 붙여 신규임을 표시한다.
  const newRow = useCallback(
    (): UserRow => ({
      userId: `${NEW_ROW_ID_PREFIX}${Date.now()}`,
      loginId: '',
      empNo: '',
      empName: '',
      empNameEng: '',
      displayName: t('page.userManagement.newUser'),
      email: '',
      langCd: 'ko',
      active: true,
    }),
    [t],
  );

  // 저장 직전 검증. 문제가 있으면 { valid:false, fieldErrors }를 반환해 저장을 중단시킨다.
  const validateCommit = useCallback(
    (args: DataGridCrudCommitArgs<UserRow>): DataGridCrudValidationResult => {
      const fieldErrors: Record<string, string> = {};

      // 수정된 행: 로그인ID는 비어 있으면 안 된다
      for (const item of args.changeSet.updated) {
        const current = args.data.find((row) => row.userId === item.rowId);
        const loginId = String(item.patch.loginId ?? current?.loginId ?? '').trim();
        if (!loginId) {
          fieldErrors[`${item.rowId}.loginId`] = t('page.userManagement.validation.loginId');
        }
      }

      // 새로 추가된 행: 동일하게 로그인ID 필수
      for (const row of args.changeSet.created) {
        if (!row.loginId?.trim()) {
          fieldErrors[`${row.userId}.loginId`] = t('page.userManagement.validation.loginId');
        }
      }

      return Object.keys(fieldErrors).length > 0 ? { valid: false, fieldErrors } : true;
    },
    [t],
  );

  // 저장 버튼 → 변경분(changeSet)을 payload로 바꿔 서버에 보낸다. { ok:true }면 그리드가 저장완료 처리.
  const handleCommit = useCallback(
    async (args: DataGridCrudCommitArgs<UserRow>) => {
      await commit.mutateAsync(buildUserCommitPayload(args));
      return { ok: true };
    },
    [commit],
  );

  return { newRow, validateCommit, handleCommit, isCommitting: commit.isPending };
}

/**
 * 실제 서버 커밋(POST)을 수행하는 하위 훅.
 * 성공하면 사용자 목록 캐시를 무효화(invalidate)해서 화면이 자동으로 최신 목록을 다시 불러온다.
 */
function useCommitUsersMutation(): UseMutationResult<UserRow[], Error, UserCommitPayload> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserCommitPayload) => commitUsers(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.all() });
    },
  });
}

/**
 * 그리드 변경분(changeSet)을 서버 전송용 payload(created/updated/deleted)로 변환한다.
 * 공용 빌더 buildCommitPayload에 '행 1건 → 요청 변환기'(toUserRequest)만 넘겨 재사용한다.
 */
export function buildUserCommitPayload(
  args: DataGridCrudCommitArgs<UserRow>,
): UserCommitPayload {
  return buildCommitPayload(args, toUserRequest);
}

/**
 * 그리드 행(UserRow) 1건 → 서버 요청 DTO(UserRequest) 변환.
 * - 서버로 보낼 편집 필드만 골라 담는다(titleName 같은 파생/조인 필드는 제외).
 * - 신규 행이면 임시 id 대신 채번용 sentinel(NEW_ID)로 바꿔 서버가 INSERT로 처리하게 한다.
 */
function toUserRequest(row: UserRow): UserRequest {
  return {
    userId: row.userId.startsWith(NEW_ROW_ID_PREFIX) ? NEW_ID : row.userId,
    loginId: row.loginId,
    empNo: row.empNo,
    empName: row.empName,
    empNameEng: row.empNameEng,
    displayName: row.displayName,
    email: row.email,
    orgId: row.orgId,
    titleCd: row.titleCd,
    langCd: row.langCd,
    active: row.active,
  };
}
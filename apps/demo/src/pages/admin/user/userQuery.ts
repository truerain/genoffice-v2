/**
 * @file apps/demo/src/pages/admin/user/userQuery.ts
 * @description User admin 조회(read) 훅 모음.
 * @created 2026-07-08
 *
 * @remark
 * - useUsersQuery(params): 파라미터 스코프 목록(읽기)
 * - 화면 조회가 늘면 여기에 리소스별 훅을 추가(각자 캐시)
 * - 쓰기(CUD)는 userMutation.ts로 분리
 *
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchUsers, userKeys } from './userApi';
import type { UserRow, UserListParams } from './user.types';

export function useUsersQuery(
  params: UserListParams = {},
): UseQueryResult<UserRow[], Error> {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => fetchUsers(params),
  });
}

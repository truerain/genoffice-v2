/**
 * @file apps/demo/src/pages/admin/user/useUsers.ts
 * @description TanStack Query hooks for user admin (list + commit).
 * @created 2026-07-08
 *
 * @remark
 * - useUsersQuery(params): 파라미터 스코프 목록
 * - useCommitUsersMutation: 커밋 후 목록 invalidate
 *
 * @history
 * - 2026-07-08 V1 패턴: userKeys 팩토리 + UserListParams 파라미터화
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import { commitUsers, fetchUsers, userKeys, type UserCommitPayload } from './userApi';
import type { DemoUserRow, UserListParams } from './user.types';

export function useUsersQuery(
  params: UserListParams = {},
): UseQueryResult<DemoUserRow[], Error> {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => fetchUsers(params),
  });
}

export function useCommitUsersMutation(): UseMutationResult<
  DemoUserRow[],
  Error,
  UserCommitPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserCommitPayload) => commitUsers(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.all() });
    },
  });
}

/**
 * @file apps/demo/src/pages/admin/user/userApi.ts
 * @description User admin data access via httpClient (Gate 데이터계층).
 * @created 2026-07-08
 *
 * @remark
 * - GET /api/admin/users(?empName), POST /api/admin/users/commit
 * - dev mock은 MSW(userHandlers)가 처리
 *
 * @history
 * - 2026-07-08 V1 패턴: userKeys 팩토리 + UserListParams + UserRequest 기반 커밋
 */

import { httpClient } from '../../../shared/api/httpClient';
import type { CommitPayload } from '../../../shared/api/commit';
import type { DemoUserRow, UserListParams, UserRequest } from './user.types';

export const userKeys = {
  all: () => ['admin', 'users'] as const,
  list: (params: UserListParams) => ['admin', 'users', 'list', params] as const,
};

export type UserCommitPayload = CommitPayload<UserRequest>;

interface UserListResponse {
  items: DemoUserRow[];
}

function buildQuery(params?: UserListParams): string {
  if (!params) return '';
  const search = new URLSearchParams();
  const empName = params.empName?.trim();
  if (empName) search.set('empName', empName);
  const query = search.toString();
  return query ? `?${query}` : '';
}

export async function fetchUsers(params?: UserListParams): Promise<DemoUserRow[]> {
  const response = await httpClient.get<UserListResponse>(`/api/admin/users${buildQuery(params)}`);
  return response.items;
}

export async function commitUsers(payload: UserCommitPayload): Promise<DemoUserRow[]> {
  const response = await httpClient.post<UserListResponse>('/api/admin/users/commit', payload);
  return response.items;
}

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
import type { UserRow, UserListParams, UserRequest } from './user.types';

/**
 * [메인] 사용자 목록 조회 API. 검색조건을 querystring으로 붙여 GET 요청한다.
 * dev 환경에서는 MSW(userHandlers)가 이 요청을 가로채 mock 데이터를 응답한다.
 */
export async function fetchUsers(params?: UserListParams): Promise<UserRow[]> {
  const response = await httpClient.get<UserListResponse>(`/api/admin/users${buildQuery(params)}`);
  return response.items;
}

/**
 * [메인] 사용자 변경분 저장 API. created/updated/deleted를 한 번에 POST하고 최신 목록을 돌려받는다.
 */
export async function commitUsers(payload: UserCommitPayload): Promise<UserRow[]> {
  const response = await httpClient.post<UserListResponse>('/api/admin/users/commit', payload);
  return response.items;
}

/**
 * react-query 캐시 키 팩토리. 같은 키는 캐시를 공유하고, 키가 바뀌면 자동으로 다시 조회한다.
 * - all():        사용자 관련 전체(커밋 후 무효화 기준)
 * - list(params): 검색조건별 목록 캐시
 */
export const userKeys = {
  all: () => ['admin', 'users'] as const,
  list: (params: UserListParams) => ['admin', 'users', 'list', params] as const,
};

/** 커밋 payload 타입(created/updated/deleted). 공용 CommitPayload를 UserRequest로 특수화한 것. */
export type UserCommitPayload = CommitPayload<UserRequest>;

/** 서버 목록 응답 형태. 목록은 항상 { items } 안에 담겨 온다. */
interface UserListResponse {
  items: UserRow[];
}

/** 검색조건 객체 → querystring('?empName=...'). 값이 없으면 빈 문자열을 돌려준다. */
function buildQuery(params?: UserListParams): string {
  if (!params) return '';
  const search = new URLSearchParams();
  const empName = params.empName?.trim();
  if (empName) search.set('empName', empName);
  const useYn = params.useYn?.trim();
  if (useYn) search.set('useYn', useYn);
  const query = search.toString();
  return query ? `?${query}` : '';
}

/**
 * @file apps/demo/src/shared/api/orgApi.ts
 * @description Organization lookup transport — GET /api/admin/orgs (Gate 데이터계층).
 * @created 2026-07-09
 *
 * @remark
 * - Query: `search` (부서명·코드 부분 일치)
 * - dev mock은 MSW(orgHandlers)가 처리
 */

import type { Org } from '../domain/org.types';
import { httpClient } from './httpClient';

interface OrgListResponse {
  items: Org[];
}

/**
 * [메인] 부서 목록 조회. 검색어가 있으면 서버( mock )에서 필터링한다.
 */
export async function fetchOrgs(search?: string): Promise<Org[]> {
  const params = new URLSearchParams();
  const term = search?.trim();
  if (term) params.set('search', term);

  const query = params.toString();
  const response = await httpClient.get<OrgListResponse>(
    query ? `/api/admin/orgs?${query}` : '/api/admin/orgs',
  );
  return response.items;
}

/** react-query 캐시 키 팩토리 */
export const orgKeys = {
  all: () => ['admin', 'orgs'] as const,
  list: (search?: string) => ['admin', 'orgs', search ?? ''] as const,
};

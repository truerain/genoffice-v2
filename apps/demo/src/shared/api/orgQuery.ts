/**
 * @file apps/demo/src/shared/api/orgQuery.ts
 * @description Organization lookup read hooks.
 * @created 2026-07-09
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { Org } from '../domain/org.types';
import { fetchOrgs, orgKeys } from './orgApi';

/**
 * [메인] 부서 목록 조회 훅 — Popup lookup editor 옵션 소스.
 */
export function useOrgsQuery(): UseQueryResult<Org[], Error> {
  return useQuery({
    queryKey: orgKeys.list(),
    queryFn: () => fetchOrgs(),
    staleTime: 5 * 60 * 1000,
  });
}

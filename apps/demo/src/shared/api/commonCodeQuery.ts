/**
 * @file apps/demo/src/shared/api/commonCodeQuery.ts
 * @description Common lookup code read hooks.
 * @created 2026-07-09
 *
 * @remark
 * - 화면 공통 조회 훅 — transport는 commonCodeApi
 *
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { Lkup } from '../domain/lkup.types';
import { commonCodeKeys, fetchCommonCodes } from './commonCodeApi';

/**
 * [메인] 분류 코드별 공통코드 목록 조회 훅 (FilterBar select 옵션 등).
 */
export function useCommonCodesQuery(clssCd: string): UseQueryResult<Lkup[], Error> {
  const codeClass = clssCd.trim();

  return useQuery({
    queryKey: commonCodeKeys.list(codeClass),
    queryFn: () => fetchCommonCodes(codeClass),
    enabled: codeClass.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

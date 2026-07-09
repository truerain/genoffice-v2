/**
 * @file apps/demo/src/shared/api/commonCodeApi.ts
 * @description Common lookup code transport — GET /api/common/code (Gate 데이터계층).
 * @created 2026-07-09
 *
 * @remark
 * - Query: `clss-cd` (lookup class code)
 * - dev mock은 MSW(commonHandlers)가 처리
 *
 */

import type { Lkup } from '../domain/lkup.types';
import { httpClient } from './httpClient';

const COMMON_CODE_QUERY_PARAM = 'clss-cd';

interface CommonCodeListResponse {
  items: Lkup[];
}

/**
 * [메인] 공통코드 목록 조회. 분류 코드별 옵션 목록을 반환한다.
 */
export async function fetchCommonCodes(clssCd: string): Promise<Lkup[]> {
  const codeClass = clssCd.trim();
  if (!codeClass) {
    return [];
  }

  const search = new URLSearchParams({ [COMMON_CODE_QUERY_PARAM]: codeClass });
  const response = await httpClient.get<CommonCodeListResponse>(
    `/api/common/code?${search.toString()}`,
  );
  return response.items;
}

/** react-query 캐시 키 팩토리 */
export const commonCodeKeys = {
  all: () => ['common', 'code'] as const,
  list: (clssCd: string) => ['common', 'code', clssCd] as const,
};

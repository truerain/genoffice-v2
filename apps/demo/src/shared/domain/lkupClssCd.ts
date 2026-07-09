/**
 * @file apps/demo/src/shared/domain/lkupClssCd.ts
 * @description Lookup class code constants for GET /api/common/code.
 * @created 2026-07-09
 *
 * @remark
 * - Query param `clss-cd` 값의 단일 정본
 *
 */

export const LKUP_CLSS_CD = {
  USE_YN: 'USE_YN',
  TITLE_CD: 'TITLE_CD',
} as const;

export type LkupClssCd = (typeof LKUP_CLSS_CD)[keyof typeof LKUP_CLSS_CD];

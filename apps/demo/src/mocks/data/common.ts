/**
 * @file apps/demo/src/mocks/data/common.ts
 * @description Mock server seed for common lookup codes (MSW commonHandlers).
 * @created 2026-07-09
 *
 * @remark
 * - commonHandlers가 이 시드를 복제해 in-memory 서버 상태로 사용
 *
 */

import { LKUP_CLSS_CD } from '../../shared/domain/lkupClssCd';
import type { Lkup } from '../../shared/domain/lkup.types';

export const INITIAL_CODE: Lkup[] = [
  {
    lkupClssCd: LKUP_CLSS_CD.USE_YN,
    lkupCd: 'Y',
    lkupName: 'Yes',
  },
  {
    lkupClssCd: LKUP_CLSS_CD.USE_YN,
    lkupCd: 'N',
    lkupName: 'No',
  },
];

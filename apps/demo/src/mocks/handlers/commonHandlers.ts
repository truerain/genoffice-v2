/**
 * @file apps/demo/src/mocks/handlers/commonHandlers.ts
 * @description MSW handlers for common lookup codes.
 * @created 2026-07-09
 *
 * @remark
 * - GET /api/common/code?clss-cd={lkupClssCd}
 *
 */

import { http, HttpResponse, type HttpHandler } from 'msw';
import { getApiBaseUrl } from '../../shared/api/env';
import type { Lkup } from '../../shared/domain/lkup.types';
import { INITIAL_CODE } from '../data/common';

let store: Lkup[] = INITIAL_CODE.map((row) => ({ ...row }));

const base = getApiBaseUrl().replace(/\/$/, '');

export const commonHandlers: HttpHandler[] = [
  http.get(`${base}/api/common/code`, ({ request }) => {
    const url = new URL(request.url);
    const clssCd = url.searchParams.get('clss-cd')?.trim() ?? '';
    const items = clssCd
      ? store.filter((row) => row.lkupClssCd.toLowerCase() === clssCd.toLowerCase())
      : [];
    return HttpResponse.json({ items });
  }),
];

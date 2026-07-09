/**
 * @file apps/demo/src/mocks/handlers/orgHandlers.ts
 * @description MSW handlers for organization lookup.
 * @created 2026-07-09
 *
 * @remark
 * - GET /api/admin/orgs(?search)
 */

import { http, HttpResponse, type HttpHandler } from 'msw';
import { getApiBaseUrl } from '../../shared/api/env';
import { filterOrgs } from '../../shared/domain/orgResolve';
import { INITIAL_DEMO_ORGS } from '../data/orgs';

const base = getApiBaseUrl().replace(/\/$/, '');

export const orgHandlers: HttpHandler[] = [
  http.get(`${base}/api/admin/orgs`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') ?? '';
    const items = filterOrgs(INITIAL_DEMO_ORGS, search);
    return HttpResponse.json({ items });
  }),
];

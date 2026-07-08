/**
 * @file apps/demo/src/mocks/handlers/appMenuHandlers.ts
 * @description MSW handler for app shell menu (GET /api/app-menu).
 * @created 2026-07-08
 *
 * @remark
 * - MOCK_MENU_ITEMS(V1 flat rows → tree)를 응답
 *
 */

import { http, HttpResponse } from 'msw';
import { getApiBaseUrl } from '../../shared/api/env';
import { MOCK_MENU_ITEMS } from '../../app/menu/mockMenu';

const base = getApiBaseUrl().replace(/\/$/, '');

export const appMenuHandlers = [
  http.get(`${base}/api/app-menu`, () => HttpResponse.json({ items: MOCK_MENU_ITEMS })),
];

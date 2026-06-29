/**
 * @file apps/demo/src/shared/api/appMenuApi.ts
 * @description App menu loader — API or mock (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 * - Real endpoint: GET /api/app-menu
 *
 */

import type { AppMenuResponse } from '../../app/menu/menu.types';
import { MOCK_MENU_ITEMS } from '../../app/menu/mockMenu';
import { useMockMenu } from './env';
import { httpClient } from './httpClient';

export async function fetchAppMenu(): Promise<AppMenuResponse> {
  if (useMockMenu()) {
    return { items: MOCK_MENU_ITEMS };
  }
  return httpClient.get<AppMenuResponse>('/api/app-menu');
}

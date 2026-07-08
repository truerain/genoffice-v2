/**
 * @file apps/demo/src/shared/api/appMenuApi.ts
 * @description App menu loader (GET /api/app-menu).
 * @created 2026-06-28
 *
 * @remark
 * - dev mock은 MSW(appMenuHandlers)가 네트워크를 가로챔
 *
 * @history
 * - 2026-07-08 데이터계층: in-code mock 분기 제거(MSW로 일원화)
 */

import type { AppMenuResponse } from '../../app/menu/menu.types';
import { httpClient } from './httpClient';

export async function fetchAppMenu(): Promise<AppMenuResponse> {
  return httpClient.get<AppMenuResponse>('/api/app-menu');
}

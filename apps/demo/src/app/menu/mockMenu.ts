/**
 * @file apps/demo/src/app/menu/mockMenu.ts
 * @description Static mock menu for VITE_USE_MOCK_MENU mode (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 * - V1 flat rows: src/mocks/data/menu.ts → buildAppMenuFromV1 tree
 *
 */

import { buildAppMenuItemsFromV1 } from './buildAppMenuFromV1';
import { loadAppMenuData } from '../../mocks/data/menu';

export const MOCK_MENU_ITEMS = buildAppMenuItemsFromV1(loadAppMenuData());

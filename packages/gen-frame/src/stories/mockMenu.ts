/**
 * @file packages/gen-frame/src/stories/mockMenu.ts
 * @description Mock menu for GenFrame Storybook stories.
 * @created 2026-06-29
 *
 * @remark
 *
 */

import type { FrameMenuItem } from '../types';

export const MOCK_FRAME_MENU_ITEMS: FrameMenuItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'chart-demo', label: 'Chart Demo' },
  { id: 'dashboard', label: 'Dashboard' },
  {
    id: 'admin',
    label: 'Admin',
    children: [
      { id: 'users', label: 'User Management' },
      { id: 'menus', label: 'Menu Management' },
    ],
  },
];

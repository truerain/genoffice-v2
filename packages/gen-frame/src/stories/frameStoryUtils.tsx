/**
 * @file packages/gen-frame/src/stories/frameStoryUtils.tsx
 * @description Shared helpers for GenFrame Storybook stories.
 * @created 2026-06-29
 *
 * @remark
 *
 */

import type { CSSProperties } from 'react';
import { MOCK_FRAME_MENU_ITEMS } from './mockMenu';
import type { FrameMenuItem } from '../types';

export const frameStyle: CSSProperties = {
  width: '100%',
  maxWidth: 960,
  height: 480,
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid var(--color-border-default)',
  borderRadius: 8,
  overflow: 'hidden',
  minHeight: 0,
};

export const workareaPanelStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  color: 'var(--color-fg-secondary)',
  fontSize: 14,
};

export function flattenMenuItems(items: FrameMenuItem[] = MOCK_FRAME_MENU_ITEMS): FrameMenuItem[] {
  return items.flatMap((item) => (item.children ? [item, ...item.children] : [item]));
}

export function findMenuItem(activeId: string, items: FrameMenuItem[] = MOCK_FRAME_MENU_ITEMS) {
  return flattenMenuItems(items).find((item) => item.id === activeId);
}

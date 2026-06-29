/**
 * @file packages/gen-frame/src/types/frame.types.ts
 * @description Workspace frame layout and component props.
 * @created 2026-06-29
 *
 * @remark
 * - F1 implements leftPanel only; other modes are typed for forward compatibility
 *
 */

import type { ReactNode } from 'react';
import type { FrameMenuItem, FrameMenuModel } from './menu.types';

export type FrameLayoutMode = 'leftPanel' | 'titleBar' | 'hybrid' | 'rail';

export type FrameNavigationMode = 'mdi' | 'single';

export interface FrameConfig {
  layout: FrameLayoutMode;
  navigation: FrameNavigationMode;
  urlSync?: boolean;
}

export interface WorkspaceFrameProps {
  /** F1: only `leftPanel` is rendered; other values fall back to leftPanel */
  layout?: FrameLayoutMode;
  header?: ReactNode;
  headerActions?: ReactNode;
  menu?: FrameMenuModel;
  menuTitle?: string;
  menuAriaLabel?: string;
  activeMenuId?: string;
  onMenuSelect?: (item: FrameMenuItem) => void;
  workarea: ReactNode;
  className?: string;
}

export interface LeftPanelNavProps {
  items: FrameMenuItem[];
  activeId?: string;
  onSelect?: (item: FrameMenuItem) => void;
  title?: string;
  ariaLabel?: string;
  className?: string;
}

/**
 * @file packages/gen-frame/src/types/frame.types.ts
 * @description Workspace frame layout and component props.
 * @created 2026-06-29
 * @updated 2026-06-29
 *
 * @remark
 * - F1: leftPanel; F2: titleBar + NavRenderer
 *
 * @history
 * - 2026-06-29 F2: TitleBarNav, NavRenderer, FrameLayoutToggle types
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

export interface TitleBarNavProps {
  items: FrameMenuItem[];
  activeId?: string;
  onSelect?: (item: FrameMenuItem) => void;
  ariaLabel?: string;
  className?: string;
}

export interface NavRendererProps {
  layout: FrameLayoutMode;
  menu: FrameMenuModel;
  activeMenuId?: string;
  onMenuSelect?: (item: FrameMenuItem) => void;
  menuTitle?: string;
  menuAriaLabel?: string;
}

export interface FrameLayoutToggleProps {
  value: FrameLayoutMode;
  onChange: (layout: FrameLayoutMode) => void;
  options?: FrameLayoutMode[];
  labels?: Partial<Record<FrameLayoutMode, string>>;
  ariaLabel?: string;
  className?: string;
}

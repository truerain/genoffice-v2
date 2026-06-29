/**
 * @file packages/gen-frame/src/types/index.ts
 * @description Public type exports for @gen-office/gen-frame.
 * @created 2026-06-29
 *
 * @remark
 *
 */

export type { FrameMenuItem, FrameMenuModel } from './menu.types';
export type {
  FrameConfig,
  FrameLayoutMode,
  FrameLayoutToggleProps,
  FrameNavigationMode,
  LeftPanelNavProps,
  NavRendererProps,
  TitleBarNavProps,
  WorkspaceFrameProps,
} from './frame.types';

export type {
  CreateMdiNavigationControllerOptions,
  FrameOpenPagePayload,
  MdiNavigationStore,
  MdiTabInput,
  NavigationController,
  UseMdiNavigationControllerOptions,
} from './navigation.types';

export type { MdiPageHostProps, MdiTabPosition } from './host.types';

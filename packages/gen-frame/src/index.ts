/**
 * @file packages/gen-frame/src/index.ts
 * @description Public entry barrel exports for @gen-office/gen-frame.
 * @created 2026-06-29
 * @updated 2026-06-29
 *
 * @remark
 * - Side-effect: ./index.css (theme tokens)
 *
 * @history
 * - 2026-06-29 F3: MdiPageHost, NavigationController
 * - 2026-06-29 F2: titleBar, NavRenderer, useFrameLayout
 * - 2026-06-29 F1: leftPanel layout scaffold
 */

import './index.css';

export {
  WorkspaceFrame,
  LeftPanelNav,
  TitleBarNav,
  NavRenderer,
  resolveNavLayout,
  FrameLayoutToggle,
  SHOWCASE_FRAME_LAYOUTS,
  MdiPageHost,
} from './components';

export {
  createMdiNavigationController,
  useMdiNavigationController,
} from './navigation';

export {
  FRAME_LAYOUT_STORAGE_KEY,
  isFrameLayoutMode,
  useFrameLayout,
} from './hooks';

export type {
  CreateMdiNavigationControllerOptions,
  FrameConfig,
  FrameLayoutMode,
  FrameLayoutToggleProps,
  FrameMenuItem,
  FrameMenuModel,
  FrameNavigationMode,
  FrameOpenPagePayload,
  LeftPanelNavProps,
  MdiNavigationStore,
  MdiPageHostProps,
  MdiTabInput,
  MdiTabPosition,
  NavRendererProps,
  NavigationController,
  TitleBarNavProps,
  UseMdiNavigationControllerOptions,
  WorkspaceFrameProps,
} from './types';

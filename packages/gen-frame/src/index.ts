/**
 * @file packages/gen-frame/src/index.ts
 * @description Public entry barrel exports for @gen-office/gen-frame.
 * @created 2026-06-29
 *
 * @remark
 * - Side-effect: ./index.css (theme tokens)
 * - F1: WorkspaceFrame, LeftPanelNav
 *
 * @history
 * - 2026-06-29 F1: leftPanel layout scaffold
 */

import './index.css';

export { WorkspaceFrame, LeftPanelNav } from './components';

export type {
  FrameConfig,
  FrameLayoutMode,
  FrameMenuItem,
  FrameMenuModel,
  FrameNavigationMode,
  LeftPanelNavProps,
  WorkspaceFrameProps,
} from './types';

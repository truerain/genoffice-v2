/**
 * @file packages/gen-frame/src/types/menu.types.ts
 * @description Layout-neutral menu model for @gen-office/gen-frame.
 * @created 2026-06-29
 *
 * @remark
 * - Apps map API menu items to FrameMenuItem; componentName stays in meta
 *
 */

export interface FrameMenuItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  children?: FrameMenuItem[];
  /** App-specific: path, componentName, permission keys, etc. */
  meta?: Record<string, unknown>;
}

export interface FrameMenuModel {
  items: FrameMenuItem[];
}

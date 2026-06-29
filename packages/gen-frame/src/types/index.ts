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
  FrameBrandProps,
  FrameNavigationMode,
  LeftPanelNavProps,
  NavRendererProps,
  TitleBarNavProps,
  WorkspaceFrameProps,
} from './frame.types';

export type {
  CreateMdiNavigationControllerOptions,
  CreateSingleNavigationControllerOptions,
  FrameOpenPagePayload,
  MdiNavigationStore,
  MdiTabInput,
  NavigationController,
  SingleNavigationStore,
  SinglePageInput,
  SinglePageState,
  UseMdiNavigationControllerOptions,
  UseSingleNavigationControllerOptions,
  UseSingleNavigationControllerResult,
} from './navigation.types';

export type { MdiPageHostProps, MdiTabPosition, SinglePageHostProps } from './host.types';

export type {
  CreateQueryTabUrlSyncAdapterOptions,
  UrlSyncAdapter,
  UrlSyncPersistence,
  UseUrlSyncOptions,
} from './url.types';

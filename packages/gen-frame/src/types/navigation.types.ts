/**
 * @file packages/gen-frame/src/types/navigation.types.ts
 * @description Navigation controller contracts (Gate F3).
 * @created 2026-06-29
 *
 * @remark
 * - FrameOpenPagePayload is layout-neutral; apps map registry fields via resolveTab
 *
 */

import type { ReactNode } from 'react';

export interface FrameOpenPagePayload {
  pageId: string;
  title: string;
  params?: Record<string, string>;
  meta?: Record<string, unknown>;
}

export interface NavigationController {
  open(payload: FrameOpenPagePayload): boolean;
  activate(pageId: string): void;
  close(pageId: string): void;
  closeAll(): void;
}

/** App builds MDI tab content; gen-frame orchestrates store actions. */
export interface MdiTabInput {
  id: string;
  title: string;
  content: ReactNode;
  closable?: boolean;
}

export interface MdiNavigationStore {
  addTab: (tab: MdiTabInput) => boolean;
  removeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  closeAllClosableTabs: () => void;
}

export interface CreateMdiNavigationControllerOptions {
  store: MdiNavigationStore;
  resolveTab: (payload: FrameOpenPagePayload) => MdiTabInput;
}

export interface UseMdiNavigationControllerOptions {
  resolveTab: (payload: FrameOpenPagePayload) => MdiTabInput;
  /** Opened once with `closable: false`; content from `resolveTab`. */
  pinnedPages?: FrameOpenPagePayload[];
  /** When false, skips pinned sync (default true). */
  pinnedPagesEnabled?: boolean;
}

export interface SinglePageState {
  pageId: string;
  title: string;
  content: ReactNode;
}

export interface SinglePageInput {
  content: ReactNode;
}

export interface SingleNavigationStore {
  getPage: () => SinglePageState | null;
  setPage: (page: SinglePageState | null) => void;
}

export interface CreateSingleNavigationControllerOptions {
  store: SingleNavigationStore;
  resolvePage: (payload: FrameOpenPagePayload) => SinglePageInput;
}

export interface UseSingleNavigationControllerOptions {
  resolvePage: (payload: FrameOpenPagePayload) => SinglePageInput;
}

export interface UseSingleNavigationControllerResult {
  controller: NavigationController;
  currentPage: SinglePageState | null;
}

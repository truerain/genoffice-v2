/**
 * @file packages/mdi/src/types/mdi.types.ts
 * @description Core MDI tab and Zustand store types.
 * @created 2026-06-27
 */
import type { ReactNode } from 'react';

export type TabPosition = 'top' | 'bottom';

export interface MDITab {
  /** 탭의 고유 식별자 */
  id: string;
  /** 탭 제목 */
  title: string;
  /** 탭 콘텐츠 */
  content: ReactNode;
  /** 닫기 버튼 표시 여부 (기본값: true) */
  closable?: boolean;
  /** 탭 아이콘 */
  icon?: ReactNode;
  /** 탭 메타데이터 (demo path 등 opaque 힌트) */
  meta?: Record<string, unknown>;
}

export interface MDIState {
  tabs: MDITab[];
  activeTabId: string | null;
  maxTabs: number | undefined;
  tabPosition: TabPosition;
  /** maxTabs 초과 시 콜백 (MDIContainer가 등록) */
  onMaxTabsReached?: () => void;
}

export interface MDIActions {
  /** 탭 추가 — 신규 id: append+활성화. 기존 id: focus만(title/content 미갱신). maxTabs 초과: false + onMaxTabsReached */
  addTab: (tab: MDITab) => boolean;
  removeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  setTabPosition: (position: TabPosition) => void;
  updateTab: (id: string, updates: Partial<MDITab>) => void;
  closeAllTabs: () => void;
  closeAllClosableTabs: () => void;
  closeOtherTabs: (id: string) => void;
  setMaxTabs: (max: number | undefined) => void;
  setOnMaxTabsReached: (handler?: () => void) => void;
  reset: () => void;
}

export interface MDIStore extends MDIState, MDIActions {}

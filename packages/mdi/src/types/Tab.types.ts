/**
 * @file packages/mdi/src/types/Tab.types.ts
 * @description Public props for Tab.
 * @created 2026-06-27
 */
import type { KeyboardEvent, MouseEvent } from 'react';
import type { MDITab } from './mdi.types';

export interface TabProps {
  tab: MDITab;
  isActive: boolean;
  onClick: () => void;
  onContextMenu?: (event: MouseEvent) => void;
  onClose: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  className?: string;
}

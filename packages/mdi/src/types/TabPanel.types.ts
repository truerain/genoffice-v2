/**
 * @file packages/mdi/src/types/TabPanel.types.ts
 * @description Public props for TabPanel.
 * @created 2026-06-27
 */
import type { MDITab } from './mdi.types';

export interface TabPanelProps {
  tab: MDITab;
  isActive: boolean;
  className?: string;
}

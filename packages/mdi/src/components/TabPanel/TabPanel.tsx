/**
 * @file packages/mdi/src/components/TabPanel/TabPanel.tsx
 * @description MDI tab content panel (hidden via display:none when inactive).
 * @created 2026-06-27
 */
import { clsx } from 'clsx';
import type { TabPanelProps } from '../../types';
import styles from './TabPanel.module.css';

export const TabPanel = ({ tab, isActive, className }: TabPanelProps) => {
  return (
    <div
      className={clsx(styles.tabPanel, !isActive && styles.hidden, className)}
      role="tabpanel"
      id={`tabpanel-${tab.id}`}
      aria-labelledby={`tab-${tab.id}`}
      aria-hidden={!isActive}
      data-active={isActive ? 'true' : 'false'}
    >
      {tab.content}
    </div>
  );
};

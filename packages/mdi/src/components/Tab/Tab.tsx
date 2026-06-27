/**
 * @file packages/mdi/src/components/Tab/Tab.tsx
 * @description Single MDI tab (title, icon, close control).
 * @created 2026-06-27
 */
import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import { Button } from '@gen-office/ui';
import type { TabProps } from '../../types';
import styles from './Tab.module.css';

export const Tab = forwardRef<HTMLDivElement, TabProps>(function Tab(
  { tab, isActive, onClick, onContextMenu, onClose, onKeyDown, className },
  ref,
) {
  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClose();
  };

  return (
    <div
      ref={ref}
      className={clsx(styles.tab, isActive && styles.active, className)}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onKeyDown={onKeyDown}
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${tab.id}`}
      id={`tab-${tab.id}`}
      tabIndex={isActive ? 0 : -1}
    >
      <div className={styles.tabContent}>
        {tab.icon && <span className={styles.tabIcon}>{tab.icon}</span>}
        <span className={styles.tabTitle}>{tab.title}</span>
      </div>

      {tab.closable !== false && (
        <Button
          variant="ghost"
          size="icon"
          className={styles.closeButton}
          onClick={handleClose}
          aria-label={`Close ${tab.title}`}
        >
          <X size={14} />
        </Button>
      )}
    </div>
  );
});

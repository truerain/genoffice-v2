/**
 * @file packages/ui/src/core/drawer/Drawer.tsx
 * @description V1 custom slide-over panel (not Radix). Overlay + side panel with title/footer slots.
 * @created 2026-06-24
 *
 * @remark
 * - Controlled via open / onOpenChange
 * - No portal or focus trap (V1 parity)
 */
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import type { DrawerProps } from './Drawer.types';
import styles from './Drawer.module.css';

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  side = 'right',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  footer,
  size = 'md',
}: DrawerProps) {
  useEffect(() => {
    if (!open || !closeOnEsc) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, closeOnEsc, onOpenChange]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onOpenChange(false);
    }
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.drawerRoot}>
      <div
        className={styles.overlay}
        onClick={handleOverlayClick}
        aria-hidden="true"
        data-testid="drawer-overlay"
      />

      <div
        className={clsx(styles.drawer, styles[side], styles[size])}
        onClick={handleContentClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
        aria-describedby={description ? 'drawer-description' : undefined}
      >
        {(title || description) && (
          <div className={styles.header}>
            <div className={styles.headerContent}>
              {title && (
                <h2 id="drawer-title" className={styles.title}>
                  {title}
                </h2>
              )}
              {description && (
                <p id="drawer-description" className={styles.description}>
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => onOpenChange(false)}
              aria-label="닫기"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className={styles.body}>{children}</div>

        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </div>
  );
}

/**
 * @file packages/gen-frame/src/components/LeftPanelNav/LeftPanelNav.tsx
 * @description Vertical sidebar navigation for leftPanel layout (Gate F1).
 * @created 2026-06-29
 *
 * @remark
 * - Exports: LeftPanelNav
 * - Supports one-level children; deeper trees render flat under parent
 *
 */

import { clsx } from 'clsx';
import type { FrameMenuItem, LeftPanelNavProps } from '../../types';
import styles from './LeftPanelNav.module.css';

function NavButton({
  item,
  isActive,
  depth,
  onSelect,
}: {
  item: FrameMenuItem;
  isActive: boolean;
  depth: number;
  onSelect?: (item: FrameMenuItem) => void;
}) {
  return (
    <button
      type="button"
      className={clsx(
        styles.item,
        isActive && styles.itemActive,
        depth > 0 && styles.childItem,
      )}
      disabled={item.disabled}
      aria-current={isActive ? 'page' : undefined}
      onClick={() => onSelect?.(item)}
    >
      {item.label}
    </button>
  );
}

function NavItems({
  items,
  activeId,
  depth,
  onSelect,
}: {
  items: FrameMenuItem[];
  activeId?: string;
  depth: number;
  onSelect?: (item: FrameMenuItem) => void;
}) {
  return (
    <ul className={depth === 0 ? styles.list : styles.childList}>
      {items.map((item) => {
        const isActive = item.id === activeId;
        const hasChildren = item.children && item.children.length > 0;

        return (
          <li key={item.id}>
            <NavButton item={item} isActive={isActive} depth={depth} onSelect={onSelect} />
            {hasChildren ? (
              <NavItems
                items={item.children!}
                activeId={activeId}
                depth={depth + 1}
                onSelect={onSelect}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function LeftPanelNav({
  items,
  activeId,
  onSelect,
  title,
  ariaLabel = 'Navigation',
  className,
}: LeftPanelNavProps) {
  return (
    <nav className={clsx(styles.nav, className)} aria-label={ariaLabel}>
      {title ? <div className={styles.title}>{title}</div> : null}
      <NavItems items={items} activeId={activeId} depth={0} onSelect={onSelect} />
    </nav>
  );
}

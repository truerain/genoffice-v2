/**
 * @file packages/gen-frame/src/components/TitleBarNav/TitleBarNav.tsx
 * @description Horizontal navigation for titleBar layout (Gate F2).
 * @created 2026-06-29
 *
 * @remark
 * - Exports: TitleBarNav
 * - Items with children use @gen-office/ui DropdownMenu
 *
 */

import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gen-office/ui';
import type { FrameMenuItem, TitleBarNavProps } from '../../types';
import styles from './TitleBarNav.module.css';

function isItemActive(item: FrameMenuItem, activeId?: string): boolean {
  if (!activeId) return false;
  if (item.id === activeId) return true;
  return item.children?.some((child) => child.id === activeId) ?? false;
}

export function TitleBarNav({
  items,
  activeId,
  onSelect,
  ariaLabel = 'Main navigation',
  className,
}: TitleBarNavProps) {
  return (
    <nav className={clsx(styles.nav, className)} aria-label={ariaLabel}>
      <ul className={styles.list}>
        {items.map((item) => {
          const hasChildren = Boolean(item.children?.length);
          const active = isItemActive(item, activeId);

          return (
            <li key={item.id} className={styles.item}>
              {hasChildren ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={clsx(styles.trigger, active && styles.active)}
                      disabled={item.disabled}
                      aria-haspopup="menu"
                    >
                      {item.label}
                      <ChevronDown className={styles.chevron} aria-hidden />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {item.children!.map((child) => (
                      <DropdownMenuItem
                        key={child.id}
                        disabled={child.disabled}
                        onSelect={() => onSelect?.(child)}
                      >
                        {child.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  type="button"
                  className={clsx(styles.link, active && styles.active)}
                  disabled={item.disabled}
                  aria-current={item.id === activeId ? 'page' : undefined}
                  onClick={() => onSelect?.(item)}
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

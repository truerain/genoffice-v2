/**
 * @file packages/ui/src/core/breadcrumb/Breadcrumb.tsx
 * @description Hierarchical navigation breadcrumb trail.
 * @created 2026-06-24
 */
import { Fragment } from 'react';
import { ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import type { BreadcrumbProps, BreadcrumbItem } from './Breadcrumb.types';
import styles from './Breadcrumb.module.css';

export function Breadcrumb({
  items,
  separator = <ChevronRight size={16} />,
  maxItems,
  size = 'md',
  className,
}: BreadcrumbProps) {
  const getDisplayItems = (): BreadcrumbItem[] => {
    if (!maxItems || items.length <= maxItems) {
      return items;
    }

    if (maxItems <= 3) {
      return [
        items[0],
        { label: '...', disabled: true },
        items[items.length - 1],
      ];
    }

    const remainingSlots = maxItems - 2;
    const endItems = items.slice(-remainingSlots);

    return [
      items[0],
      { label: '...', disabled: true },
      ...endItems,
    ];
  };

  const displayItems = getDisplayItems();
  const lastIndex = displayItems.length - 1;

  const renderItem = (item: BreadcrumbItem, index: number) => {
    const isLast = index === lastIndex;
    const isDisabled = item.disabled || isLast;

    const content = (
      <>
        {item.icon && <span className={styles.icon}>{item.icon}</span>}
        <span>{item.label}</span>
      </>
    );

    if (item.href && !isDisabled) {
      return (
        <a
          href={item.href}
          className={clsx(styles.item, styles.link)}
          onClick={(e) => {
            if (item.onClick) {
              e.preventDefault();
              item.onClick();
            }
          }}
        >
          {content}
        </a>
      );
    }

    if (item.onClick && !isDisabled) {
      return (
        <button
          type="button"
          className={clsx(styles.item, styles.button)}
          onClick={item.onClick}
        >
          {content}
        </button>
      );
    }

    return (
      <span className={clsx(styles.item, isLast ? styles.current : styles.disabled)}>
        {content}
      </span>
    );
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={clsx(styles.breadcrumb, styles[size], className)}
    >
      <ol className={styles.list}>
        {displayItems.map((item, index) => (
          <Fragment key={index}>
            <li className={styles.listItem}>
              {renderItem(item, index)}
            </li>
            {index < lastIndex && (
              <li className={styles.separator} aria-hidden="true">
                {item.label === '...' ? null : separator}
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}

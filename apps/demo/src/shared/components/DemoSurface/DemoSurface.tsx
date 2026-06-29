/**
 * @file apps/demo/src/shared/components/DemoSurface/DemoSurface.tsx
 * @description Reusable elevated surface wrapper for demo pages (Soft Modern).
 * @created 2026-06-29
 *
 * @remark
 * - Exports: DemoSurface, DemoSurfaceVariant
 * - variant elevated | chrome | flat
 *
 */

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import styles from './DemoSurface.module.css';

export type DemoSurfaceVariant = 'elevated' | 'chrome' | 'flat';

type DemoSurfaceOwnProps<T extends ElementType> = {
  as?: T;
  variant?: DemoSurfaceVariant;
  className?: string;
  children?: ReactNode;
};

export type DemoSurfaceProps<T extends ElementType = 'div'> = DemoSurfaceOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof DemoSurfaceOwnProps<T>>;

const variantClass: Record<DemoSurfaceVariant, string> = {
  elevated: styles.elevated,
  chrome: styles.chrome,
  flat: styles.flat,
};

export function DemoSurface<T extends ElementType = 'div'>({
  as,
  variant = 'elevated',
  className,
  children,
  ...rest
}: DemoSurfaceProps<T>) {
  const Component = as ?? 'div';
  const classes = [styles.surface, variantClass[variant], className].filter(Boolean).join(' ');

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
}

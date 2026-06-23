/**
 * @file packages/ui/src/core/separator/Separator.tsx
 * @description Radix Separator primitive with orientation and border variant styles.
 * @created 2026-06-23
 *
 * @remark
 * - @radix-ui/react-separator Root + forwardRef to HTMLDivElement
 * - className merge via @gen-office/utils cn (V1 compat; migrate to clsx later)
 * - Tokens: --color-border-subtle, --color-border-default, --color-border-strong
 */
import { forwardRef } from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '@gen-office/utils';
import type { SeparatorProps } from './Separator.types';
import styles from './Separator.module.css';

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  (
    { className, orientation = 'horizontal', decorative = true, variant = 'default', ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      orientation={orientation}
      decorative={decorative}
      className={cn(
        styles.root,
        styles[variant],
        orientation === 'vertical' ? styles.vertical : styles.horizontal,
        className
      )}
      {...props}
    />
  )
);

Separator.displayName = SeparatorPrimitive.Root.displayName;

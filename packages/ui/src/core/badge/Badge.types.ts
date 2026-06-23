/**
 * @file packages/ui/src/core/badge/Badge.types.ts
 * @description Public props for Badge.
 * @created 2026-06-23
 *
 * @remark
 * - variant: semantic status + primary/outline (theme tokens in CSS module)
 */
import type { HTMLAttributes } from 'react';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual style @default 'default' */
  variant?: BadgeVariant;
  /** Chip size @default 'md' */
  size?: BadgeSize;
  /** Leading dot indicator @default false */
  dot?: boolean;
}

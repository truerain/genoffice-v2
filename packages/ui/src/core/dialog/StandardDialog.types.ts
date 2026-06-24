/**
 * @file packages/ui/src/core/dialog/StandardDialog.types.ts
 * @description Public props for StandardDialog (back-office default modal).
 * @created 2026-06-24
 */
import type { CSSProperties, ReactNode, Ref } from 'react';
import type { DialogProps } from './Dialog.types';

export type StandardDialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export const STANDARD_DIALOG_SIZE_STYLES: Record<StandardDialogSize, CSSProperties> = {
  sm: { maxWidth: '24rem' },
  md: { maxWidth: '32rem' },
  lg: { maxWidth: '48rem' },
  xl: { maxWidth: '64rem' },
  full: {
    width: 'calc(100vw - 2rem)',
    maxWidth: 'calc(100vw - 2rem)',
    maxHeight: 'calc(100vh - 2rem)',
  },
};

export interface StandardDialogProps extends DialogProps {
  /** Dialog title */
  title?: string;
  /** Dialog content */
  children: ReactNode;
  /** Optional fixed footer content */
  footer?: ReactNode;
  /** Show close button @default true */
  showClose?: boolean;
  /** Custom class name for content */
  className?: string;
  /** Allow dragging by the dialog header @default true */
  draggable?: boolean;
  /** Preset dialog size @default 'md' */
  size?: StandardDialogSize;
  /** Allow runtime resize with drag handle @default false */
  resizable?: boolean;
  /** Enable body scrolling @default true */
  bodyScrollable?: boolean;
  /** External ref for the dialog body element */
  bodyRef?: Ref<HTMLDivElement>;
  /** Initial width used before user resize */
  initialWidth?: number;
  /** Initial height used before user resize */
  initialHeight?: number;
  /** Minimum width for runtime resize @default 320 */
  minResizableWidth?: number;
  /** Minimum height for runtime resize @default 200 */
  minResizableHeight?: number;
}

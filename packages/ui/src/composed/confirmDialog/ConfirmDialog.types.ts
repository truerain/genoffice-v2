/**
 * @file packages/ui/src/composed/confirmDialog/ConfirmDialog.types.ts
 * @description Type definitions for ConfirmDialog.
 * @created 2026-06-25
 *
 * @remark
 * - Exports: ConfirmDialogProps
 * - Subset of AlertDialog (no thirdText / hideCancelButton)
 */
import type { ReactNode } from 'react';
import type { AlertDialogVariant } from '../alertDialog';

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string | ReactNode;
  message?: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  variant?: AlertDialogVariant;
}

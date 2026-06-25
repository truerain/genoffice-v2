/**
 * @file packages/ui/src/composed/confirmDialog/ConfirmDialog.tsx
 * @description Thin wrapper around AlertDialog with confirm-oriented defaults.
 * @created 2026-06-25
 *
 * @remark
 * - Exports: ConfirmDialog
 * - Delegates to AlertDialog; default variant warning
 */
import { AlertDialog } from '../alertDialog';
import type { ConfirmDialogProps } from './ConfirmDialog.types';

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  isLoading = false,
  variant = 'warning',
}: ConfirmDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      message={message}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={onConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
      variant={variant}
    />
  );
}

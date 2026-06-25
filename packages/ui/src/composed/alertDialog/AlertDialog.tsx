/**
 * @file packages/ui/src/composed/alertDialog/AlertDialog.tsx
 * @description Alert-style dialog built on Dialog compound primitives.
 * @created 2026-06-25
 */
import { useState } from 'react';
import {
  CircleAlert,
  CircleCheckBig,
  CircleX,
  X,
  TriangleAlert,
} from 'lucide-react';
import { clsx } from 'clsx';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogTitle,
  DialogFooter,
} from '../../core/dialog';
import { Button } from '../../core/button';
import type { AlertDialogProps, AlertDialogVariant } from './AlertDialog.types';
import styles from './AlertDialog.module.css';

const VARIANT_CLASS: Record<AlertDialogVariant, string> = {
  info: styles.info,
  warning: styles.warning,
  error: styles.error,
  success: styles.success,
};

const VARIANT_ICON: Record<AlertDialogVariant, typeof CircleAlert> = {
  info: CircleAlert,
  warning: TriangleAlert,
  error: CircleX,
  success: CircleCheckBig,
};

export function AlertDialog({
  open,
  onOpenChange,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  thirdText,
  onConfirm,
  onCancel,
  onThird,
  variant = 'info',
  hideCancelButton = false,
  isLoading = false,
}: AlertDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('AlertDialog confirm error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleThird = () => {
    onThird?.();
    onOpenChange(false);
  };

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case 'error':
        return 'destructive' as const;
      case 'warning':
      case 'success':
      default:
        return 'primary' as const;
    }
  };

  const Icon = VARIANT_ICON[variant];
  const busy = loading || isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={clsx(VARIANT_CLASS[variant])} showClose={false}>
        <DialogHeader>
          <div className={styles.headerRow}>
            <DialogTitle>{title}</DialogTitle>
            <DialogClose asChild>
              <button type="button" aria-label="닫기" className={styles.headerClose}>
                <X size={16} />
              </button>
            </DialogClose>
          </div>
        </DialogHeader>

        {message && (
          <DialogBody className={styles.body}>
            <div className={styles.iconWrapper} aria-hidden="true">
              <Icon className={styles.icon} />
            </div>
            <div className={styles.bodyContent}>{message}</div>
          </DialogBody>
        )}

        <DialogFooter>
          {!hideCancelButton && (
            <Button variant="outline" onClick={handleCancel} disabled={busy}>
              {cancelText}
            </Button>
          )}
          {thirdText && (
            <Button variant="outline" onClick={handleThird} disabled={busy}>
              {thirdText}
            </Button>
          )}
          <Button
            variant={getConfirmButtonVariant()}
            onClick={handleConfirm}
            disabled={busy}
          >
            {busy ? '처리중...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

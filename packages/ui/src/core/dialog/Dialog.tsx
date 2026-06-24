/**
 * @file packages/ui/src/core/dialog/Dialog.tsx
 * @description Radix Dialog compound primitives.
 * @created 2026-06-23
 *
 * @remark
 * - className merge via clsx
 */
import { forwardRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import type {
  DialogOverlayProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogBodyProps,
  DialogFooterProps,
  DialogTitleProps,
  DialogDescriptionProps,
} from './Dialog.types';
import styles from './Dialog.module.css';

export const Dialog = DialogPrimitive.Root;

export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogPortal = DialogPrimitive.Portal;

export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
      ref={ref}
      className={clsx(styles.overlay, className)}
      {...props}
    />
  )
);

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, showClose = true, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={clsx(styles.content, className)}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close className={styles.close}>
            <X className={styles.closeIcon} />
            <span className={styles.srOnly}>Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);

DialogContent.displayName = DialogPrimitive.Content.displayName;

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx(styles.header, className)} {...props} />
  )
);

DialogHeader.displayName = 'DialogHeader';

export const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx(styles.body, className)} {...props} />
  )
);

DialogBody.displayName = 'DialogBody';

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx(styles.footer, className)} {...props} />
  )
);

DialogFooter.displayName = 'DialogFooter';

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Title
      ref={ref}
      className={clsx(styles.title, className)}
      {...props}
    />
  )
);

DialogTitle.displayName = DialogPrimitive.Title.displayName;

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={clsx(styles.description, className)}
    {...props}
  />
));

DialogDescription.displayName = DialogPrimitive.Description.displayName;

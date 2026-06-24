/**
 * @file packages/ui/src/core/dialog/index.ts
 * @description Barrel exports for Dialog primitives and StandardDialog.
 * @created 2026-06-23
 */
export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './Dialog';

export { StandardDialog } from './StandardDialog';

export type {
  DialogProps,
  DialogTriggerProps,
  DialogPortalProps,
  DialogOverlayProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogBodyProps,
  DialogFooterProps,
  DialogTitleProps,
  DialogDescriptionProps,
} from './Dialog.types';

export type { StandardDialogProps, StandardDialogSize } from './StandardDialog.types';

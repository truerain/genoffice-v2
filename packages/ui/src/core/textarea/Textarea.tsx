/**
 * @file packages/ui/src/core/textarea/Textarea.tsx
 * @description Native textarea with optional label and helper text.
 * @created 2026-06-23
 *
 * @remark
 * - Embeds @radix-ui/react-label when label prop is set
 * - forwardRef to HTMLTextAreaElement
 */
import { forwardRef, useId } from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { clsx } from 'clsx';
import type { TextareaProps } from './Textarea.types';
import styles from './Textarea.module.css';

const resizeClassMap = {
  none: styles.resizeNone,
  vertical: styles.resizeVertical,
  horizontal: styles.resizeHorizontal,
  both: styles.resizeBoth,
} as const;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error = false,
      fullWidth = false,
      resize = 'vertical',
      label,
      helperText,
      required,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const helperId = `${id}-helper`;

    return (
      <div className={clsx(styles.wrapper, fullWidth && styles.fullWidthWrapper)}>
        {label && (
          <LabelPrimitive.Root
            htmlFor={id}
            className={clsx(
              styles.label,
              error && styles.labelError,
              required && styles.labelRequired
            )}
          >
            {label}
            {required && <span className={styles.requiredMark}>*</span>}
          </LabelPrimitive.Root>
        )}
        <textarea
          ref={ref}
          id={id}
          className={clsx(
            styles.textarea,
            resizeClassMap[resize],
            error && styles.error,
            fullWidth && styles.fullWidth,
            className
          )}
          aria-invalid={error}
          aria-describedby={helperText ? helperId : undefined}
          aria-required={required}
          {...props}
        />
        {helperText && (
          <span
            id={helperId}
            className={clsx(styles.helperText, error && styles.helperTextError)}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

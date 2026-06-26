/**
 * @file packages/ui/src/core/maskedInput/MaskedInput.tsx
 * @description Masked text input built on core Input and @gen-office/utils mask engine.
 * @created 2026-06-25
 *
 * @remark
 * - Exports: MaskedInput
 * - mask: preset id (ymd | ym), MaskPresetOptions, or MaskDefinition
 * - value is display string; Date parse is consumer responsibility (DatePicker C5b)
 */
import { forwardRef, useCallback } from 'react';
import { Input } from '../input';
import type { MaskedInputProps } from './MaskedInput.types';
import { useMaskInput } from './useMaskInput';

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  (
    {
      mask,
      value,
      defaultValue,
      onChange,
      onComplete,
      autoSelect = false,
      onClear,
      ...inputProps
    },
    ref
  ) => {
    const { display, setInputRef, inputHandlers } = useMaskInput({
      mask,
      value,
      defaultValue,
      onChange,
      onComplete,
    });

    const {
      onChange: handleMaskChange,
      onKeyDown: handleMaskKeyDown,
      onPaste,
      onCompositionStart,
      onCompositionEnd,
    } = inputHandlers;

    const mergeRef = useCallback(
      (node: HTMLInputElement | null) => {
        setInputRef(node);

        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref, setInputRef]
    );

    return (
      <Input
        {...inputProps}
        ref={mergeRef}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        autoSelect={autoSelect}
        value={display}
        onClear={onClear}
        onChange={handleMaskChange}
        onKeyDown={(event) => {
          handleMaskKeyDown(event);
          inputProps.onKeyDown?.(event);
        }}
        onPaste={onPaste}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
      />
    );
  }
);

MaskedInput.displayName = 'MaskedInput';

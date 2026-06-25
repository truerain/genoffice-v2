/**
 * @file packages/ui/src/core/maskedInput/useMaskInput.ts
 * @description React hook for masked input caret, paste, and composition handling.
 * @created 2026-06-25
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CompositionEvent,
  type KeyboardEvent,
} from 'react';
import {
  applyPasteMask,
  backspaceDigit,
  createMaskStateFromDisplay,
  extractDigits,
  resolveMaskDefinition,
  type MaskDefinition,
  type MaskPresetId,
  type MaskPresetOptions,
  type MaskState,
} from '@gen-office/utils';

type UseMaskInputOptions = {
  mask: MaskPresetId | MaskPresetOptions | MaskDefinition;
  value?: string;
  defaultValue?: string;
  onChange?: (display: string, state: MaskState) => void;
  onComplete?: (display: string, state: MaskState) => void;
  inputRef?: React.Ref<HTMLInputElement>;
};

export function useMaskInput({
  mask,
  value,
  defaultValue = '',
  onChange,
  onComplete,
}: UseMaskInputOptions) {
  const definition = useMemo(() => resolveMaskDefinition(mask), [mask]);
  const isControlled = value !== undefined;
  const [uncontrolledDisplay, setUncontrolledDisplay] = useState(() =>
    createMaskStateFromDisplay(defaultValue, definition).display
  );
  const composingRef = useRef(false);
  const nativeInputRef = useRef<HTMLInputElement | null>(null);

  const display = isControlled
    ? createMaskStateFromDisplay(value ?? '', definition).display
    : uncontrolledDisplay;

  useEffect(() => {
    if (!isControlled) {
      setUncontrolledDisplay(createMaskStateFromDisplay(defaultValue, definition).display);
    }
  }, [defaultValue, definition, isControlled]);

  const emit = useCallback(
    (nextState: MaskState) => {
      if (!isControlled) {
        setUncontrolledDisplay(nextState.display);
      }

      onChange?.(nextState.display, nextState);

      if (nextState.complete) {
        onComplete?.(nextState.display, nextState);
      }
    },
    [isControlled, onChange, onComplete]
  );

  const commitDisplay = useCallback(
    (raw: string) => {
      const nextState = createMaskStateFromDisplay(raw, definition);
      emit(nextState);
      return nextState;
    },
    [definition, emit]
  );

  const restoreCaret = useCallback((position: number) => {
    const node = nativeInputRef.current;
    if (!node) return;

    requestAnimationFrame(() => {
      node.setSelectionRange(position, position);
    });
  }, []);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (composingRef.current) {
        return;
      }

      const nextState = commitDisplay(event.target.value);
      restoreCaret(nextState.display.length);
    },
    [commitDisplay, restoreCaret]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (composingRef.current || event.key !== 'Backspace') {
        return;
      }

      const currentDigits = extractDigits(display, definition.maxDigits);
      if (currentDigits.length === 0) {
        return;
      }

      event.preventDefault();
      const nextState = backspaceDigit(currentDigits, definition);
      emit(nextState);
      restoreCaret(nextState.display.length);
    },
    [definition, display, emit, restoreCaret]
  );

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      const pasted = event.clipboardData.getData('text');
      const currentDigits = extractDigits(display, definition.maxDigits);
      const nextState = applyPasteMask(currentDigits, pasted, definition);
      emit(nextState);
      restoreCaret(nextState.display.length);
    },
    [definition, display, emit, restoreCaret]
  );

  const handleCompositionStart = useCallback((_event: CompositionEvent<HTMLInputElement>) => {
    composingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback(
    (event: CompositionEvent<HTMLInputElement>) => {
      composingRef.current = false;
      const nextState = commitDisplay(event.currentTarget.value);
      restoreCaret(nextState.display.length);
    },
    [commitDisplay, restoreCaret]
  );

  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      nativeInputRef.current = node;
    },
    []
  );

  return {
    definition,
    display,
    setInputRef,
    inputHandlers: {
      onChange: handleChange,
      onKeyDown: handleKeyDown,
      onPaste: handlePaste,
      onCompositionStart: handleCompositionStart,
      onCompositionEnd: handleCompositionEnd,
    },
  };
}

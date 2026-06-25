/**
 * @file packages/ui/src/core/maskedInput/MaskedInput.types.ts
 * @description Public props for MaskedInput.
 * @created 2026-06-25
 */
import type {
  MaskDefinition,
  MaskPresetId,
  MaskPresetOptions,
  MaskState,
} from '@gen-office/utils';
import type { InputProps } from '../input';

export type { MaskDefinition, MaskPresetId, MaskPresetOptions, MaskState };

export type MaskedInputProps = Omit<InputProps, 'type' | 'value' | 'defaultValue' | 'onChange'> & {
  mask: MaskPresetId | MaskPresetOptions | MaskDefinition;
  value?: string;
  defaultValue?: string;
  onChange?: (display: string, state: MaskState) => void;
  onComplete?: (display: string, state: MaskState) => void;
};

/**
 * @file packages/ui/src/core/slider/Slider.types.ts
 * @description Public props for Slider (Radix Slider.Root).
 * @created 2026-06-23
 *
 * @remark
 * - size: sm | md | lg visual modifiers
 * - Supports single and range (multi-thumb) via value/defaultValue arrays
 */
import type { ComponentPropsWithoutRef } from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

export type SliderSize = 'sm' | 'md' | 'lg';

export interface SliderProps
  extends ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /** Error state — range and thumb border use status error color */
  error?: boolean;
  /** Visual size @default 'md' */
  size?: SliderSize;
}

/**
 * @file packages/gen-frame/src/components/FrameLayoutToggle/FrameLayoutToggle.tsx
 * @description Layout mode switcher for framework showcase (Gate F2).
 * @created 2026-06-29
 *
 * @remark
 * - Exports: FrameLayoutToggle, SHOWCASE_FRAME_LAYOUTS
 *
 */

import { clsx } from 'clsx';
import type { FrameLayoutMode } from '../../types';
import type { FrameLayoutToggleProps } from '../../types';
import styles from './FrameLayoutToggle.module.css';

export const SHOWCASE_FRAME_LAYOUTS: FrameLayoutMode[] = ['leftPanel', 'titleBar'];

const DEFAULT_LABELS: Record<FrameLayoutMode, string> = {
  leftPanel: 'Left',
  titleBar: 'Top',
  hybrid: 'Hybrid',
  rail: 'Rail',
};

export function FrameLayoutToggle({
  value,
  onChange,
  options = SHOWCASE_FRAME_LAYOUTS,
  labels = DEFAULT_LABELS,
  ariaLabel = 'Layout mode',
  className,
}: FrameLayoutToggleProps) {
  return (
    <div className={clsx(styles.group, className)} role="group" aria-label={ariaLabel}>
      {options.map((mode) => (
        <button
          key={mode}
          type="button"
          className={clsx(styles.button, value === mode && styles.buttonActive)}
          aria-pressed={value === mode}
          onClick={() => onChange(mode)}
        >
          {labels[mode] ?? mode}
        </button>
      ))}
    </div>
  );
}

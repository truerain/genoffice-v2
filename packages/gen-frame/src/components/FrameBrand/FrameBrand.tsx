/**
 * @file packages/gen-frame/src/components/FrameBrand/FrameBrand.tsx
 * @description Header brand logo — default asset with app override (Gate F5+).
 * @created 2026-06-29
 *
 * @remark
 * - Exports: FrameBrand
 * - Default: src/assets/default-logo.png
 *
 */

import { clsx } from 'clsx';
import { DEFAULT_FRAME_BRAND_LOGO_SRC } from '../../assets/defaultBrandLogo';
import type { FrameBrandProps } from '../../types';
import styles from './FrameBrand.module.css';

export function FrameBrand({ src, alt = 'GenOffice', children, className }: FrameBrandProps) {
  if (children) {
    return (
      <div className={clsx(styles.brand, className)} data-gen-frame-brand="">
        {children}
      </div>
    );
  }

  return (
    <img
      src={src ?? DEFAULT_FRAME_BRAND_LOGO_SRC}
      alt={alt}
      className={clsx(styles.logo, className)}
      data-gen-frame-brand=""
    />
  );
}

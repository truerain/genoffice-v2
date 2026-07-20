/**
 * @file packages/gen-frame/src/assets/defaultBrandLogo.ts
 * @description Default frame brand logo URL (bundled asset).
 * @created 2026-06-29
 * @updated 2026-07-13
 *
 * @remark
 * - Apps override via FrameBrand `src` prop
 * - Normalize Vite string URL and Next `StaticImageData` to `string`
 */

import defaultLogoUrl from './default-logo.png';

function resolveAssetSrc(asset: string | { src: string }): string {
  return typeof asset === 'string' ? asset : asset.src;
}

export const DEFAULT_FRAME_BRAND_LOGO_SRC = resolveAssetSrc(defaultLogoUrl);

'use client';

/**
 * @file apps/docs/src/components/LangHtml.tsx
 * @description Syncs `document.documentElement.lang` with the active locale.
 * @created 2026-07-13
 */

import { useEffect } from 'react';

export function LangHtml({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}

/**
 * @file apps/docs/src/app/api/search/route.ts
 * @description Orama search API with en/ko indexes.
 * @created 2026-07-13
 */

import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

export const { GET } = createFromSource(source, {
  localeMap: {
    en: { language: 'english' },
    ko: { language: 'english' },
  },
});

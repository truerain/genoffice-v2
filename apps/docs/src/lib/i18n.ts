/**
 * @file apps/docs/src/lib/i18n.ts
 * @description Fumadocs i18n config for GenOffice docs (en / ko).
 * @created 2026-07-13
 *
 * @remark
 * - parser `dir`: content under `content/docs/en` and `content/docs/ko`.
 * - hideLocale never: URLs are `/en/...` and `/ko/...`.
 */

import { defineI18n } from 'fumadocs-core/i18n';

export const i18n = defineI18n({
  defaultLanguage: 'en',
  languages: ['en', 'ko'],
  parser: 'dir',
});

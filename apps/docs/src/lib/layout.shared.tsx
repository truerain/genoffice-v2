/**
 * @file apps/docs/src/lib/layout.shared.tsx
 * @description Shared Fumadocs layout options and UI i18n translations.
 * @created 2026-07-13
 *
 * @remark
 * - `baseOptions(locale)` drives Home/Docs nav title and locale links.
 */

import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { defineI18nUI } from 'fumadocs-ui/i18n';
import { i18n } from './i18n';
import { appName, gitConfig } from './shared';

export const i18nUI = defineI18nUI(i18n, {
  en: {
    displayName: 'English',
  },
  ko: {
    displayName: '한국어',
  },
});

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    nav: {
      title: appName,
      url: `/${locale}`,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}

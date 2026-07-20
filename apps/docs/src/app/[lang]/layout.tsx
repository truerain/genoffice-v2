/**
 * @file apps/docs/src/app/[lang]/layout.tsx
 * @description Locale shell: sets `html.lang` and Fumadocs i18n provider.
 * @created 2026-07-13
 */

import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';
import { i18nUI } from '@/lib/layout.shared';
import { LangHtml } from '@/components/LangHtml';

export default async function LangLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;

  return (
    <RootProvider i18n={i18nUI.provider(lang)}>
      <LangHtml lang={lang} />
      {children}
    </RootProvider>
  );
}

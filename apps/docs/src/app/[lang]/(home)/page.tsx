/**
 * @file apps/docs/src/app/[lang]/(home)/page.tsx
 * @description Public docs landing page (D1).
 * @created 2026-07-13
 *
 * @remark
 * - Locale-aware CTA to Quick Start (`GenFrame` first app) under `/[lang]/docs/quick-start`.
 */

import Link from 'next/link';

const copy = {
  en: {
    title: 'GenOffice',
    lead: 'Build enterprise back-office apps — start with GenFrame, then GenDataGrid, CRUD, and theme.',
    cta: 'Create your first app',
    docs: 'Browse docs',
  },
  ko: {
    title: 'GenOffice',
    lead: '엔터프라이즈 백오피스 앱 — GenFrame으로 시작하고 GenDataGrid · CRUD · 테마로 확장합니다.',
    cta: '첫 앱 만들기',
    docs: '문서 보기',
  },
} as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = copy[lang as keyof typeof copy] ?? copy.en;

  return (
    <div className="flex flex-col justify-center text-center flex-1 px-6">
      <h1 className="text-3xl font-bold mb-3">{t.title}</h1>
      <p className="text-fd-muted-foreground mb-8 max-w-xl mx-auto">{t.lead}</p>
      <p className="flex flex-wrap gap-4 justify-center">
        <Link
          href={`/${lang}/docs/quick-start`}
          className="inline-flex items-center rounded-md bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground"
        >
          {t.cta}
        </Link>
        <Link href={`/${lang}/docs`} className="font-medium underline underline-offset-4">
          {t.docs}
        </Link>
      </p>
    </div>
  );
}

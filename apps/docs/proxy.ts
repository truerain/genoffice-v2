/**
 * @file apps/docs/proxy.ts
 * @description Next.js proxy: i18n locale redirect + docs markdown negotiation.
 * @created 2026-07-13
 *
 * @remark
 * - Named export `proxy` (Next.js 16). Relative imports — avoid `@/` in proxy edge/node boundary.
 * - `/` without locale → redirect to preferred language (default `en`).
 */

import { createI18nMiddleware } from 'fumadocs-core/i18n/middleware';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { type NextFetchEvent, type NextRequest, NextResponse } from 'next/server';
import { i18n } from './src/lib/i18n';
import { docsContentRoute, docsRoute } from './src/lib/shared';

const i18nMiddleware = createI18nMiddleware(i18n);

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
);

export function proxy(request: NextRequest, event: NextFetchEvent) {
  const pathname = request.nextUrl.pathname;

  const localePrefix = i18n.languages.find(
    (lang) => pathname === `/${lang}` || pathname.startsWith(`/${lang}/`),
  );
  const pathWithoutLocale = localePrefix
    ? pathname.slice(localePrefix.length + 1) || '/'
    : pathname;

  if (pathWithoutLocale === docsRoute || pathWithoutLocale.startsWith(`${docsRoute}/`)) {
    const suffixResult = rewriteSuffix(pathWithoutLocale);
    if (suffixResult) {
      return NextResponse.rewrite(new URL(suffixResult, request.nextUrl));
    }

    if (isMarkdownPreferred(request)) {
      const docsResult = rewriteDocs(pathWithoutLocale);
      if (docsResult) {
        return NextResponse.rewrite(new URL(docsResult, request.nextUrl));
      }
    }
  }

  return i18nMiddleware(request, event);
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|og|llms).*)',
  ],
};

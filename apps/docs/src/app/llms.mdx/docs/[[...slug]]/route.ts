/**
 * @file apps/docs/src/app/llms.mdx/docs/[[...slug]]/route.ts
 * @description Markdown export for LLM / content negotiation.
 * @created 2026-07-13
 */

import { getLLMText, getPageMarkdownUrl, source } from '@/lib/source';
import { notFound } from 'next/navigation';

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: RouteContext<'/llms.mdx/docs/[[...slug]]'>,
) {
  const { slug } = await params;
  const pageSlugs = slug?.slice(0, -1);
  const page =
    source.getPage(pageSlugs, 'en') ?? source.getPage(pageSlugs, 'ko');
  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown',
    },
  });
}

export function generateStaticParams() {
  return source.getPages('en').map((page) => ({
    slug: getPageMarkdownUrl(page).segments,
  }));
}

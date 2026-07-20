/**
 * @file apps/docs/src/app/og/docs/[...slug]/route.tsx
 * @description OG image generation for docs pages.
 * @created 2026-07-13
 */

import { getPageImage, source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { generate as DefaultImage } from 'fumadocs-ui/og';
import { appName } from '@/lib/shared';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/og/docs/[...slug]'>) {
  const { slug } = await params;
  const pageSlugs = slug.slice(0, -1);
  const page =
    source.getPage(pageSlugs, 'en') ?? source.getPage(pageSlugs, 'ko');
  if (!page) notFound();

  return new ImageResponse(
    <DefaultImage title={page.data.title} description={page.data.description} site={appName} />,
    {
      width: 1200,
      height: 630,
    },
  );
}

export function generateStaticParams() {
  return source.getPages('en').map((page) => ({
    slug: getPageImage(page).segments,
  }));
}

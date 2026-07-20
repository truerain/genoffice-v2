/**
 * @file apps/docs/src/app/layout.tsx
 * @description Root layout with html/body; locale providers live under `[lang]`.
 * @created 2026-07-13
 *
 * @remark
 * - Theme FOUC script is Server-Component-only in `<head>` (not via next-themes client).
 * - `html.lang` defaults to `en`; `[lang]/layout` syncs via `LangHtml` for `/en` `/ko`.
 */

import './global.css';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
});

/** Blocking theme init — must stay in Server Component head (no client `<script>`). */
const themeInitScript = `(function(){try{var d=document.documentElement,c=d.classList;c.remove('light','dark');var e=localStorage.getItem('theme');if(e==='system'||!e){var m=window.matchMedia('(prefers-color-scheme: dark)');e=m.matches?'dark':'light'}if(e)c.add(e);d.style.colorScheme=e}catch(t){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex flex-col min-h-screen">{children}</body>
    </html>
  );
}

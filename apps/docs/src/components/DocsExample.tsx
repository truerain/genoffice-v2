'use client';

/**
 * @file apps/docs/src/components/DocsExample.tsx
 * @description Client wrapper for live GenOffice examples inside Fumadocs pages.
 * @created 2026-07-13
 *
 * @remark
 * - Never import `@gen-office/theme/index.css` or `@gen-office/ui/index.css` —
 *   both pull the global reset and collapse Fumadocs padding.
 * - Avoid `@gen-office/theme` ThemeProvider here (no need; tokens are CSS-only).
 * - Sets `data-theme="light"` so datagrid/ui tokens resolve in light mode.
 */

import type { ReactNode } from 'react';

import '@/styles/gen-office-tokens.css';
import '@/styles/gen-office-ui-modules.css';
import '@gen-office/gen-datagrid/index.css';
import '@gen-office/gen-datagrid-crud/index.css';

export function DocsExample({ children }: { children: ReactNode }) {
  return (
    <div
      data-theme="light"
      className="gen-docs-example not-prose my-4 overflow-hidden rounded-lg border border-fd-border p-3"
    >
      {children}
    </div>
  );
}

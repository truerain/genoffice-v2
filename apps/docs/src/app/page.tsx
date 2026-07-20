/**
 * @file apps/docs/src/app/page.tsx
 * @description Root `/` fallback redirect to default locale when proxy does not run.
 * @created 2026-07-13
 *
 * @remark
 * - Primary redirect is `proxy.ts` (Accept-Language). This is a static safety net → `/en`.
 */

import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/en');
}

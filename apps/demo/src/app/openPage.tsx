/**
 * @file apps/demo/src/app/openPage.tsx
 * @description Open MDI tabs from shell (Gate D1 stub).
 * @created 2026-06-28
 *
 * @remark
 * - PLACEHOLDER_PAGE_ID — D2 registry key placeholder
 * - D2: componentRegistry + OpenPagePayload
 *
 */

import type { MDITab } from '@gen-office/mdi';
import { PlaceholderPage } from '../pages/placeholder/PlaceholderPage';

export const PLACEHOLDER_PAGE_ID = 'placeholder-welcome';

export function createPlaceholderTab(): MDITab {
  return {
    id: PLACEHOLDER_PAGE_ID,
    title: 'Welcome',
    content: <PlaceholderPage title="Welcome" />,
    closable: true,
  };
}

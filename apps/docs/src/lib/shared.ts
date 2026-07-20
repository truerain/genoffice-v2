/**
 * @file apps/docs/src/lib/shared.ts
 * @description Shared constants for the GenOffice docs site branding and routes.
 * @created 2026-07-13
 *
 * @remark
 * - Public Docs product name and route prefixes for Fumadocs layouts / OG / llms.txt.
 * - GitHub URL is a placeholder until the public repo path is confirmed.
 */

export const appName = 'GenOffice';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

/** Placeholder until public GitHub org/repo is confirmed for external docs. */
export const gitConfig = {
  user: 'gen-office',
  repo: 'genoffice-v2',
  branch: 'main',
};

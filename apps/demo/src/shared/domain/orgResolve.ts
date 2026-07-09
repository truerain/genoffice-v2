/**
 * @file apps/demo/src/shared/domain/orgResolve.ts
 * @description Helpers to resolve organization ids for grid display.
 * @created 2026-07-09
 */

import type { Org } from './org.types';

export function orgNameById(orgs: readonly Org[], orgId?: string): string {
  if (!orgId) return '';
  return orgs.find((org) => org.orgId === orgId)?.orgName ?? '';
}

export function filterOrgs(orgs: readonly Org[], query: string): Org[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...orgs];
  return orgs.filter(
    (org) =>
      org.orgName.toLowerCase().includes(q) || org.orgId.toLowerCase().includes(q),
  );
}

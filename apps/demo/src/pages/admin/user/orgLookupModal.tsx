/**
 * @file apps/demo/src/pages/admin/user/orgLookupModal.tsx
 * @description 부서 lookup modal — GenDataGrid editLookup.renderModal + ui ModalInput.
 * @created 2026-07-10
 * @updated 2026-07-12
 *
 * @remark
 * - ModalInput hideTrigger: grid LookupCellEditor가 셀 shell 소유
 * - 선택 시 ctx.applySelection(org) — mapSelection은 column meta
 * - userColumns API 동일: renderModal: (ctx) => <OrgLookupModal ctx={ctx} orgs={orgs} />
 */

import { useCallback, useMemo, useRef } from 'react';
import type { GenDataGridLookupModalContext } from '@gen-office/gen-datagrid';
import { ModalInput, type ModalInputSelection } from '@gen-office/ui';
import type { Org } from '../../../shared/domain/org.types';
import type { UserRow } from './user.types';

export type OrgLookupModalProps = {
  ctx: GenDataGridLookupModalContext<UserRow, Org>;
  orgs: readonly Org[];
};

export function OrgLookupModal({ ctx, orgs }: OrgLookupModalProps) {
  const surfaceRef = useRef<HTMLElement | null>(null);

  const dialogContentRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (surfaceRef.current) {
        ctx.unregisterEditorSurface?.(surfaceRef.current);
      }
      surfaceRef.current = node;
      if (node) {
        ctx.registerEditorSurface?.(node);
      }
    },
    [ctx]
  );

  const items = useMemo<ModalInputSelection<Org>[]>(
    () =>
      orgs.map((org) => ({
        value: org.orgId,
        label: org.orgName,
        description: org.orgId,
        data: org,
        keywords: [org.orgId, org.orgName],
      })),
    [orgs]
  );

  return (
    <ModalInput
      mode="single"
      hideTrigger
      open
      draggable={true}
      commitOnItemClick
      items={items}
      title="부서 선택"
      searchPlaceholder="부서명·코드 검색"
      cancelLabel="취소"
      emptyMessage="검색 결과가 없습니다."
      defaultSearchValue={ctx.keyword?.trim() ?? ''}
      dialogContentRef={dialogContentRef}
      modalHeight={420}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) ctx.closeModal();
      }}
      onCommit={(selected) => {
        const org = selected?.data;
        if (org) ctx.applySelection(org);
      }}
    />
  );
}

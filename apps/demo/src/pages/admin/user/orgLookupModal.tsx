/**
 * @file apps/demo/src/pages/admin/user/orgLookupModal.tsx
 * @description 부서 lookup modal — GenDataGrid editLookup.renderModal 구현.
 * @created 2026-07-10
 *
 * @remark
 * - @gen-office/ui StandardDialog 사용
 * - 선택 시 ctx.applySelection(org) — mapSelection은 column meta에서 정의
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import type { GenDataGridLookupModalContext } from '@gen-office/gen-datagrid';
import { Button, Input, StandardDialog } from '@gen-office/ui';
import type { Org } from '../../../shared/domain/org.types';
import type { UserRow } from './user.types';
import styles from './orgLookupModal.module.css';

const GEN_DATAGRID_EDITOR_SURFACE_ATTR = 'data-gen-datagrid-editor-surface';

export type OrgLookupModalProps = {
  ctx: GenDataGridLookupModalContext<UserRow, Org>;
  orgs: readonly Org[];
};

export function OrgLookupModal({ ctx, orgs }: OrgLookupModalProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [searchText, setSearchText] = useState(() => ctx.keyword?.trim() ?? '');

  useEffect(() => {
    setSearchText(ctx.keyword?.trim() ?? '');
  }, [ctx.keyword]);

  useEffect(() => {
    const surface = contentRef.current;
    if (!surface) return;

    surface.setAttribute(GEN_DATAGRID_EDITOR_SURFACE_ATTR, 'true');
    ctx.registerEditorSurface?.(surface);
    return () => {
      ctx.unregisterEditorSurface?.(surface);
    };
  }, [ctx]);

  const filteredOrgs = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return orgs;
    return orgs.filter((org) => {
      const haystack = [org.orgName, org.orgId].join(' ').toLowerCase();
      return haystack.includes(keyword);
    });
  }, [orgs, searchText]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      ctx.closeModal();
    }
  };

  const handleSelect = (org: Org) => {
    ctx.applySelection(org);
    ctx.closeModal();
  };

  return (
    <StandardDialog
      ref={contentRef}
      open
      onOpenChange={handleOpenChange}
      title="부서 선택"
      size="sm"
      initialHeight={420}
      draggable={false}
      footer={
        <Button type="button" variant="ghost" size="sm" onClick={ctx.closeModal}>
          취소
        </Button>
      }
    >
      <div className={styles.searchRow}>
        <Input
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="부서명·코드 검색"
          autoFocus
          clearable
          fullWidth
          autoSelect={false}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && filteredOrgs.length === 1) {
              event.preventDefault();
              handleSelect(filteredOrgs[0]!);
            }
          }}
        />
      </div>

      <div className={styles.list} role="listbox" aria-label="부서 목록">
        {filteredOrgs.length === 0 ? (
          <div className={styles.empty}>검색 결과가 없습니다.</div>
        ) : (
          filteredOrgs.map((org) => (
            <button
              key={org.orgId}
              type="button"
              className={styles.item}
              role="option"
              onClick={() => handleSelect(org)}
            >
              <span className={styles.itemName}>{org.orgName}</span>
              <span className={styles.itemMeta}>{org.orgId}</span>
            </button>
          ))
        )}
      </div>
    </StandardDialog>
  );
}

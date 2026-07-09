/**
 * @file apps/demo/src/pages/admin/user/orgLookupEditor.tsx
 * @description Modal department lookup editor for User admin grid.
 * @created 2026-07-09
 *
 * @remark
 * - `orgId`를 draft/commit 값으로 사용. 표시명은 org 목록 lookup.
 * - gen-datagrid Gate 4.1-d modal blur 패턴 (Storybook ModalLookupEditor 정렬)
 */

import * as React from 'react';
import { createPortal } from 'react-dom';
import type { GenDataGridEditorContext } from '@gen-office/gen-datagrid';
import type { Org } from '../../../shared/domain/org.types';
import { filterOrgs, orgNameById } from '../../../shared/domain/orgResolve';
import { createEditorBlurHandler } from '../../../shared/grid/datagridEditorBlur';

const LIST_STYLE: React.CSSProperties = {
  maxHeight: 280,
  overflowY: 'auto',
  marginTop: 12,
  marginBottom: 16,
  border: '1px solid var(--color-border-default, #d0d7de)',
  borderRadius: 6,
};

const OPTION_BUTTON_STYLE: React.CSSProperties = {
  display: 'block',
  width: '100%',
  textAlign: 'left',
  padding: '8px 12px',
  border: 'none',
  borderBottom: '1px solid var(--color-border-muted, #eaeef2)',
  background: 'transparent',
  cursor: 'pointer',
};

function OrgLookupEditor<TData>({
  ctx,
  orgs,
}: {
  ctx: GenDataGridEditorContext<TData>;
  orgs: readonly Org[];
}) {
  const anchorRef = React.useRef<HTMLInputElement | null>(null);
  const surfaceRef = React.useRef<HTMLDivElement | null>(null);
  const orgId = ctx.draftValue == null ? '' : String(ctx.draftValue);
  const [open, setOpen] = React.useState(true);
  const [searchText, setSearchText] = React.useState('');

  const filteredOrgs = React.useMemo(
    () => filterOrgs(orgs, searchText),
    [orgs, searchText],
  );

  const closeModal = React.useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => anchorRef.current?.focus());
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const surface = surfaceRef.current;
    if (!surface) return;
    ctx.registerEditorSurface?.(surface);
    return () => ctx.unregisterEditorSurface?.(surface);
  }, [ctx, open]);

  const handleBlur = React.useMemo(
    () =>
      createEditorBlurHandler({
        blurOwnership: ctx.blurOwnership ?? 'modal',
        commitOnBlur: ctx.commitOnBlur,
        gridRoot: ctx.getGridRoot?.() ?? null,
        getEditorSurfaces: () => ctx.getEditorSurfaces?.() ?? [],
        commit: () => ctx.commit(),
      }),
    [ctx],
  );

  const handleSelect = React.useCallback(
    (org: Org) => {
      ctx.applyValue(org.orgId);
      setOpen(false);
    },
    [ctx],
  );

  const displayName = orgNameById(orgs, orgId) || orgId;

  const modal =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={surfaceRef}
            data-gen-datagrid-editor-surface="true"
            role="presentation"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
            }}
          >
            <button
              type="button"
              aria-label="부서 선택 닫기"
              onMouseDown={(event) => event.preventDefault()}
              onClick={closeModal}
              style={{
                position: 'absolute',
                inset: 0,
                border: 'none',
                padding: 0,
                background: 'rgba(27, 31, 36, 0.45)',
                cursor: 'default',
              }}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="부서 선택"
              onMouseDown={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                if (event.key !== 'Escape') return;
                event.preventDefault();
                closeModal();
              }}
              style={{
                position: 'relative',
                zIndex: 1,
                width: 'min(420px, 100%)',
                padding: 16,
                border: '1px solid #d0d7de',
                borderRadius: 8,
                background: '#fff',
                boxShadow: '0 16px 48px rgba(27, 31, 36, 0.24)',
              }}
            >
              <div style={{ marginBottom: 12, fontSize: 15, fontWeight: 600 }}>부서 선택</div>
              {displayName ? (
                <div style={{ marginBottom: 8, color: '#57606a', fontSize: 13 }}>
                  현재: {displayName}
                </div>
              ) : null}
              <input
                aria-label="부서 검색"
                autoComplete="off"
                autoFocus
                placeholder="부서명 또는 코드 검색"
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && filteredOrgs.length === 1) {
                    event.preventDefault();
                    handleSelect(filteredOrgs[0]!);
                  }
                }}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '8px 10px',
                  border: '1px solid #d0d7de',
                  borderRadius: 6,
                }}
              />
              <div role="listbox" aria-label="부서 목록" style={LIST_STYLE}>
                {filteredOrgs.length === 0 ? (
                  <div style={{ padding: '12px', color: '#6b7280' }}>검색 결과 없음</div>
                ) : (
                  filteredOrgs.map((org) => (
                    <button
                      key={org.orgId}
                      type="button"
                      role="option"
                      aria-selected={org.orgId === orgId}
                      style={OPTION_BUTTON_STYLE}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSelect(org)}
                    >
                      {org.orgName}
                      <span style={{ marginLeft: 8, color: '#6b7280', fontSize: '0.85em' }}>
                        {org.orgId}
                      </span>
                    </button>
                  ))
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => ctx.cancel()}>
                  취소
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <input
        ref={anchorRef}
        aria-label={`${ctx.columnId} editor`}
        autoFocus
        className="gen-datagrid__editor"
        readOnly
        type="text"
        value={displayName}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            if (open) {
              closeModal();
              return;
            }
            ctx.cancel();
            return;
          }
          if (event.key === 'Enter' || event.key === 'F2' || event.key === ' ') {
            event.preventDefault();
            setOpen(true);
          }
        }}
      />
      {modal}
    </>
  );
}

export function createOrgLookupEditor<TData>(orgs: readonly Org[]) {
  return function orgLookupEditor(ctx: GenDataGridEditorContext<TData>) {
    return <OrgLookupEditor ctx={ctx} orgs={orgs} />;
  };
}

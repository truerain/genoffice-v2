/**
 * @file apps/demo/src/pages/admin/user/userColumnCells.tsx
 * @description Custom GenDataGrid cell renderers for User admin columns.
 * @created 2026-07-09
 *
 * @remark
 * - 편집 모드 없이 셀에서 직접 상호작용하는 컬럼(useYn toggle 등).
 */

import type * as React from 'react';
import type { CellContext } from '@tanstack/react-table';
import { Switch } from '@gen-office/ui';
import type { UserRow } from './user.types';
import type { UserGridCellBridge } from './userGridCellBridge';

/** @gen-office/ui Switch 기본 크기(44×24px)의 1/2 */
const USE_YN_SWITCH_SIZE_STYLE = {
  '--switch-width': '1.375rem',
  '--switch-height': '0.75rem',
  '--switch-thumb-size': '0.625rem',
  '--switch-thumb-x': '0.0625rem',
  '--switch-thumb-checked-x': '0.6875rem',
} as React.CSSProperties;

function stopCellPointerBubble(event: React.MouseEvent) {
  event.stopPropagation();
}

/** 사용여부 — 셀에 항상 Switch 표시, 클릭으로 Y/N 전환 */
export function createUseYnToggleCell(bridgeRef: React.RefObject<UserGridCellBridge>) {
  return function UseYnToggleCell({ row }: CellContext<UserRow, unknown>) {
    const bridge = bridgeRef.current;
    const useYn = row.original.useYn;
    const checked = String(useYn ?? 'N') === 'Y';

    return (
      <span
        className="gen-datagrid__interactive-cell"
        onMouseDown={stopCellPointerBubble}
      >
        <Switch
          aria-label="useYn"
          checked={checked}
          disabled={bridge.readonly}
          style={USE_YN_SWITCH_SIZE_STYLE}
          onCheckedChange={(next) => {
            const value = next ? 'Y' : 'N';
            if (value === useYn) return;
            bridge.emitCellValueChange({
              row: row.original,
              rowId: row.id,
              rowIndex: row.index,
              columnId: 'useYn',
              previousValue: useYn,
              value,
            });
          }}
        />
      </span>
    );
  };
}

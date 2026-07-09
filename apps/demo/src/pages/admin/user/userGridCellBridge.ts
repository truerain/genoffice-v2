/**
 * @file apps/demo/src/pages/admin/user/userGridCellBridge.ts
 * @description Interactive cell → GenDataGrid dirty 경로 연결용 bridge.
 * @created 2026-07-09
 *
 * @remark
 * - column 정의는 mount 시 한 번 만들고, bridge ref의 current만 매 렌더 갱신한다.
 */

import type { GenDataGridCellValueChange } from '@gen-office/gen-datagrid';
import type { UserRow } from './user.types';

export type UserGridCellBridge = {
  readonly: boolean;
  emitCellValueChange: (args: GenDataGridCellValueChange<UserRow>) => void;
};

export const EMPTY_USER_GRID_CELL_BRIDGE: UserGridCellBridge = {
  readonly: false,
  emitCellValueChange: () => {},
};

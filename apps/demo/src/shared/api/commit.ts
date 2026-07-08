/**
 * @file apps/demo/src/shared/api/commit.ts
 * @description CRUD 화면 공용 커밋 페이로드 타입 + changeSet 매핑 빌더.
 * @created 2026-07-08
 *
 * @remark
 * - CommitPayload<TRequest>: 모든 CRUD 화면이 공유하는 서버 커밋 계약(created/updated/deleted)
 * - updated/deleted 모두 전체 행. 그리드 changeSet이 각 항목에 전체 행(row)을 제공하므로
 *   그 값을 그대로 요청 DTO로 매핑한다(별도 재구성 불필요).
 * - deleted.row는 생성 직후 삭제 등으로 없을 수 있어(undefined) 그 경우는 서버 전송에서 제외
 * - 화면별 요청 DTO는 CommitPayload<TRequest> 별칭으로 특수화(예: UserCommitPayload)
 *
 * @history
 * - 2026-07-08 changeSet 항목의 row 직접 사용으로 단순화(args.data 재구성 제거)
 */

import type { DataGridCrudCommitArgs } from '@gen-office/gen-datagrid-crud';

export interface CommitPayload<TRequest> {
  created: TRequest[];
  updated: TRequest[];
  deleted: TRequest[];
}

/** commit args의 created/updated/deleted 전체 행을 요청 DTO로 매핑해 CommitPayload 생성 */
export function buildCommitPayload<TRow, TRequest>(
  args: DataGridCrudCommitArgs<TRow>,
  toRequest: (row: TRow) => TRequest,
): CommitPayload<TRequest> {
  const { changeSet } = args;

  return {
    created: changeSet.created.map((row) => toRequest(row)),
    updated: changeSet.updated.map((item) => toRequest(item.row)),
    deleted: changeSet.deleted.flatMap((item) => (item.row ? [toRequest(item.row)] : [])),
  };
}

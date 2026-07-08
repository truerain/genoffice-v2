/**
 * @file apps/demo/src/pages/admin/user/userCommit.ts
 * @description Grid row → UserRequest 매핑 (전체 행, PK sentinel 치환).
 * @created 2026-07-08
 *
 * @remark
 * - UserPage onCommit에서 사용. 응답 파생 필드(titleName*)는 제외
 * - 신규 행(임시 rowId)은 PK를 NEW_ID로 치환해 서버 채번 유도
 *
 * @history
 * - 2026-07-08 전체 행 update + NEW_ID sentinel로 전환
 */

import type { DataGridCrudCommitArgs } from '@gen-office/gen-datagrid-crud';
import { buildCommitPayload } from '../../../shared/api/commit';
import { NEW_ID, NEW_ROW_ID_PREFIX, type DemoUserRow, type UserRequest } from './user.types';
import type { UserCommitPayload } from './userApi';

/** 전체 행 → 요청 DTO(편집 필드만). 신규 행이면 PK를 sentinel로 치환 */
function toUserRequest(row: DemoUserRow): UserRequest {
  return {
    userId: row.userId.startsWith(NEW_ROW_ID_PREFIX) ? NEW_ID : row.userId,
    loginId: row.loginId,
    empNo: row.empNo,
    empName: row.empName,
    empNameEng: row.empNameEng,
    displayName: row.displayName,
    email: row.email,
    orgId: row.orgId,
    titleCd: row.titleCd,
    langCd: row.langCd,
    active: row.active,
  };
}

export function buildUserCommitPayload(
  args: DataGridCrudCommitArgs<DemoUserRow>,
): UserCommitPayload {
  return buildCommitPayload(args, toUserRequest);
}

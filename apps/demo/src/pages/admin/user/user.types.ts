/**
 * @file apps/demo/src/pages/admin/user/user.types.ts
 * @description Row type for User demo CRUD (Gate D4).
 * @created 2026-06-29
 *
 * @remark
 * - UserRow(응답) / UserRequest(요청: 응답 파생 titleName* 제외, PK 필수)
 * - 커밋 정책: 데이터 연동 가이드(.docs/guide/data-integration.md) 참조
 *
 * @history
 * - 2026-07-08 UserRequest를 응답 파생 타입(Omit)으로 전환, NEW_ID sentinel 도입
 */

export type UserRow = {
  userId: string;
  loginId: string;
  empNo: string;
  empName: string;
  empNameEng: string;
  displayName: string;
  email?: string;
  orgId?: string;
  orgName?: string;
  titleCd?: string;
  titleName?: string;
  titleNameEng?: string;
  langCd: string
  useYn: string;
  lastUpdatedDate?: string;
  lastUpdatedName?: string;
};

/** 신규(create) 시 PK 자리에 넣는 sentinel — 서버가 채번 트리거로 인식 */
export const NEW_ID = '' as const;

/** 신규 행의 임시 rowId 접두(그리드 식별용). 커밋 매핑에서 NEW_ID로 치환 */
export const NEW_ROW_ID_PREFIX = 'new-';

/** 서버로 보내는 편집 필드(응답 파생 titleName* 제외, PK userId 포함) */
export type UserRequest = Omit<UserRow, 'titleName' | 'titleNameEng'>;

/** 목록 조회 파라미터 */
export interface UserListParams {
  empNo?: string;
  empName?: string;
}

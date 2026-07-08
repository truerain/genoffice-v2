/**
 * @file apps/demo/src/mocks/handlers/userHandlers.ts
 * @description MSW handlers for admin users — list(필터) + batch commit (Gate 데이터계층).
 * @created 2026-07-08
 *
 * @remark
 * - GET /api/admin/users(?empName), POST /api/admin/users/commit
 * - store: 모듈 스코프 in-memory 서버 상태(시드 복제)
 * - 커밋: created/updated/deleted 모두 UserRequest(전체 행). PK가 NEW_ID면 채번(INSERT)
 * - CSRF: mock 모드엔 XSRF 쿠키가 없어 미검증
 *
 * @history
 * - 2026-07-08 커밋 계약을 sentinel(NEW_ID) 채번 + 전체 행 update로 전환
 * - 2026-07-08 empName 쿼리 필터 + created userId 서버 생성
 */

import { http, HttpResponse, type HttpHandler } from 'msw';
import { getApiBaseUrl } from '../../shared/api/env';
import { NEW_ID, type DemoUserRow, type UserRequest } from '../../pages/admin/user/user.types';
import { INITIAL_DEMO_USERS } from '../data/users';

interface UserCommitPayload {
  created: UserRequest[];
  updated: UserRequest[];
  deleted: UserRequest[];
}

let store: DemoUserRow[] = INITIAL_DEMO_USERS.map((row) => ({ ...row }));
let sequence = 0;

const base = getApiBaseUrl().replace(/\/$/, '');

function createUserId(): string {
  sequence += 1;
  return `u-${Date.now()}-${sequence}`;
}

/** 신규 행: 서버가 PK 채번(요청의 NEW_ID는 무시), 응답 파생 필드는 미설정 */
function toRow(request: UserRequest): DemoUserRow {
  return {
    userId: createUserId(),
    loginId: request.loginId,
    empNo: request.empNo,
    empName: request.empName,
    empNameEng: request.empNameEng,
    displayName: request.displayName,
    email: request.email,
    orgId: request.orgId,
    titleCd: request.titleCd,
    langCd: request.langCd,
    active: request.active,
  };
}

export const userHandlers: HttpHandler[] = [
  http.get(`${base}/api/admin/users`, ({ request }) => {
    const url = new URL(request.url);
    const empName = url.searchParams.get('empName')?.trim().toLowerCase() ?? '';
    const items = empName
      ? store.filter((row) => row.empName.toLowerCase().includes(empName))
      : store;
    return HttpResponse.json({ items });
  }),

  http.post(`${base}/api/admin/users/commit`, async ({ request }) => {
    const body = (await request.json()) as UserCommitPayload;
    const isNew = (req: UserRequest) => req.userId === NEW_ID;
    const updates = new Map(
      body.updated.filter((req) => !isNew(req)).map((req) => [req.userId, req]),
    );
    const deleted = new Set(
      body.deleted.filter((req) => !isNew(req)).map((req) => req.userId),
    );

    store = [
      ...store
        .filter((row) => !deleted.has(row.userId))
        .map((row) => {
          const patch = updates.get(row.userId);
          return patch ? { ...row, ...patch } : row;
        }),
      ...body.created.map((request) => toRow(request)),
    ];

    return HttpResponse.json({ items: store });
  }),
];

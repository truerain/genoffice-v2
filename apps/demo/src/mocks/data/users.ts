/**
 * @file apps/demo/src/mocks/data/users.ts
 * @description Mock server seed for admin users (MSW userHandlers).
 * @created 2026-07-08
 *
 * @remark
 * - userHandlers가 이 시드를 복제해 in-memory 서버 상태로 사용
 *
 */

import type { DemoUserRow } from '../../pages/admin/user/user.types';

export const INITIAL_DEMO_USERS: DemoUserRow[] = [
  {
    userId: 'u-1',
    loginId: 'admin',
    empNo: 'E0001',
    empName: '시스템 관리자',
    empNameEng: 'System Admin',
    displayName: 'System Admin',
    email: 'admin@example.com',
    langCd: 'ko',
    active: true,
  },
  {
    userId: 'u-2',
    loginId: 'jdoe',
    empNo: 'E0002',
    empName: 'Jane Doe',
    empNameEng: 'Jane Doe',
    displayName: 'Jane Doe',
    email: 'jane.doe@example.com',
    langCd: 'en',
    active: true,
  },
  {
    userId: 'u-3',
    loginId: 'inactive',
    empNo: 'E0003',
    empName: 'Inactive User',
    empNameEng: 'Inactive User',
    displayName: 'Inactive User',
    email: 'inactive@example.com',
    langCd: 'ko',
    active: false,
  },
];

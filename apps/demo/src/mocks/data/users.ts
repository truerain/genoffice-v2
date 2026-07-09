/**
 * @file apps/demo/src/mocks/data/users.ts
 * @description Mock server seed for admin users (MSW userHandlers).
 * @created 2026-07-08
 *
 * @remark
 * - userHandlers가 이 시드를 복제해 in-memory 서버 상태로 사용
 *
 */

import type { UserRow } from '../../pages/admin/user/user.types';

export const INITIAL_DEMO_USERS: UserRow[] = [
  {
    userId: 'u-1',
    loginId: 'admin',
    empNo: 'E0001',
    empName: '시스템 관리자',
    empNameEng: 'System Admin',
    displayName: 'System Admin',
    email: 'admin@example.com',
    orgId: 'ORG-IT',
    orgName: 'IT 혁신팀',
    titleCd: 'T1',
    titleName: '부장',
    titleNameEng: 'General Manager',
    langCd: 'ko',
    active: true,
    lastUpdatedDate: '20260709 00:00:00',
    lastUpdatedName: 'SYSTEM'
    },
  {
    userId: 'u-2',
    loginId: 'jdoe',
    empNo: 'E0002',
    empName: 'Jane Doe',
    empNameEng: 'Jane Doe',
    displayName: 'Jane Doe',
    email: 'jane.doe@example.com',
    orgId: 'ORG-SALES',
    orgName: '영업팀',
    titleCd: 'T2',
    titleName: '과장',
    titleNameEng: 'Manager',
    langCd: 'en',
    active: true,
    lastUpdatedDate: '20260709 00:00:00',
    lastUpdatedName: 'SYSTEM'
  },
  {
    userId: 'u-3',
    loginId: 'inactive',
    empNo: 'E0003',
    empName: 'Inactive User',
    empNameEng: 'Inactive User',
    displayName: 'Inactive User',
    email: 'inactive@example.com',
    orgId: 'ORG-HR',
    orgName: '인사혁신팀',
    titleCd: 'T3',
    titleName: '사원',
    titleNameEng: 'Staff',
    langCd: 'ko',
    active: false,
    lastUpdatedDate: '20260709 00:00:00',
    lastUpdatedName: 'SYSTEM'
  },
];

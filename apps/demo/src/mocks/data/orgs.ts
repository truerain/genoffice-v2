/**
 * @file apps/demo/src/mocks/data/orgs.ts
 * @description Mock server seed for admin organizations (MSW orgHandlers).
 * @created 2026-07-09
 */

import type { Org } from '../../shared/domain/org.types';

/** 가상 부서 23건 — Popup lookup·검색 데모용 */
export const INITIAL_DEMO_ORGS: Org[] = [
  { orgId: 'ORG-IT', orgName: 'IT혁신팀' },
  { orgId: 'ORG-SALES', orgName: '영업팀' },
  { orgId: 'ORG-HR', orgName: '인사혁신팀' },
  { orgId: 'ORG-FIN', orgName: '재무팀' },
  { orgId: 'ORG-ACC', orgName: '회계팀' },
  { orgId: 'ORG-MKT', orgName: '마케팅팀' },
  { orgId: 'ORG-RND', orgName: '연구개발팀' },
  { orgId: 'ORG-QA', orgName: '품질관리팀' },
  { orgId: 'ORG-LOG', orgName: '물류팀' },
  { orgId: 'ORG-PR', orgName: '구매팀' },
  { orgId: 'ORG-CS', orgName: '고객지원팀' },
  { orgId: 'ORG-LEGAL', orgName: '법무팀' },
  { orgId: 'ORG-PLAN', orgName: '경영기획팀' },
  { orgId: 'ORG-SEC', orgName: '정보보안팀' },
  { orgId: 'ORG-DEV1', orgName: '개발1팀' },
  { orgId: 'ORG-DEV2', orgName: '개발2팀' },
  { orgId: 'ORG-DESIGN', orgName: 'UX디자인팀' },
  { orgId: 'ORG-OPS', orgName: '운영팀' },
  { orgId: 'ORG-BD', orgName: '사업개발팀' },
  { orgId: 'ORG-INT', orgName: '해외사업팀' },
  { orgId: 'ORG-EDU', orgName: '교육훈련팀' },
  { orgId: 'ORG-AUD', orgName: '감사팀' },
  { orgId: 'ORG-ADMIN', orgName: '총무팀' },
];

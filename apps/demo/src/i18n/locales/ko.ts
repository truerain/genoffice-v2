/**
 * @file apps/demo/src/i18n/locales/ko.ts
 * @description Korean message dictionary — V1-compatible key paths (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 * - Nested keys: menu.*, page.*, auth.*, common.*
 *
 */

const ko = {
  common: {
    loading: '로딩 중…',
    pageNotFound: '등록되지 않은 화면입니다.',
  },
  auth: {
    loginTitle: 'GenOffice V2 Demo',
    loginSubtitle: 'Mock 또는 backend 세션 로그인',
    username: '사용자 ID',
    password: '비밀번호',
    loginButton: '로그인',
    logout: '로그아웃',
  },
  menu: {
    title: '메뉴',
    placeholder: 'Welcome',
    chartDemo: 'Chart Demo',
    dashboardDemo: 'Dashboard Demo',
    loadError: '메뉴를 불러오지 못했습니다.',
  },
  page: {
    placeholder: {
      description: 'Registry 기반 MDI 탭 콘텐츠입니다. D3에서 Chart/Dashboard를 구현합니다.',
    },
    chartDemo: {
      description: 'Gate D3 — gen-chart composable API 데모가 여기에 연결됩니다.',
      comingSoon: 'D3에서 구현 예정',
    },
    dashboardDemo: {
      description: 'Gate D3 — Dashboard 카드 그리드 데모가 여기에 연결됩니다.',
      comingSoon: 'D3에서 구현 예정',
    },
  },
  mdi: {
    maxTabsTitle: '탭 제한',
    maxTabsMessage: '최대 {{max}}개까지만 탭을 열 수 있습니다.',
    empty: '열린 탭이 없습니다.',
  },
} as const;

export interface MessageTree {
  [key: string]: string | MessageTree;
}
export type MessageKey = string;

export default ko;

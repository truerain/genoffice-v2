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
      description: 'Registry 기반 MDI 탭 콘텐츠입니다.',
    },
    chartDemo: {
      description: 'gen-chart composable API — line, bar, area, composed, pie, donut.',
      sections: {
        line: 'Line',
        bar: 'Bar (grouped)',
        area: 'Area',
        composed: 'Composed (bar + line)',
        pie: 'Pie',
        donut: 'Donut',
      },
    },
    dashboardDemo: {
      description: 'Responsive cartesian charts in a 2×2 card grid (gen-chart C7 pattern).',
      hint: '브라우저 또는 MDI 탭 크기를 조절하면 각 카드 차트가 ResizeObserver로 reflow 합니다.',
      cards: {
        revenueTrend: 'Revenue trend',
        monthlyCost: 'Monthly cost',
        orderVolume: 'Order volume',
        revenueVsCost: 'Revenue vs cost',
      },
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

/**
 * @file apps/demo/src/i18n/locales/en.ts
 * @description English fallback dictionary (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 *
 */

import type { MessageTree } from './ko';

const en: MessageTree = {
  common: {
    loading: 'Loading…',
    pageNotFound: 'Page is not registered.',
  },
  auth: {
    loginTitle: 'GenOffice V2 Demo',
    loginSubtitle: 'Mock or backend session login',
    username: 'Username',
    password: 'Password',
    loginButton: 'Sign in',
    logout: 'Sign out',
  },
  menu: {
    title: 'Menu',
    placeholder: 'Welcome',
    chartDemo: 'Chart Demo',
    dashboardDemo: 'Dashboard Demo',
    loadError: 'Failed to load menu.',
  },
  page: {
    placeholder: {
      description: 'Registry-driven MDI tab content. Chart/Dashboard arrive in D3.',
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
      hint: 'Resize the browser or MDI tab — each card chart reflows via ResizeObserver.',
      cards: {
        revenueTrend: 'Revenue trend',
        monthlyCost: 'Monthly cost',
        orderVolume: 'Order volume',
        revenueVsCost: 'Revenue vs cost',
      },
    },
  },
  mdi: {
    maxTabsTitle: 'Tab limit',
    maxTabsMessage: 'You can open up to {{max}} tabs.',
    empty: 'No open tabs.',
  },
};

export default en;

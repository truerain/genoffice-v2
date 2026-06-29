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
      description: 'Gate D3 — gen-chart composable demo will be wired here.',
      comingSoon: 'Planned for D3',
    },
    dashboardDemo: {
      description: 'Gate D3 — Dashboard card grid demo will be wired here.',
      comingSoon: 'Planned for D3',
    },
  },
  mdi: {
    maxTabsTitle: 'Tab limit',
    maxTabsMessage: 'You can open up to {{max}} tabs.',
    empty: 'No open tabs.',
  },
};

export default en;

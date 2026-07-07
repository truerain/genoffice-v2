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
    userManagement: 'User Management',
    menuManagement: 'Menu Management',
    actuals: 'Actuals',
    customerInfo: 'Customer Info',
    loadError: 'Failed to load menu.',
  },
  page: {
    placeholder: {
      description: 'Registry-driven MDI tab content.',
      note: 'Buttons below add tabs like the sidebar menu (no page reload).',
      linksTitle: 'Demo pages',
      openChart: 'Open Chart Demo',
      openDashboard: 'Open Dashboard Demo',
      openUserManagement: 'Open User Management',
      openMenuManagement: 'Open Menu Management',
      openActuals: 'Open Actuals',
      openCustomerInfo: 'Open Customer Info',
      linksHint:
        'Address bar deep link: /?menu=900800 — pinned Welcome tab + target page (tabs reset on full reload).',
    },
    comingSoon: {
      title: 'Coming soon',
      description: 'This V1 menu entry is wired, but the screen is not ported to the V2 demo yet.',
      note: 'It will be migrated in a follow-up D4/D5 gate or covered in Storybook.',
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
    userManagement: {
      description: 'Reference CRUD screen — GenDataGridCrud with in-memory mock save.',
      newUser: 'New user',
      validation: {
        loginId: 'Login ID is required.',
      },
    },
    menuManagement: {
      description: 'Hierarchical menu tree — enableTreeRows with in-memory mock save.',
      newMenu: 'New menu',
      validation: {
        menuName: 'Menu name is required.',
      },
    },
    actuals: {
      description: 'Readonly actuals inquiry — virtualization, pinning, export shell.',
      exportShell: 'Export shell — real Excel file generation is a follow-up workflow.',
      filters: {
        fiscalMonth: 'Fiscal Month',
        organization: 'Organization',
        account: 'Account',
        hint: 'Click Search to apply filters.',
      },
      actions: {
        search: 'Search',
        settings: 'Settings',
        refresh: 'Refresh',
      },
      settings: {
        title: 'Grid settings',
        description: 'Actuals is a readonly inquiry screen.',
        rowHeight: 'Row height: 32px',
        virtualization: 'Virtualization: enabled',
        close: 'Close',
      },
    },
    customerInfo: {
      description:
        'GenDataGridCrud editing regression — text/select/date editors, click continuation, select-on-focus.',
      validation: {
        name: 'Customer name is required.',
      },
      filters: {
        search: 'Search',
        searchPlaceholder: 'Name, email, company, phone',
        status: 'Status',
        grade: 'Grade',
        all: 'All',
        statusActive: 'Active',
        statusInactive: 'Inactive',
        statusPending: 'Pending',
        searchAction: 'Search',
      },
      actions: {
        search: 'Search',
      },
    },
  },
  mdi: {
    maxTabsTitle: 'Tab limit',
    maxTabsMessage: 'You can open up to {{max}} tabs.',
    empty: 'No open tabs.',
  },
  frame: {
    layout: 'Layout',
  },
  settings: {
    title: 'Settings',
    open: 'Open settings',
    close: 'Close',
    layout: {
      section: 'Menu placement',
      titleBar: {
        title: 'Top',
        hint: 'Show navigation horizontally in the title bar.',
      },
      leftPanel: {
        title: 'Left',
        hint: 'Show navigation in the left sidebar.',
      },
    },
  },
};

export default en;

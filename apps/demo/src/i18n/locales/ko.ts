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
    userManagement: 'User Management',
    menuManagement: 'Menu Management',
    actuals: 'Actuals',
    customerInfo: '고객정보',
    loadError: '메뉴를 불러오지 못했습니다.',
  },
  page: {
    placeholder: {
      description: 'Registry 기반 MDI 탭 콘텐츠입니다.',
      note: '아래 버튼은 메뉴 클릭과 동일하게 탭을 추가합니다(페이지 새로고침 없음).',
      linksTitle: '데모 화면',
      openChart: 'Chart Demo 열기',
      openDashboard: 'Dashboard Demo 열기',
      openUserManagement: 'User Management 열기',
      openMenuManagement: 'Menu Management 열기',
      openActuals: 'Actuals 열기',
      openCustomerInfo: '고객 정보 열기',
      linksHint:
        '주소창 딥링크: /?menu=900800 — 고정 Welcome 탭 + 해당 화면(새로고침 시 탭은 초기화됩니다).',
    },
    comingSoon: {
      title: '준비 중',
      description: 'V1 메뉴는 연결되었으나 이 화면은 아직 V2 demo에 포팅되지 않았습니다.',
      note: 'Storybook 또는 후속 D4/D5 Gate에서 이식될 예정입니다.',
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
    userManagement: {
      description: 'GenDataGridCrud 참조 CRUD 화면 — mock in-memory 저장.',
      newUser: 'New user',
      filters: {
        empName: '이름',
        empNamePlaceholder: '이름 검색',
        useYn: '사용 여부',
        useYnAll: '전체',
        search: '검색',
      },
      validation: {
        loginId: 'Login ID는 필수입니다.',
      },
    },
    menuManagement: {
      description: '계층 메뉴 트리 — enableTreeRows + GenDataGridCrud mock 저장.',
      newMenu: 'New menu',
      validation: {
        menuName: '메뉴명은 필수입니다.',
      },
    },
    actuals: {
      description: 'readonly 실적 조회 — virtualization·pinning·export shell.',
      exportShell: 'Export shell — 실제 Excel 파일 생성은 후속 workflow입니다.',
      filters: {
        fiscalMonth: 'Fiscal Month',
        organization: 'Organization',
        account: 'Account',
        hint: 'Search 버튼으로 필터를 적용합니다.',
      },
      actions: {
        search: 'Search',
        settings: 'Settings',
        refresh: 'Refresh',
      },
      settings: {
        title: 'Grid settings',
        description: 'Actuals 화면은 readonly 조회 전용입니다.',
        rowHeight: 'Row height: 32px',
        virtualization: 'Virtualization: enabled',
        close: '닫기',
      },
    },
    customerInfo: {
      description:
        'GenDataGridCrud 편집 회귀 화면 — text/select/date editor, click continuation, select-on-focus.',
      validation: {
        name: '고객명은 필수입니다.',
      },
      filters: {
        search: '검색',
        searchPlaceholder: '이름, 이메일, 회사, 전화번호',
        status: '상태',
        grade: '등급',
        all: '전체',
        statusActive: '활성',
        statusInactive: '비활성',
        statusPending: '대기중',
        searchAction: '조회',
      },
      actions: {
        search: '조회',
      },
    },
  },
  mdi: {
    maxTabsTitle: '탭 제한',
    maxTabsMessage: '최대 {{max}}개까지만 탭을 열 수 있습니다.',
    empty: '열린 탭이 없습니다.',
  },
  frame: {
    layout: '레이아웃',
  },
  settings: {
    title: '환경설정',
    open: '환경설정 열기',
    close: '닫기',
    layout: {
      section: '메뉴 표시 위치',
      titleBar: {
        title: '상단 (Top)',
        hint: '메뉴를 타이틀바에 가로로 표시합니다.',
      },
      leftPanel: {
        title: '좌측 (Left)',
        hint: '메뉴를 왼쪽 패널에 세로로 표시합니다.',
      },
    },
    pageChrome: {
      section: '페이지 레이아웃',
      showHeader: {
        title: '페이지 헤더 표시',
        hint: '각 화면의 제목·설명(PageHeader)을 표시합니다. 필터·본문은 유지됩니다.',
      },
      actionBarIcon: {
        title: 'ActionBar 아이콘만',
        hint: 'CRUD ActionBar 버튼을 아이콘만 표시합니다. 툴팁·aria-label은 유지됩니다.',
      },
    },
  },
} as const;

export interface MessageTree {
  [key: string]: string | MessageTree;
}
export type MessageKey = string;

export default ko;

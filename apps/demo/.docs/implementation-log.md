<!--
 @file apps/demo/.docs/implementation-log.md
 @description Implementation and design change log for @gen-office/demo.

 @created 2026-06-28

 @remark
-->
# @gen-office/demo 구현 로그

## 2026-07-01

### Vite build — Radix `"use client"` 경고 억제

- **요약:** SPA 빌드 시 Radix UI `MODULE_LEVEL_DIRECTIVE` 경고를 `rollupOptions.onwarn`으로 숨김 (Storybook과 동일 패턴)
- **파일:** `apps/demo/vite.config.ts`
- **검증:** `pnpm -C apps/demo build`

### PageLayout — @gen-office/ui composed 승격

- **요약:** demo `AdminPageLayout`/`PageHeader` 제거, `@gen-office/ui` `PageLayout`/`PageHeader`로 전환
- **파일:** `apps/demo/src/pages/**`, `apps/demo/src/styles/demo-ui.css`; `packages/ui/src/composed/pageLayout/**`
- **검증:** `pnpm -C packages/ui build`, `pnpm -C apps/demo build`

## 2026-07-01

### CustomerInfoPage 포팅 — GenDataGrid 편집 회귀 데모

- **요약:** V1 `CustomerInfoPage`를 V2 demo에 포팅. mock in-memory CRUD, text/select/date editor, 필터, virtualization
- **파일:** `pages/customer/customer-info/**`, `componentRegistry.dynamic.ts`, `mockMenu.ts`, `demoPageIds.ts`, `PlaceholderPage.tsx`, `i18n/locales/*`
- **검증:** `pnpm -C apps/demo build`

## 2026-06-29

### pinnedPages — AppShell에서 useOpenPage로 주입

- **요약:** `useOpenPage({ pinnedPages })` — shell 정책과 탭 엔진 분리, `pinnedPageIds`로 closable 판단
- **파일:** `AppShell.tsx`, `hooks/useOpenPage.ts`
- **검증:** `pnpm -C apps/demo build`

### Welcome pin — gen-frame `pinnedPages`로 이전

- **요약:** `useEnsureWelcomePinTab` 삭제, `useOpenPage`에서 `pinnedPages` 선언
- **파일:** `hooks/useOpenPage.ts`, `AppShell.tsx`, `openPage.tsx`; gen-frame `syncPinnedMdiTabs`
- **검증:** `pnpm -C packages/gen-frame test`, `pnpm -C apps/demo build`

### Welcome pin 탭 (PlaceholderPage)

- **요약:** `closable: false` Welcome 탭을 앱 시작 시 1회 오픈 — `items[0]` 자동 오픈·딥링크 home 선오픈 제거
- **파일:** `openPage.tsx` (`createWelcomePinTab`), `hooks/useEnsureWelcomePinTab.ts`, `AppShell.tsx`, `useDemoMenuDeepLink.ts`, `useOpenPage.ts`
- **검증:** `pnpm -C apps/demo build`

### Multi-App Frame 설계 문서

- **요약:** App Profile(`layout` × `navigation` × URL base), MDI/single 분기, `profiles/`·`shell/` 파일 배치안, Phase M0~M4
- **파일:** `.docs/multi-app-frame.md`, `.docs/README.md`, `.docs/architecture.md` 링크
- **상태:** 설계만 (구현 M1 이후)

### AppShell — 환경설정(톱니) 모달

- **요약:** header 로그아웃·`FrameLayoutToggle` 제거 → 톱니 버튼 + `DemoSettingsModal` (Top/Left 레이아웃)
- **파일:** `AppShell.tsx`, `app/settings/DemoSettingsModal.tsx`, i18n ko/en
- **검증:** `pnpm -C apps/demo build`

## 2026-06-29

- **요약:** `enableTreeRows` + nested mock menu · `GenDataGridCrud` in-memory commit
- **파일:** `src/pages/admin/menu-management/**`, registry, mock menu, i18n
- **검증:** `pnpm -C apps/demo build`

### Gate D4 — Admin CRUD (1차)

- **요약:** `GenDataGridCrud` demo 연동 — UserManagement (mock CRUD), Actuals (readonly + virtualization)
- **의존:** `@gen-office/gen-datagrid-crud`, `@tanstack/react-table`, `lucide-react`
- **CSS:** `main.tsx` — `@gen-office/gen-datagrid-crud/index.css`
- **레이아웃:** `AdminPageLayout` `contentVariant="fill"` (grid height chain)
- **registry:** `UserManagementPage`, `ActualsPage` + mock menu
- **타입:** `src/types/gen-datagrid-crud.d.ts` (dist `.d.ts` 미생성 대응)
- **검증:** `pnpm -C apps/demo build`
- **다음:** MenuManagement, LkupManagement, RoleManagement, backend API 연동

## 2026-06-29

### FrameBrand header logo

- **요약:** `@gen-office/gen-frame` `FrameBrand` + `src/assets/brand-logo.png`
- **파일:** `AppShell.tsx`
- **검증:** `pnpm -C apps/demo build`

### URL sync (F4)

- **요약:** `?tab=<pageId>` 쿼리와 MDI 활성 탭 양방향 동기화
- **파일:** `src/app/url/demoUrlSync.ts`, `AppShell.tsx` (`useUrlSync`)
- **검증:** `pnpm -C apps/demo build`

### gen-frame AppShell 연동 (F3)

- **요약:** `@gen-office/gen-frame` — `WorkspaceFrame`, `MdiPageHost`, `FrameLayoutToggle`
- **내비:** `useMdiNavigationController` + `mapAppMenuToFrame.ts`
- **layout:** header `Left` / `Top` 토글 (`gen-office-demo-frame-layout`)
- **검증:** `pnpm -C apps/demo build`

### Soft Modern UI (demo 전용)

- **요약:** workarea 틴트 + elevation 기반 Soft Modern 시각 규칙 적용
- **문서:** `.docs/ui-direction.md`
- **토큰:** `src/styles/demo-ui.css` (`--demo-*`, workarea 스코프 오버라이드)
- **컴포넌트:** `shared/components/DemoSurface` (elevated/chrome/flat)
- **적용:** AppShell, MenuSidebar, LoginPage, PageHeader, AdminPageLayout, chart/dashboard 카드·섹션
- **범위:** `apps/demo`만 — theme/ui/mdi 패키지 미변경

## 2026-06-28

### Gate D3 — Chart / Dashboard (gen-chart)

- **요약:** `ChartDemoPage` (line/bar/area/composed/pie/donut), `DashboardDemoPage` (2×2 카드 그리드)
- **패키지:** `@gen-office/gen-chart`, `ResponsiveChartContainer` + composable slots
- **타입:** `src/types/gen-chart.d.ts` 임시 ambient (dist `.d.ts` 미생성 대응)
- **검증:** `pnpm -C packages/gen-chart build` → `pnpm -C apps/demo build`
- **다음:** Gate D4 — admin CRUD (gen-datagrid 합류 후)

### Gate D2 — API · menu · registry · i18n

- **요약:** `shared/api` (httpClient, csrf, authApi, appMenuApi), `componentRegistry.dynamic`, `useAppMenu`, `MenuSidebar`, i18n ko/en
- **레이아웃:** `PageHeader`, `AdminPageLayout`; Chart/Dashboard registry 슬롯 (D3 본문)
- **env:** `.env.development` — `VITE_USE_MOCK_AUTH`, `VITE_USE_MOCK_MENU`
- **검증:** `pnpm -C apps/demo build` (lazy chunk 분리)
- **다음:** Gate D3 — ChartDemoPage, DashboardDemoPage (gen-chart)

### Gate D1 — App shell + MDI

- **요약:** `AppProviders`, mock `AuthProvider`, `AppShell`, `MDIContainer`, `PlaceholderPage`, `useOpenPage`
- **UI:** `@gen-office/ui` Toast (`onMaxTabsReached`), Button; `@gen-office/mdi` tab labels ko
- **검증:** `pnpm -C apps/demo build`
- **다음:** Gate D2 — API, menu, componentRegistry

### 파일 헤더 `@remark` 필수

- `apps/demo` 소스·설정 파일에 빈 `@remark` 포함
- `AGENTS.md` — 신규 소스 헤더에 `@remark` 필수 규칙 반영

### Gate D0 — Scaffold

- **요약:** `package.json`, Vite 6 (`esbuild` JSX), `ThemeProvider`, placeholder `App`
- **검증:** `pnpm -C apps/demo build` (theme 선행 build)
- **다음:** Gate D1 — AppShell, MDI, login branch

### Demo 아키텍처·구현 Plan 문서화

- **요약:** `apps/demo` 디렉터리 생성 후 구현 전 설계 문서 작성
- **Phase:** D0~D3 grid 없이 착수 가능 · D4~D5는 gen-datagrid 합류 후
- **문서:** `architecture.md`, `plan.md`, `README.md`
- **다음:** Gate D0 — Vite scaffold, `pnpm -C apps/demo dev`

<!--
 @file apps/demo/.docs/implementation-log.md
 @description Implementation and design change log for @gen-office/demo.

 @created 2026-06-28

 @remark
-->
# @gen-office/demo 구현 로그

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

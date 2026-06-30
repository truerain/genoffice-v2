<!--
 @file packages/gen-frame/.docs/implementation-log.md
 @description Implementation and design change log for @gen-office/gen-frame.

 @created 2026-06-29

 @remark
-->
# @gen-office/gen-frame 구현 로그

## 2026-06-29

### MDI pinnedPages (`useMdiNavigationController`)

- **요약:** `pinnedPages` + `syncPinnedMdiTabs` — mount 시 `closable: false` 탭 보장, title 갱신
- **파일:** `src/navigation/syncPinnedMdiTabs.ts`, `useMdiNavigationController.ts`, test 2건
- **demo:** `useEnsureWelcomePinTab` 제거 → `useOpenPage` `pinnedPages`
- **검증:** `pnpm -C packages/gen-frame test`, `pnpm -C apps/demo build`

### URL `?menu=` — 메뉴 클릭과 동일 경로

- **demo:** `useUrlSync` 제거 → `useDemoMenuDeepLink` + `openMenuItem`
- **동작:** 기존 탭 유지, MDI `addTab`/활성만 (메뉴 클릭과 동일), 이후 URL 루트로 정리

### FrameBrand — header logo

- **요약:** `FrameBrand`, `DEFAULT_FRAME_BRAND_LOGO_SRC`, 기본 `src/assets/default-logo.png`
- **demo:** `brand-logo.png`로 `src` override
- **검증:** gen-frame test, `pnpm -C apps/demo build`

### F5 — Single page host

- **요약:** `createSingleNavigationController`, `useSingleNavigationController`, `SinglePageHost`
- **Storybook:** `GenFrame/Navigation/Single` (Single / MdiVsSingle)
- **문서:** README navigation mode 가이드, `@gen-office/mdi` optional peer
- **검증:** gen-frame test, build
- **상태:** F0~F5 Gate 완료

### F4 — URL sync (`?tab=`)

- **요약:** `UrlSyncAdapter`, `createQueryTabUrlSyncAdapter`, `useUrlSync`
- **동작:** 초기 로드·popstate → `controller.open/activate`; 활성 탭 변경 → `pushState`
- **demo:** `demoUrlSyncAdapter`, `AppShell` `useUrlSync` + URL tab 시 첫 메뉴 자동 오픈 스킵
- **검증:** gen-frame test 28건, `pnpm -C apps/demo build`
- **다음:** F5 — single page host

### F3 — NavigationController + demo 연동

- **요약:** `createMdiNavigationController`, `useMdiNavigationController`, `MdiPageHost`
- **demo:** `AppShell` → `WorkspaceFrame` + `MdiPageHost`, `mapAppMenuToFrame`, layout 토글
- **검증:** gen-frame test 21건, `pnpm -C apps/demo build`
- **다음:** F4 — URL sync adapter

### F2 — titleBar + layout showcase

- **요약:** `TitleBarNav`, `NavRenderer`, `FrameLayoutToggle`, `useFrameLayout`
- **Storybook:** `GenFrame/Layout/TitleBar`, `GenFrame/Layout/Matrix` (layout 전환 + persistence)
- **의존:** `@gen-office/ui` (DropdownMenu), `lucide-react`
- **검증:** test 18건, build 통과
- **다음:** F3 — `NavigationController` + demo `AppShell` 이전

### F1 — WorkspaceFrame + leftPanel

- **요약:** 패키지 빌드 scaffold, `WorkspaceFrame`, `LeftPanelNav`, Storybook `GenFrame/Layout/LeftPanel`
- **타입:** `FrameMenuItem`, `FrameMenuModel`, `WorkspaceFrameProps`, `FrameLayoutMode`
- **검증:** `pnpm -C packages/gen-frame test` (6), `pnpm -C packages/gen-frame build`
- **다음:** F2 — `TitleBarNav` + layout matrix showcase

### F0 — 패키지 설계·문서 scaffold

- **요약:** `@gen-office/gen-frame` 패키지 디렉터리 및 설계 문서 초안
- **배경:** framework showcase — 다중 layout, MDI/비MDI, URL 연동을 앱 shell 계층에서 오케스트레이션
- **결정:** 패키지명 `gen-frame` (`gen-grid` / `gen-chart` 라인업); `mdi`는 optional peer
- **문서:** `architecture.md`, `plan.md` (Phase F0~F5)
- **다음:** F1 — `WorkspaceFrame` + `leftPanel` Storybook

<!--
 @file apps/demo/.docs/logs/implementation-log.md
 @description Implementation and design change log for @gen-office/demo.

 @created 2026-06-28

 @remark
-->
# @gen-office/demo 구현 로그

## 2026-07-08

### 화면 소스·스타일 컨벤션 문서화 (guide/page-conventions.md)

- **요약:** 이번 세션에서 정립한 규칙(파일 구성/네이밍, 데이터 훅 분리, 함수 정렬·주석, CSS 규칙)을 단일 가이드로 통합.
- **내용:** `{domain}Query`/`{domain}Mutation` 분리·단수 파일명, transport↔hooks 축, 리소스=훅·독립 캐시, 진입점 상단 배치+`[메인]` 표기+함수별 주석, `standardLayout.module.css`(workarea/fill)·CSS import 이름 규칙(`styles`/`{page}Style`)·토큰 우선.
- **파일:** `guide/page-conventions.md`(신규), `.docs/README.md`(문서 목록에 추가). 세부는 data-integration.md/ui-direction.md 상호 링크로 중복 최소화.

### 표준 페이지 레이아웃 CSS 공유화 (standardLayout.module.css)

- **요약:** CRUD 페이지 4곳이 복제하던 flex-height 보일러플레이트(`.workarea`+`.crud`)를 공유 모듈로 통합. `ui`의 `PageLayout`(외곽)과 역할 분담해 content 안쪽 채움만 담당.
- **신규:** `src/shared/styles/standardLayout.module.css` — `.workarea`(채움 컬럼, gap=`--spacing-md`) · `.fill`(남는 공간 채우는 자식). 비율/가로/스플리터 등 화면 고유 배치는 각 화면 모듈 몫으로 명시.
- **적용:** `UserPage`/`MenuPage`/`CustomerInfoPage`/`ActualsPage`가 `standard.workarea`+`standard.fill` 사용. 그리드 className은 `standard.fill`.
- **삭제:** `UserPage.module.css`·`MenuPage.module.css`·`CustomerInfoPage.module.css`(중복만 있어 제거). `ActualsPage.module.css`는 `.settingsBody`만 남기고 하드코딩값을 토큰화(`gap:8px`→`--spacing-sm`, `font-size:14px`→`--font-size-sm`, 값 동일).
- **파일:** `shared/styles/standardLayout.module.css`(신규), 위 4개 `Page.tsx`, `ActualsPage.module.css`, 3개 모듈 삭제
- **import 규칙:** 공유 표준 레이아웃은 `styles`로 import(모든 페이지 동일 의미), 화면 전용 모듈은 `{page}Style`(예: `actualsPageStyle`)로 구분. `data-integration.md` §2에 명문화.
- **검증:** `pnpm -C apps/demo exec tsc --noEmit` 통과, lint 0.

### 데이터 훅 파일 컨벤션 확정 (`{domain}Query` / `{domain}Mutation`, 단수)

- **요약:** 모호한 `useUsers` 파일명을 폐기하고 조회/쓰기를 의도 기반 파일로 고정 분리. `useUsers.ts` → `userQuery.ts`, `userMutations.ts` → `userMutation.ts`(단수). react-query 어휘(query/mutation) + `userApi` 단수 집합명과 정합.
- **컨벤션:** `{domain}Page`(컴포넌트, PascalCase 파일) / `{domain}Query` / `{domain}Mutation`(camelCase 파일). 파일명은 카테고리 단수, 훅은 행위별(`useUsersQuery`, 향후 `useUserDetailQuery`).
- **근거:** api에 훅 섞기는 transport의 React 무의존 위배로 비채택. 대신 transport(api) ↔ hooks(query/mutation) 2축 유지. 조회가 늘면 `userQuery.ts`에 리소스별 훅 추가.
- **파일:** `pages/admin/user/{userQuery.ts(신규), userMutation.ts(신규), UserPage.tsx}`, `useUsers.ts`·`userMutations.ts` 삭제, `.docs/guide/data-integration.md`(§2 표·컨벤션·§5·§7·§9 갱신)
- **검증:** `pnpm -C apps/demo exec tsc --noEmit` 통과, lint 0.

### UserPage CUD 집약 (userCommit.ts → userMutations.ts + useUserMutations 훅)

- **요약:** 읽기/쓰기 파일 분리 원칙에 맞춰 쓰기(CUD)를 한 곳으로 집약. `userCommit.ts`를 `userMutations.ts`로 통합하고, `newRow`/`validateCommit`/`handleCommit`을 `useUserMutations()` 훅으로 노출. UserPage는 결선만 담당.
- **useUsers.ts:** `useCommitUsersMutation` 제거 → `useUsersQuery`(읽기)만 유지.
- **userMutations.ts(신규):** 순수 매핑(`toUserRequest`/`buildUserCommitPayload`) + 커밋 mutation(`useCommitUsersMutation`, 파일 로컬) + `useUserMutations()`(newRow·validateCommit·handleCommit·isCommitting).
- **UserPage.tsx:** 인라인 createRow/validateCommit/handleCommit 제거, `const { newRow, validateCommit, handleCommit } = useUserMutations()`로 결선. `createRow={newRow}`.
- **삭제:** `pages/admin/user/userCommit.ts`.
- **파일:** `pages/admin/user/{userMutations.ts(신규), useUsers.ts, UserPage.tsx}`, `.docs/guide/data-integration.md`(§7·§9 체크리스트 갱신)
- **검증:** `pnpm -C apps/demo exec tsc --noEmit` 통과, lint 0.

### UserPage 커밋 계약 적용 (PK 필수 + NEW_ID sentinel + 전체 행 update)

- **요약:** 데이터 연동 가이드의 커밋 표준을 UserPage에 코드 반영. `CommitPayload<TRequest>`의 `updated/deleted`를 `TRequest[]`(전체 행)로 변경, PK를 요청 타입 필수로 두고 신규는 `NEW_ID` sentinel로 표기.
- **types:** `UserRequest = Omit<DemoUserRow,'titleName'|'titleNameEng'>`(파생 제외, PK 포함), `NEW_ID`/`NEW_ROW_ID_PREFIX` 상수 추가.
- **builder:** 소비 중인 `@gen-office/gen-datagrid` 타입의 `changeSet.updated`는 `{rowId, patch}`만 제공(전체 행 없음). → `buildCommitPayload(args, getRowId, toRequest)`가 `args.data`에서 원본을 찾아 `{...base, ...patch}`로 전체 행 재구성. `deleted`도 원본에서 전체 행 매핑.
- **commit 매핑:** `userCommit.ts` `toUserRequest(row)`는 편집 필드만 명시 pick + 임시 rowId(`new-*`)면 PK를 `NEW_ID`로 치환. `buildUserCommitPayload(args)`.
- **MSW:** `userHandlers` 커밋을 `created/updated/deleted: UserRequest[]`로 변경 — `userId===NEW_ID`면 채번, updated는 `{...row, ...req}` 병합, deleted는 키 매칭 제거.
- **page:** `UserPage` createRow가 `NEW_ROW_ID_PREFIX` 사용, onCommit이 `buildUserCommitPayload(args)` 호출.
- **파일:** `pages/admin/user/{user.types.ts, userCommit.ts, UserPage.tsx}`, `shared/api/commit.ts`, `mocks/handlers/userHandlers.ts`, `.docs/guide/data-integration.md`(빌더 시그니처 정정)
- **검증:** `tsc --noEmit`·`pnpm -C apps/demo build` 통과, lint 0.

### 데이터 연동 가이드 문서 추가 (guide/data-integration.md)

- **요약:** CRUD 화면 데이터 계층 합의(요청/응답 타입 분리, PK 필수+`NEW_ID` sentinel, 전체 행 update, `CommitPayload<TRequest>`, 쿼리 키 팩토리+`StandardFilterBar` 필터, MSW 디커플링)를 표준 문서로 정리. 새 화면 작성 체크리스트 포함. `.docs/README.md` 문서 목록에 연결, 결정 로그(`decisions.md`)에 계약 결정 기록.
- **비고:** 문서는 합의된 목표 컨벤션 기준. UserPage 코드 반영은 후속 작업.
- **파일:** `apps/demo/.docs/guide/data-integration.md`(신규), `apps/demo/.docs/README.md`, `.docs/logs/decisions.md`

### CommitPayload 일반화 (공용 타입 + 제네릭 빌더)

- **요약:** 화면 공통 커밋 계약을 `shared/api/commit.ts`로 일반화. `CommitPayload<TRequest>`(created/updated/deleted) + `buildCommitPayload<TRow, TRequest>(changeSet, toRequest)` 추가. 화면은 요청 매퍼(`toRequest`)만 작성.
- **UserPage 적용:** `UserCommitPayload`를 `CommitPayload<UserRequest>` 별칭으로 전환(`extends` 대신 제네릭 별칭 — lint/가독성). `userCommit.ts`는 `toUserRequest`만 남기고 `buildUserCommitPayload`는 `buildCommitPayload` 위임.
- **경계:** MSW `userHandlers.ts`의 로컬 커밋 타입은 client↔mock 디커플링 위해 유지(공유 타입 미결합). 패키지(`gen-datagrid-crud`) 승격은 두 번째 화면 채택 시 재검토.
- **파일:** `apps/demo/src/shared/api/commit.ts`(신규), `apps/demo/src/pages/admin/user/{userApi.ts, userCommit.ts}`
- **검증:** `tsc --noEmit`·`pnpm -C apps/demo build` 통과, lint 0.

### UserPage V1 패턴 반영 (요청/응답 타입 · 파라미터 필터 · 커밋 매핑 격리)

- **요약:** V2 `admin/user`에 V1의 좋은 3패턴을 이식(flat 구조·transport/훅 분리·MSW mock 유지). (1) 요청/응답 타입 분리, (2) 쿼리 키 팩토리 + `empName` 파라미터 필터, (3) 커밋 매핑 격리. V1 부채(`api/`·`model/` 과분리, `User2` 중복 타입, 미사용 granular 뮤테이션)는 비채택.
- **타입:** `user.types.ts`에 `UserRequest`(응답 전용 `userId`·`titleName*` 제외, 편집 필드 optional) + `UserListParams`(`empName?`) 추가.
- **transport:** `userApi.ts`에 `userKeys` 팩토리(`all`/`list(params)`), `fetchUsers(params)`(querystring `empName`), `UserRequest` 기반 `UserCommitPayload`.
- **매핑 격리:** `userCommit.ts` 신규 — `buildUserCommitPayload(changeSet)` + `toUserRequest`로 요청 필드만 pick(인라인 매핑 페이지에서 제거).
- **훅:** `useUsers.ts` `useUsersQuery(params)` 파라미터화 + 명시적 반환 타입(선언 이식성). onSuccess `invalidateQueries({ queryKey: userKeys.all() })`.
- **페이지:** `UserPage.tsx`에 `StandardFilterBar`(draft) + 검색(같은 값이면 `refetch`, 다르면 applied 반영 → queryKey 변경 refetch). onCommit은 `buildUserCommitPayload` 사용.
- **MSW:** `userHandlers.ts` GET에 `empName`(대소문자 무시 includes) 필터, POST commit은 `UserRequest` 적용 + `created` 서버 `userId` 생성.
- **i18n:** `page.userManagement.filters.{empName,empNamePlaceholder,search}` ko/en 추가.
- **검증:** `tsc --noEmit`·`pnpm -C apps/demo build` 통과, lint 0.

### 데이터 계층: TanStack Query + MSW 도입 (UserPage 레퍼런스)

- **요약:** 실제 업무 흐름("컴포넌트 → useQuery/useMutation → httpClient → 네트워크")을 데모에 확립. `@tanstack/react-query`(dep)·`msw`(devDep) 도입, `QueryClientProvider`를 `AppProviders`에 추가. mock은 MSW로 일원화.
- **MSW 인프라:** `src/mocks/browser.ts`, `src/mocks/handlers/{index,authHandlers,appMenuHandlers,userHandlers}.ts`, 서버 시드 `src/mocks/data/users.ts`. `public/mockServiceWorker.js` 생성. `main.tsx`에서 `isMswEnabled()`(dev)일 때만 워커 기동.
- **api 정리:** `authApi`/`appMenuApi`의 in-code mock 분기 제거(항상 httpClient). `env.ts`의 `useMockAuth/useMockMenu` → `isMswEnabled`. `shared/api/mock/mockAuth.ts` 삭제(로직 authHandlers 이관).
- **UserPage:** `userApi.ts`(fetchUsers/commitUsers) + `useUsers.ts`(useUsersQuery/useCommitUsersMutation) 추가. `UserPage.tsx`를 훅 기반으로 리팩터(`dataVersion`=`dataUpdatedAt`, onCommit→changeSet 전송→invalidate). 페이지 `userData.ts` 삭제(시드는 mocks/data로 이동).
- **범위 밖:** MenuPage/ActualsPage/CustomerInfoPage 직접 import 유지, AuthProvider/useAppMenu는 기존 훅 스타일 유지(호출부는 MSW 백엔드로 동작).
- **검증:** `tsc --noEmit` 통과, `pnpm -C apps/demo build` 통과(MSW는 프로덕션 tree-shake 제외, `UserPage` 청크에 react-query 반영). dev(8081) HMR 정상.

### admin 페이지 "Management" 제거 리네임

- **요약:** 디렉토리명 축소 목적으로 `admin/user-management`→`admin/user`, `admin/menu-management`→`admin/menu`로 개명. 파일명·컴포넌트/식별자·레지스트리 키·라우트 문자열에서 `Management` 일괄 제거. `UserManagementPage`→`UserPage`, `MenuManagementPage`→`MenuPage`, 타입 `MenuManagementRow`→`MenuRow`, const `userManagementColumns`→`userColumns`·`menuManagementColumns`→`menuColumns`. `menuData.ts`의 표시용 `menuPath` `/admin/user`·`/admin/menu`로 축소.
- **배선:** `componentRegistry.dynamic.ts` 키/경로, `buildAppMenuFromV1.ts` `V2_READY_COMPONENTS`, `mocks/data/menu.ts` `execComponent`를 새 키로 동기화.
- **범위 제외:** i18n 키 `userManagement`/`menuManagement`는 파일/라우트가 아니므로 유지(`t('page.userManagement.*')` 호출 그대로).
- **파일:** `src/pages/admin/user/**`(5), `src/pages/admin/menu/**`(5) 신규 + 구 폴더 삭제, `src/app/config/componentRegistry.dynamic.ts`, `src/app/menu/buildAppMenuFromV1.ts`, `src/mocks/data/menu.ts`
- **검증:** `tsc --noEmit` 통과, `pnpm -C apps/demo build` 통과(`UserPage`/`MenuPage` 청크 분리 확인)

### componentRegistry 구조 개선 (D2 후속, plan §11)

- **요약:** V1식 가독성 + V2 타입 안전성 하이브리드로 전환. 페이지 8종에 default export 추가(named export 유지), `componentRegistry.dynamic.ts`를 `page(() => import('@/...'))` 한 줄 로더 + 도메인 그룹 주석 + `satisfies Record<string, RegistryComponent>`로 재작성. `ComponentName`을 `keyof typeof componentRegistry`에서 파생(`componentRegistry.ts`), `types.ts`는 파생 타입 re-export로 이중 유지보수 제거. `@/` 별칭(tsconfig `paths` + vite `resolve.alias`) 도입.
- **결정:** `buildAppMenuFromV1.ts`의 `V2_READY_COMPONENTS`는 "V1 메뉴 노출 게이트"로 의미가 별개라 유지. prefetch 헬퍼는 현 규모상 미도입.
- **파일:** `src/app/config/componentRegistry.dynamic.ts`, `componentRegistry.ts`, `componentRegistry.types.ts`, `tsconfig.json`, `vite.config.ts`, `src/pages/**`(8개 default export)
- **검증:** `pnpm -C apps/demo exec tsc --noEmit` 통과, `pnpm -C apps/demo build` 통과(8개 페이지 개별 lazy chunk 확인)

## 2026-07-07

### V1 mock menu 트리 연동

- **요약:** V1 `frontend/apps/demo/src/mocks/data/menu.ts` 동일 데이터를 V2 `src/mocks/data/menu.ts`에 포팅. `parentMenuId` → 계층 `AppMenuItem` 트리. V2 미구현 `execComponent`는 `ComingSoonPage`.
- **파일:** `src/mocks/data/menu.ts`, `app/menu/buildAppMenuFromV1.ts`, `mockMenu.ts`, `pages/placeholder/ComingSoonPage.tsx`, registry, i18n, `demoPageIds.ts`
- **검증:** `pnpm -C apps/demo build`

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

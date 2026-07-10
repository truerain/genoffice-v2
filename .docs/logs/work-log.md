<!--
 @file .docs/logs/work-log.md
 @description Repository-level implementation work log for GenOffice V2.

 @created 2026-06-23
-->
# GenOffice V2 작업 로그

## 2026-07-10

### gen-datagrid — editLookup.mapSelection + applyRowPatch

- **요약:** lookup 선택 시 여러 columnId를 dirty 경로로 반영. `editLookup.mapSelection`, `GenDataGridLookupModalContext.applySelection`, `GenDataGridEditorContext.applyRowPatch` 추가.
- **demo:** `OrgLookupModal` → `ctx.applySelection(org)`, `userColumns`에 `mapSelection` 정의.
- **검증:** gen-datagrid test, demo tsc
- **파일:** `GenDataGrid.types.ts`, `DataGridBodyRow.tsx`, `LookupCellEditor.tsx`, `resolveEditLookup.ts`, `test/interaction.test.tsx`, `apps/demo/.../orgLookupModal.tsx`, `userColumns.ts`

### demo OrgLookupModal — @gen-office/ui StandardDialog 전환

- **요약:** hand-rolled backdrop/dialog 제거. `StandardDialog` + `Input`/`Button` 사용. `DialogContent` ref에 `data-gen-datagrid-editor-surface` 등록으로 grid blur 정책 유지.
- **연동:** `LookupCellEditor`의 createPortal 래퍼 제거 — 앱 modal이 Radix portal 담당.
- **파일:** `apps/demo/src/pages/admin/user/orgLookupModal.tsx`, `orgLookupModal.module.css`, `packages/gen-datagrid/src/features/editing/LookupCellEditor.tsx`, `packages/gen-datagrid/src/index.css`

### gen-datagrid — Lookup modal 결과 후 편집 유지

- **요약:** lookup modal 선택은 값 반영 후 editor를 유지하고, 취소·backdrop·Escape도 modal만 닫도록 `commitAndKeepEditing` 경로 적용.
- **검증:** gen-datagrid test 203/203, demo tsc
- **파일:** `packages/gen-datagrid/src/GenDataGrid.types.ts`, `features/editing/editorContext.ts`, `LookupCellEditor.tsx`, `apps/demo/src/pages/admin/user/orgLookupModal.tsx`

### demo UserPage — 부서 Lookup 인라인 입력·modal keyword 연동

- **요약:** `orgId` lookup의 `allowCellEdit`을 true로 설정. 셀 input draft가 `LookupCellEditor`의 `ctx.keyword`를 통해 부서 modal 초기 검색어로 전달된다.
- **파일:** `apps/demo/src/pages/admin/user/userColumns.ts`, `packages/gen-datagrid/src/features/editing/LookupCellEditor.tsx`, `apps/demo/src/pages/admin/user/orgLookupModal.tsx`

### gen-datagrid — Edit Lookup trigger-only modal open

- **요약:** modal 자동 open 제거. 셀 trigger 버튼 클릭 시에만 `renderModal` portal 표시.
- **파일:** `packages/gen-datagrid/src/features/editing/LookupCellEditor.tsx`, `test/interaction.test.tsx`

### gen-datagrid — Edit Lookup 구현

- **요약:** `editType: 'lookup'` / `editLookup` built-in modal lookup editor. Grid shell + app `renderModal`. demo `orgId` 마이그레이션 (`orgLookupModal.tsx`).
- **검증:** gen-datagrid test 201/201, demo tsc
- **파일:** `packages/gen-datagrid/src/features/editing/LookupCellEditor.tsx`, `resolveEditLookup.ts`, `GenDataGrid.types.ts`, `apps/demo/src/pages/admin/user/orgLookupModal.tsx`, `userColumns.ts`

### gen-datagrid — Edit Lookup architecture + plan

- **요약:** `editType: 'lookup'` / `editLookup` built-in modal lookup 설계·실행 계획 문서화. grid shell + app `renderModal` 분리, `allowCellEdit`·우선순위·Gate 4.1-d blur 계약 정의.
- **파일:** `packages/gen-datagrid/.docs/architecture/edit-lookup-architecture.md`, `packages/gen-datagrid/.docs/plan/edit-lookup-plan.md`, `packages/gen-datagrid/.docs/plan/remaining-work-plan.md`, `packages/gen-datagrid/.docs/README.md`, `packages/gen-datagrid/.docs/log/planning-history.md`

### demo UserPage — MasterDetail horizontal sticky (demo CSS, B)

- **요약:** 행 아래 inline detail + 가로 스크롤 시 panel sticky. 패키지 변경 없음, `UserPage.module.css` scrollport override.
- **파일:** `apps/demo/src/pages/admin/user/UserPage.module.css`, `userDetailPanel.module.css`, `userDetailPanel.tsx`

### gen-datagrid / gen-datagrid-crud — MasterDetail chevron toggle + Storybook

- **요약:** chevron expand toggle helper, grid/CRUD Storybook, demo UserPage 적용.
- **파일:** `packages/gen-datagrid/src/features/master-detail/detailChevronToggle.tsx`, `packages/gen-datagrid-crud/src/stories/GenDataGridCrud.stories.tsx`, `apps/demo/src/pages/admin/user/UserPage.tsx`

### gen-datagrid — MasterDetail toggle-only anchor column 정렬

- **요약:** `_leading` 등 toggle 전용 컬럼에서 expand 버튼 `align: center` 적용. 빈 cell-content flex spacer 제거.
- **파일:** `packages/gen-datagrid/src/features/master-detail/detailToggle.tsx`, `DataGridBodyRow.tsx`, `index.css`

### gen-datagrid-crud — Master-detail Config (`masterDetail` prop) 구현

- **요약:** CRUD `masterDetail` prop 추가, grid flat props normalize, demo UserPage 마이그레이션.
- **파일:** `packages/gen-datagrid-crud/src/features/master-detail/resolveMasterDetailGridProps.ts`, `GenDataGridCrud.types.ts`, `GenDataGridCrud.tsx`, `apps/demo/src/pages/admin/user/UserPage.tsx`

### gen-datagrid-crud — Master-detail Config architecture + plan

- **요약:** grid flat API 유지, CRUD `masterDetail` prop 통합 설계. architecture·plan·remaining-work·package-design·README 갱신.
- **파일:** `packages/gen-datagrid-crud/.docs/architecture/master-detail-config-architecture.md`, `plan/master-detail-config-plan.md`, `gen-datagrid-crud-package-design.md`, `plan/remaining-work-plan.md`, `README.md`

## 2026-07-09

### gen-datagrid — P1 Built-in Editor Meta + MasterDetail Toggle 구현

- **요약:** editor column meta(`editMaxLength`, `editNormalize`, preset `editType`) 및 MasterDetail toggle API 구현. demo `loginId`/`empNo` meta 전환, `userColumnEditors.tsx` 제거, `detailToggleColumnId: '_leading'`.
- **파일:** `packages/gen-datagrid/src/features/editing/editValuePipeline.ts`, `features/master-detail/detailToggle.tsx`, `apps/demo/src/pages/admin/user/userColumns.ts`, `UserPage.tsx`

### gen-datagrid — Row Status Cell Display Context 구현

- **요약:** `meta.renderCell`·`cellClassName`·`cellStyle`에 `rowStatus` 포함 `GenDataGridCellContext` 주입. demo `userId` sentinel 우회 제거. demo에 `@gen-office/gen-datagrid` 직접 의존성 추가.
- **검증:** `pnpm -C packages/gen-datagrid test` 188/188 통과.
- **파일:** `packages/gen-datagrid/src/GenDataGrid.types.ts`, `features/display/resolveCellMeta.ts`, `renderers/div-grid/DataGridBodyRow.tsx`, `DataGridCell.tsx`, `index.ts`, `apps/demo/package.json`, `apps/demo/src/pages/admin/user/userColumns.ts`

### gen-datagrid — MasterDetail 확장 버튼 재정의 계획 (Backlog)

- **요약:** MasterDetail 확장 버튼의 위치(`detailToggleColumnId`)·렌더링(`renderDetailToggle`)·기본 스타일 토큰화 항목을 추가개발 계획에 등록.
- **파일:** `packages/gen-datagrid/.docs/plan/remaining-work-plan.md`

### apps/demo UserPage — userColumns 선행 더미 컬럼 추가

- **요약:** 매핑 없는 `_leading` 컬럼을 맨 앞에 추가해 MasterDetail expand toggle이 데이터 컬럼 앞에서 고정되도록 조정.
- **파일:** `apps/demo/src/pages/admin/user/userColumns.ts`

### apps/demo UserPage — MasterDetail Row 사용자 상세 폼 조회

- **요약:** `GenDataGridCrud` `gridProps`에 `enableMasterDetail`을 연결하고, 행 확장 시 사용자 정보를 2열 폼 형태로 조회하는 detail panel을 추가.
- **파일:** `UserPage.tsx`, `userDetailPanel.module.css`

### gen-datagrid — Dirty State Baseline Revert 계획 (Backlog)

- **요약:** 값을 baseline으로 되돌려도 dirty가 남는 이슈를 `remaining-work-plan.md` Backlog에 등록. gen-datagrid-crud cross-link.
- **파일:** `packages/gen-datagrid/.docs/plan/remaining-work-plan.md`, `packages/gen-datagrid-crud/.docs/plan/remaining-work-plan.md`

### apps/demo UserPage — useYn 셀 render Switch toggle

- **요약:** `useYn` 컬럼을 편집 모드 없이 셀에 Switch를 항상 표시. `GenDataGridHandle.emitCellValueChange`로 dirty 반영. `GenDataGridCrud`에 `gridRef` prop 추가.
- **파일:** `userColumnCells.tsx`, `userGridCellBridge.ts`, `userColumns.ts`, `UserPage.tsx`, `packages/gen-datagrid/src/GenDataGrid.types.ts`, `DataGridRoot.tsx`, `packages/gen-datagrid-crud/src/GenDataGridCrud.tsx`, `GenDataGridCrud.types.ts`

### apps/demo UserPage — useYn Switch toggle editor

- **요약:** `useYn` 컬럼 `@gen-office/ui` Switch editor. Y/N만 허용, 토글 시 `applyValue` 즉시 반영. 표시는 USE_YN 공통코드 lookup.
- **파일:** `userColumnEditors.tsx`, `userColumns.ts`, `UserPage.tsx`

### apps/demo UserPage — 부서 Modal lookup (Popover → Modal)

- **요약:** `orgLookupEditor`를 Modal 패턴으로 전환 (`editBlurOwnership: 'modal'`). 편집 시 모달에서 검색·선택.
- **파일:** `orgLookupEditor.tsx`, `userColumns.ts`, `UserPage.tsx`

### apps/demo UserPage — 부서 Popup lookup (orgId)

- **요약:** 가상 부서 23건·GET /api/admin/orgs. `orgId` 컬럼 Popover 검색 editor·`orgName` 표시. commit 시 mock orgName 갱신.
- **파일:** `mocks/data/orgs.ts`, `orgHandlers.ts`, `orgApi.ts`, `orgQuery.ts`, `orgLookupEditor.tsx`, `userColumns.ts`, `UserPage.tsx`, `userHandlers.ts`

### apps/demo UserPage — TITLE_CD 직책 공통코드·select editor

- **요약:** mock `TITLE_CD` 직책 리스트 추가. `titleCd` 컬럼 lookup 표시·select 편집. commit 시 mock에서 `titleName` 갱신.
- **파일:** `mocks/data/common.ts`, `lkupClssCd.ts`, `lkupResolve.ts`, `userColumns.ts`, `UserPage.tsx`, `userHandlers.ts`

### gen-datagrid — Built-in Editor meta 확장 계획

- **요약:** `editMaxLength`·`editNormalize` 등 built-in editor column meta 후보 리스트·Gate 4.3 slice를 remaining-work-plan에 등록.
- **파일:** `packages/gen-datagrid/.docs/plan/remaining-work-plan.md`, `gen-datagrid-crud/.docs/plan/remaining-work-plan.md`, `implementation-log.md`

### apps/demo UserPage — empNo 10자 입력 제한

- **요약:** `empNo` 컬럼 `maxLength` editor 적용. commit 시 `slice(0, 10)` 정규화.
- **파일:** `userColumnEditors.tsx`, `userColumns.ts`, `user.types.ts`, `userMutation.ts`

### gen-datagrid — Editor Input Normalize 계획 (Backlog)

- **요약:** `meta.editNormalize`·format preset·builtin factory 방안을 remaining-work-plan에 등록. demo loginId custom editor 배경.
- **파일:** `packages/gen-datagrid/.docs/plan/remaining-work-plan.md`, `gen-datagrid-crud/.docs/plan/remaining-work-plan.md`, `implementation-log.md`

### apps/demo UserPage — loginId 소문자 입력 제한

- **요약:** `loginId` 컬럼 custom editor로 입력 시 `toLowerCase()` 적용. commit/validate에서도 소문자 정규화.
- **파일:** `apps/demo/src/pages/admin/user/userColumnEditors.tsx`, `userColumns.ts`, `userMutation.ts`

### gen-datagrid-crud — Add Row 삽입 위치 계획 정리

- **요약:** `createdRowPosition` top/bottom 기구현·prepend 보완·테스트·arbitrary insert 보류 범위를 `remaining-work-plan.md`에 문서화.
- **파일:** `packages/gen-datagrid-crud/.docs/plan/remaining-work-plan.md`, `implementation-log.md`

### gen-datagrid-crud — Remaining Work Plan 신설

- **요약:** `packages/gen-datagrid-crud/.docs/plan/remaining-work-plan.md` 생성. Add Row 후 첫 editable 컬럼 focus/edit 백로그 등록.
- **파일:** `packages/gen-datagrid-crud/.docs/plan/remaining-work-plan.md`, `.docs/README.md`, `implementation-log.md`

### gen-datagrid — Row Status Context API 계획 (Backlog)

- **요약:** 페이지·컬럼에서 `rowStatus` 조회 API 추가 계획을 `remaining-work-plan.md`에 등록 (demo userColumns 배경).
- **파일:** `packages/gen-datagrid/.docs/plan/remaining-work-plan.md`, `packages/gen-datagrid/.docs/log/implementation-log.md`

### apps/demo UserPage — userId 신규 행만 셀 표시

- **요약:** `userColumns` userId `cell` — `NEW_ROW_ID_PREFIX` 행만 값 표시, 기존 행은 빈 셀
- **파일:** `apps/demo/src/pages/admin/user/userColumns.ts`

### apps/demo UserPage — userId 신규 행 편집 불가

- **요약:** `userColumns` userId 컬럼 `meta.editable`을 함수로 전환 — `NEW_ROW_ID_PREFIX` 행은 편집 차단
- **파일:** `apps/demo/src/pages/admin/user/userColumns.ts`

### apps/demo UserPage — USE_YN 공통코드 FilterBar 연동

- **요약:** `GET /api/common/code?clss-cd=USE_YN` 조회 → FilterBar select. `shared/api/commonCodeApi|Query`, `lkupClssCd` 추가. user 목록 `useYn` 필터 반영.
- **파일:** `shared/api/commonCodeApi.ts`, `commonCodeQuery.ts`, `shared/domain/lkupClssCd.ts`, `pages/admin/user/UserPage.tsx`, `user.types.ts`, `userApi.ts`, `mocks/handlers/{commonHandlers,userHandlers}.ts`, `mocks/data/common.ts`, i18n
- **검증:** `pnpm -C apps/demo build`

### 워크스페이스 에디터 탭 크기 2칸 고정

- **요약:** `.vscode/settings.json` 추가 — `editor.tabSize: 2`, `detectIndentation: false` (.editorconfig와 정합)
- **파일:** `.vscode/settings.json`

### apps/demo — React Fast Refresh 복구 (MDI 탭 dev 유지)

- **요약:** `@vitejs/plugin-react@4.7` 추가 (Vite 6.4 호환; 6.x는 `vite/internal` 오류). esbuild-only dev full reload → MDI 탭 초기화 완화.
- **파일:** `apps/demo/vite.config.ts`, `apps/demo/package.json`, 루트 `package.json` (demo 전용 override)
- **검증:** `pnpm install`, `pnpm -C apps/demo build`

### @gen-office/mdi dev HMR 탭 상태 보존 (1번만 유지)

- **요약:** Vite HMR 시 `defaultMDIStore` 인스턴스를 `import.meta.hot.data`에 보관·재사용. 프로덕션 영향 없음.
- **범위:** `packages/mdi/src/store/mdiStore.ts`, `packages/mdi/src/env.d.ts`
- **롤백:** demo sessionStorage 복원(2번)·gen-frame `MdiTabInput.meta`·vite dev alias — 사용자 결정(1번만)

### gen-chart 디자인 토큰 architecture (ChartTokens vs grid)

- **요약:** TS ChartTokens + CSS chrome 정본. gen-datagrid와 원칙 정렬·구현 분리, B convention/theme bridge/demo 연동 후속 checklist(H1~H5).
- **파일:** `packages/gen-chart/.docs/architecture/design-tokens-architecture.md`, `08-DESIGN-TOKENS-GUIDE.md` chart 절

### apps/demo 앱 스타일 template 네이밍

- **요약:** reference app fork용 `demo-ui.css` → `app-shell.css`, `--app-*`, `datagrid-overrides.css`, `app-styles-naming.md`.
- **파일:** `apps/demo/src/styles/*`, `apps/demo/.docs/guide/app-styles-naming.md`

### gen-datagrid-crud 디자인 토큰 구현 (WS1.3)

- **요약:** `styles/tokens.css` 신설, `index.css` theme 직참조 제거·보더 정리. CRUD 토큰은 `--gen-datagrid-*` Shell만 파생. dist 검증·vitest 17 passed.
- **범위:** `packages/gen-datagrid-crud/src/{styles/tokens.css, index.css}`, crud docs 갱신.
- **파일:** 위 + `.docs/10-THEME-TOKEN-MIGRATION-PLAN.md` §6.6 체크리스트

### gen-datagrid-crud 디자인 토큰·theme 정렬 계획 문서

- **요약:** CRUD가 theme `--color-*`를 직접 쓰는 문제를 architecture/plan으로 정리. `--gen-datagrid-crud-*` 신설(값은 `--gen-datagrid-*` 파생), `styles/tokens.css`, action bar↔grid 보더 1줄 정책. `.docs/10` §6.6 WS1.3 등록.
- **범위:** 문서만(코드 무변경).
- **파일:** `packages/gen-datagrid-crud/.docs/{architecture/design-tokens-architecture.md, plan/design-tokens-restructure-plan.md, README.md}`, `.docs/10-THEME-TOKEN-MIGRATION-PLAN.md`

### Gate 8.8 Row Hover Highlight 구현

- **요약:** `enableRowHoverHighlight` 기본 **true**(AG Grid와 동일). 끄려면 `false`. `--gen-datagrid-row-hover-bg` + 루트 data-attr + CSS `:hover`. current/selection/deleted에 양보.
- **검증:** vitest row hover 테스트, datagrid/crud build.
- **파일:** `packages/gen-datagrid/src/{GenDataGrid.types.ts, renderers/div-grid/DataGridRoot.tsx, styles/tokens.css, index.css}`, `test/interaction.test.tsx`, architecture/reference/plan 문서

### Gate 8.8 Row Hover Highlight architecture 등록

- **요약:** AG Grid Row Hover Highlight 대응 설계를 Gate **8.8**(8.7 동급 피어, 8.7-a 하위 아님)로 문서화. API `enableRowHoverHighlight`, 토큰 `--gen-datagrid-row-hover-bg`, current row와 구분·cascade. 구현은 planned.
- **파일:** `packages/gen-datagrid/.docs/architecture/gate-8-8-row-hover-highlight-architecture.md`(신규), `packages/gen-datagrid/.docs/README.md`, `packages/gen-datagrid/.docs/plan/remaining-work-plan.md`

### gen-datagrid Shell/Body 토큰 루트·셀 연결

- **요약:** 미연결이던 Shell(`bg`/`border`/`text`)·Body(`body-cell-bg`)를 `.gen-datagrid` 외곽선·배경·글자색과 `.gen-datagrid__cell` 기본 배경에 연결.
- **검증:** datagrid/crud build 성공.
- **파일:** `packages/gen-datagrid/src/{index.css, styles/tokens.css}`, architecture 문서

### gen-datagrid 토큰 하이브리드 재구조화 구현

- **요약:** `src/tokens.css`를 `src/styles/tokens.css`로 이동하고 Shell→Regions→System→Chrome→Features 계층으로 재작성. theme semantic은 Shell만 브리지. `index.css`에서 legacy `--gen-datagrid-color-*` 전량 제거·영역 토큰 치환. system 컬럼은 header/body/footer 토큰 분리.
- **검증:** `pnpm -C packages/gen-datagrid build`, `pnpm -C packages/gen-datagrid-crud build` 성공. crud dist 인라인 확인(legacy 없음).
- **파일:** `packages/gen-datagrid/src/styles/tokens.css`, `packages/gen-datagrid/src/index.css`, `packages/gen-datagrid/src/tokens.css`(삭제), `.docs/08-DESIGN-TOKENS-GUIDE.md`, `packages/gen-datagrid/.docs/{architecture,plan,log}/*`, `.docs/10-THEME-TOKEN-MIGRATION-PLAN.md`

### gen-datagrid 토큰 문서 architecture / plan 분리

- **요약:** `design-tokens-architecture.md`에 섞여 있던 마이그레이션·실행 단계·오픈 이슈·검증을 `plan/design-tokens-restructure-plan.md`로 분리. 패키지 `.docs` 관례(architecture=구조, plan=실행)에 맞춤. 실행 순서 표기는 로드맵 Phase와 구분해 **단계 0~4**로 통일.
- **파일:** `packages/gen-datagrid/.docs/{architecture/design-tokens-architecture.md, plan/design-tokens-restructure-plan.md(신규)}`, `packages/gen-datagrid/.docs/README.md`, `.docs/10-THEME-TOKEN-MIGRATION-PLAN.md`

### gen-datagrid 디자인 토큰 하이브리드 구조·재구조화 계획 문서 작성

- **요약:** 초기 팔레트형 토큰의 한계를 정리하고 Shell→Regions→System→Chrome→Features 하이브리드 계층을 확정. theme semantic은 Shell 브리지만(D4 정제).
- **범위:** 문서만(코드 무변경). 실행은 plan 문서 단계 순서로 후속.
- **파일:** `packages/gen-datagrid/.docs/architecture/design-tokens-architecture.md`, `packages/gen-datagrid/.docs/plan/design-tokens-restructure-plan.md`, `.docs/10-THEME-TOKEN-MIGRATION-PLAN.md` §6.5, `.docs/logs/decisions.md`

## 2026-07-08

### gen-datagrid 기본 폰트 토큰 추가 (--gen-datagrid-font-size: 14px)

- **요약:** 그리드 기본 글꼴 크기 토큰 `--gen-datagrid-font-size`(기본 `14px`)를 `tokens.css`에 신설하고 `.gen-datagrid` 루트에 적용. 셀·헤더·에디터가 상속하며, `:root`/`[data-gen-datagrid-root]`/래퍼에서 재정의해 페이지·셀 단위 override 가능. `row-number`(12px 명시) 등은 영향 없음.
- **검증:** `pnpm -C packages/gen-datagrid build`, `pnpm -C packages/gen-datagrid-crud build` 성공. crud dist에 토큰 정의·적용 인라인 확인.
- **파일:** `packages/gen-datagrid/src/{tokens.css, index.css}`

### gen-datagrid 디자인 토큰 내부화 + theme grid.css 이관 (WS1)

- **요약:** theme의 `components/grid.css`(`--grid-*`, V2 런타임 소비처 없음)를 삭제하고, `gen-datagrid`가 자체 `--gen-datagrid-*` 토큰을 소유하도록 이전. `packages/gen-datagrid/src/tokens.css` 신설(theme semantic `--color-*` 참조 + 폴백 hex), `index.css`의 하드코딩 색상 전량을 토큰으로 치환. theme CSS는 self-import하지 않는 B 방식(로드는 앱 책임). 다크모드는 semantic 전환으로 자동 상속.
- **theme 정리:** `variables.css` import 제거, `theme-dark.css` grid 블록 제거, `Theme.stories.tsx` grid 스와치 제거, `cssTokens.test.ts` grid 항목 제거(+dark 단언 `--color-background`로 교정), 문서 3곳(08-가이드, theme architecture/token-mapping) 갱신.
- **검증:** `pnpm -C packages/theme test` 11/11, `pnpm -C packages/gen-datagrid build` 성공(토큰 dist 인라인 확인), lint 0.
- **범위 밖(후속 WS2):** ui/mdi/gen-chart/gen-frame의 A→B(self-`@import` 제거) 전환은 별도 작업으로 분리(.docs/10 §7).
- **파일:** `packages/gen-datagrid/src/{tokens.css(신규), index.css}`, `packages/theme/src/styles/{variables.css, tokens/theme-dark.css, tokens/components/grid.css(삭제)}`, `packages/theme/src/stories/Theme.stories.tsx`, `packages/theme/test/cssTokens.test.ts`, `packages/theme/.docs/{architecture.md, ref/token-mapping.md}`, `.docs/08-DESIGN-TOKENS-GUIDE.md`, `packages/gen-datagrid/.docs/log/implementation-log.md`

### theme 토큰 마이그레이션 계획 문서 신설

- **요약:** 패키지 전용 토큰의 패키지 내부 소유 방침과 CSS 로드 컨벤션(B) 전환을 위한 진행 계획을 별도 문서로 정리. theme `components/grid.css`는 V2 런타임 소비처가 없음을 확인(gen-grid 부재)하고 완전 삭제 + gen-datagrid 자체 `--gen-datagrid-*` 토큰 신규 정의 방향으로 계획 수립. gen-datagrid는 처음부터 B 방식(앱이 theme 로드, 패키지는 semantic 참조 + 폴백, self-`@import` 없음)으로 생성. 기존 ui/mdi/gen-chart/gen-frame의 A→B 전환은 별도 워크스트림(WS2)으로 분리.
- **범위:** 문서만 작성(코드 무변경). 구현 착수 전 단계.
- **파일:** `.docs/10-THEME-TOKEN-MIGRATION-PLAN.md`(신규), `.docs/logs/decisions.md`

### gen-datagrid-crud — 셀 편집값 in-place 표시 (dirty overlay)

- **요약:** 셀 편집 시 dirty 마커만 뜨고 값이 원복되던 문제 해결. GenDataGrid는 헤드리스 계약(cell-edit-api.md §7)상 편집 시 `data`를 안 바꾸고 dirty state에만 기록하며, 표시 반영은 "부모" 책임인데 CRUD 래퍼가 이를 이행하지 않았음. `useDataGridCrudController`가 보유 중인 `dirtyState.cells`로 표시 데이터(`displayData = gridData + overlay`)를 파생해 그리드에 전달하도록 수정(그리드 코어 무변경).
- **계약 유지:** 커밋은 patch 기반이라 그대로 동작, `handle.getData()`와 표시가 일관, `dataVersion`/`acceptChanges` 시 overlay 자동 해제.
- **검증:** `pnpm -C packages/gen-datagrid-crud build`(d.ts 포함) 통과, `apps/demo` `tsc --noEmit` 통과, lint 0
- **파일:** `packages/gen-datagrid-crud/src/crud/useDataGridCrudController.tsx`, `packages/gen-datagrid-crud/.docs/implementation-log.md`

### apps/demo — buildCommitPayload 단순화 (changeSet row 직접 사용)

- **요약:** Gate 13으로 실제 타입에 `changeSet.updated[i].row`/`deleted[i].row?`가 노출되어, `buildCommitPayload`가 `args.data`에서 원본+patch를 재구성하던 로직을 제거하고 항목의 `row`를 직접 매핑하도록 단순화. `getRowId` 인자 제거. `deleted.row`는 undefined일 수 있어 있는 경우만 전송.
- **파일:** `apps/demo/src/shared/api/commit.ts`, `apps/demo/src/pages/admin/user/userCommit.ts`, `apps/demo/.docs/guide/data-integration.md`
- **검증:** `apps/demo` `tsc --noEmit` 통과, lint 0

### gen-datagrid / gen-datagrid-crud — dist `.d.ts` 방출 정상화 (Gate 13 완료)

- **요약:** 두 grid 패키지가 성공 로그만 남기고 실제 `.d.ts`를 배포하지 않던 문제 해결. 근본 원인은 `tsconfig.json`의 `composite + references` 조합(`vite-plugin-dts@5.0.2`·`tsc` 모두 미방출/`TS6305`). 선언 전용 `tsconfig.build.json` 추가 후 build script를 `vite build && tsc -p tsconfig.build.json`로 전환, 무동작 `vite-plugin-dts` 제거.
- **부수:** d.ts 방출로 드러난 crud 타입 오류 2건 수정(`ButtonVariant` `'brand'`→`'primary'`, `gridRef` nullable RefObject). `apps/demo` 임시 스텁(`src/types/gen-datagrid-crud.d.ts`) 제거.
- **검증:** gen-datagrid dist 44개 / crud dist 5개 `.d.ts` 생성, `changeSet.updated[i].row`·`deleted[i].row?`·`cells` 포함. `apps/demo` `tsc --noEmit` 통과.
- **범위 밖:** `vite-plugin-dts@5.0.2`는 root override로 타 패키지(ui/theme/utils/mdi/gen-chart/gen-frame)도 사용 — package review 트랙 소유이므로 미변경(잠재 동일 증상 기록).
- **파일:** `packages/gen-datagrid/tsconfig.build.json`(신규), `packages/gen-datagrid-crud/tsconfig.build.json`(신규), 두 패키지 `package.json`·`vite.config.ts`, `packages/gen-datagrid-crud/src/components/DataGridCrudActionBar.tsx`, `packages/gen-datagrid-crud/src/GenDataGridCrud.types.ts`, `apps/demo/src/types/gen-datagrid-crud.d.ts`(삭제), `packages/gen-datagrid/.docs/{plan/remaining-work-plan.md, log/implementation-log.md}`

### apps/demo — UserPage 커밋 계약 적용 (PK 필수 + NEW_ID sentinel + 전체 행 update)

- **요약:** 데이터 연동 가이드 표준을 UserPage에 반영. `CommitPayload.updated/deleted`를 전체 행 `TRequest[]`로, PK 필수 + 신규는 `NEW_ID` sentinel. 소비 grid 타입의 `changeSet.updated`가 `{rowId,patch}`만 주므로 `buildCommitPayload(args, getRowId, toRequest)`가 `args.data`에서 원본+patch 병합해 전체 행 재구성. MSW는 sentinel 채번 + `{...row,...req}` 병합.
- **파일:** `apps/demo/src/pages/admin/user/{user.types.ts, userCommit.ts, UserPage.tsx}`, `apps/demo/src/shared/api/commit.ts`, `apps/demo/src/mocks/handlers/userHandlers.ts`, `apps/demo/.docs/guide/data-integration.md`
- **검증:** `tsc --noEmit`·`pnpm -C apps/demo build` 통과, lint 0

### apps/demo — CommitPayload 일반화 (공용 타입 + 제네릭 빌더)

- **요약:** CRUD 화면 공용 커밋 계약을 `shared/api/commit.ts`로 일반화(`CommitPayload<TRequest>` + `buildCommitPayload`). `UserCommitPayload`는 `CommitPayload<UserRequest>` 별칭, `userCommit.ts`는 `toUserRequest` 매퍼만 유지. MSW 로컬 타입은 디커플링 위해 유지.
- **파일:** `apps/demo/src/shared/api/commit.ts`(신규), `apps/demo/src/pages/admin/user/{userApi.ts, userCommit.ts}`
- **검증:** `tsc --noEmit`·`pnpm -C apps/demo build` 통과, lint 0

### apps/demo — UserPage V1 패턴 반영 (요청/응답 타입 · 파라미터 필터 · 커밋 매핑 격리)

- **요약:** `admin/user` 레퍼런스에 V1 좋은 패턴 3종 이식(flat·transport/훅 분리·MSW 유지). 요청/응답 타입 분리(`UserRequest`/`DemoUserRow`), `userKeys` 팩토리 + `empName` 파라미터 필터(`StandardFilterBar`), 커밋 매핑 격리(`userCommit.ts`). V1 부채(폴더 과분리·중복 타입·미사용 뮤테이션)는 비채택.
- **파일:** `apps/demo/src/pages/admin/user/{user.types.ts, userApi.ts, userCommit.ts(신규), useUsers.ts, UserPage.tsx}`, `apps/demo/src/mocks/handlers/userHandlers.ts`, `apps/demo/src/i18n/locales/{ko,en}.ts`
- **검증:** `tsc --noEmit`·`pnpm -C apps/demo build` 통과, lint 0

### apps/demo — 데이터 계층 TanStack Query + MSW 도입 (UserPage 레퍼런스)

- **요약:** 실제 업무 흐름(컴포넌트 → react-query 훅 → httpClient → 네트워크)을 데모에 확립. `@tanstack/react-query`(dep)·`msw`(devDep) 추가, `QueryClientProvider` 도입, mock을 MSW로 일원화(auth/app-menu/users 핸들러). UserPage를 useQuery+useMutation 레퍼런스로 전환.
- **정리:** `authApi/appMenuApi` in-code mock 분기 제거, `env` `useMock*`→`isMswEnabled`, `mock/mockAuth.ts` 삭제, 페이지 `userData.ts`→`mocks/data/users.ts`.
- **경계:** react-query/MSW는 apps/demo 한정. MSW는 dev에서만 기동(프로덕션 tree-shake 제외). 결정 로그는 `.docs/logs/decisions.md` 참조.
- **파일:** `apps/demo/src/{main.tsx, app/providers/AppProviders.tsx, shared/api/**, mocks/**, pages/admin/user/**}`, `apps/demo/package.json`, `apps/demo/public/mockServiceWorker.js`
- **검증:** `tsc --noEmit`·`build` 통과, dev(8081) 정상

### apps/demo — admin 페이지 "Management" 제거 리네임

- **요약:** 디렉토리명 축소 목적으로 `admin/user-management`→`admin/user`, `admin/menu-management`→`admin/menu`. 파일명·컴포넌트/식별자·레지스트리 키·라우트 문자열에서 `Management` 일괄 제거(`UserManagementPage`→`UserPage`, `MenuManagementPage`→`MenuPage`, `MenuManagementRow`→`MenuRow`, `*Columns` 축약). 배선 3곳(registry 키/경로, `V2_READY_COMPONENTS`, `mocks/data/menu.ts` execComponent) 동기화.
- **범위 제외:** i18n 키(`userManagement`/`menuManagement`)는 파일/라우트가 아니라 유지.
- **파일:** `apps/demo/src/pages/admin/{user,menu}/**`(각 5, 구 폴더 삭제), `apps/demo/src/app/config/componentRegistry.dynamic.ts`, `apps/demo/src/app/menu/buildAppMenuFromV1.ts`, `apps/demo/src/mocks/data/menu.ts`
- **검증:** `tsc --noEmit` 통과, `pnpm -C apps/demo build` 통과(`UserPage`/`MenuPage` 청크 분리 확인)

### apps/demo — componentRegistry 하이브리드 구조 개선(plan §11)

- **요약:** 페이지 수 증가 대비 V1식 가독성 + V2 타입 안전성 결합. 페이지 8종 default export 추가(named 유지), `componentRegistry.dynamic.ts`를 `page(() => import('@/...'))` 한 줄 로더 + 도메인 그룹 + `satisfies`로 재작성. `ComponentName`을 registry key(`keyof typeof`)에서 파생해 이중 유지보수 제거, `@/` 별칭(tsconfig + vite) 도입.
- **결정:** `V2_READY_COMPONENTS`(메뉴 노출 게이트)는 의미가 별개라 유지, prefetch 헬퍼는 미도입.
- **파일:** `apps/demo/src/app/config/{componentRegistry.dynamic.ts, componentRegistry.ts, componentRegistry.types.ts}`, `apps/demo/{tsconfig.json, vite.config.ts}`, `apps/demo/src/pages/**`(8)
- **검증:** `tsc --noEmit` 통과, `pnpm -C apps/demo build` 통과(페이지별 lazy chunk 분리 확인)

### apps/demo/.docs — 폴더 재편(architecture/plan/rules/logs) 정합성 정리

- **요약:** demo 문서를 하위 폴더로 재편한 뒤 어긋난 `@file` 헤더·상대 링크를 일괄 정정. 이동 파일 5종 헤더 갱신, 문서 간 형제 링크 및 외부(packages/·repo-root `.docs/`) 링크 depth 보정, README 문서 목록 링크 수정 + `logs/implementation-log.md` 항목 추가. 외부 문서에서 옛 평면 경로로 들어오던 인바운드 링크(`.docs/02·04·06`, `gen-frame/.docs`)도 정정.
- **추가:** `plan/plan.md`에 "componentRegistry 구조 개선(D2 후속)" 항목 신설 — default export 표준화·`keyof typeof` 파생·`@/` 별칭·도메인 그룹핑 하이브리드.
- **폴더명 정정:** 분류 부정합으로 `rules/` → `guide/` 변경, `ui-direction.md` 이동(디자인 가이드 성격에 맞춤). 관련 링크·헤더 일괄 갱신.
- **파일:** `apps/demo/.docs/{README.md, architecture/architecture.md, architecture/multi-app-frame.md, plan/plan.md, guide/ui-direction.md, logs/implementation-log.md}`, `.docs/{02-ARCHITECTURE.md, 04-ROADMAP.md, 06-PACKAGE-REVIEW-PLAN.md}`, `packages/gen-frame/.docs/{README.md, architecture.md}`
- **검증:** repo grep — 옛 평면 경로 대상 잔여 링크 0
- **비고:** `work-log.md`의 과거 로그 본문 내 파일명 언급은 이력 보존 위해 미수정

## 2026-07-07

### apps/demo — V1 mock menu 트리 연동

- **요약:** V1 `mocks/data/menu.ts` flat rows 포팅 → `buildAppMenuFromV1` 트리 변환. 미이식 화면은 `ComingSoonPage`.
- **파일:** `apps/demo/src/mocks/data/**`, `app/menu/buildAppMenuFromV1.ts`, `mockMenu.ts`, `ComingSoonPage.tsx`, registry, i18n, `demoPageIds.ts`
- **검증:** `pnpm -C apps/demo build`

### AGENTS.md · README.md — Core Stack 정본 동기화

- **요약:** React 19, TypeScript 5.9, Storybook 10, Vitest 4 등 루트 `pnpm.overrides` 기준으로 스택 문서 갱신. 미사용 Nx 항목 제거.
- **파일:** `AGENTS.md`, `README.md`

## 2026-07-01

### gen-datagrid, gen-datagrid-crud — V1 동기화 (gridProps·로딩 루프·columnFitMode fill)

- **요약:** V1 `frontend` 커밋 `01cd1dd`, `9230ea2`, `854afb7` 반영 — CRUD state identity 보정, gridProps feature flag 전달, `columnFitMode: 'fill'`
- **파일:** `packages/gen-datagrid/src/**`, `packages/gen-datagrid-crud/src/**`, 패키지 `.docs/`, `apps/demo/src/pages/customer/customer-info/CustomerInfoPage.tsx`
- **검증:** `pnpm -C packages/gen-datagrid test`, `pnpm -C packages/gen-datagrid-crud test`, `pnpm -C apps/demo build`

### ui — PageLayout / PageHeader composed

- **요약:** `composed/pageLayout` 추가, demo 전 페이지 `@gen-office/ui` PageLayout 적용
- **파일:** `packages/ui/src/composed/pageLayout/**`, `apps/demo/src/pages/**`
- **검증:** `pnpm -C packages/ui build`, `pnpm -C apps/demo build`

### apps/demo — CustomerInfoPage 포팅

- **요약:** V1 고객정보 화면을 GenDataGridCrud 편집 회귀 데모로 포팅 (mock data, 필터, text/select/date editor)
- **파일:** `apps/demo/src/pages/customer/customer-info/**`, registry·menu·i18n
- **검증:** `pnpm -C apps/demo build`

### gen-datagrid, gen-datagrid-crud — V1 동기화 (편집 정책·column 타입)

- **요약:** V1 `frontend` 커밋 `413398f`, `35fe691`의 편집 continuation·CRUD 기본 정책·`GenDataGridColumnDef` 타입을 V2에 반영
- **파일:** `packages/gen-datagrid/src/**`, `packages/gen-datagrid-crud/src/**`, `packages/gen-datagrid-crud/test/thinShell.test.tsx`, 패키지 `.docs/`
- **검증:** `pnpm -C packages/gen-datagrid test`, `pnpm -C packages/gen-datagrid-crud test`

## 2026-06-29

### apps/demo — FrameBrand 클릭 홈 탭 이동

- **요약:** `FrameBrand`를 버튼으로 감싸 클릭 시 `DEMO_HOME_PAGE_ID` 탭 활성화
- **파일:** `apps/demo/src/app/AppShell.tsx`, `AppShell.module.css`
- **검증:** `pnpm -C apps/demo build`

### apps/demo — pinnedPages AppShell 주입

- **요약:** `useOpenPage({ pinnedPages })` — Welcome pin 정의를 AppShell로 이동
- **파일:** `AppShell.tsx`, `hooks/useOpenPage.ts`
- **검증:** `pnpm -C apps/demo build`

### gen-frame — MDI pinnedPages API

- **요약:** `useMdiNavigationController({ pinnedPages })` + `syncPinnedMdiTabs`; demo Welcome pin 이전
- **파일:** `packages/gen-frame/src/navigation/**`, `apps/demo/src/app/hooks/useOpenPage.ts`
- **검증:** gen-frame test, `pnpm -C apps/demo build`

### apps/demo — Welcome pin — gen-frame `pinnedPages`로 이전

- **요약:** PlaceholderPage를 `closable: false` 고정 탭으로 shell 시작 시 보장
- **파일:** `apps/demo/src/app/openPage.tsx`, `hooks/useEnsureWelcomePinTab.ts`, `AppShell.tsx`, `url/useDemoMenuDeepLink.ts`
- **검증:** `pnpm -C apps/demo build`

### apps/demo — Multi-App Frame 설계 문서

- **요약:** App Profile·MDI/single·layout 조합, multi-persona URL/파일 배치, Phase M0~M4
- **파일:** `apps/demo/.docs/multi-app-frame.md`, `apps/demo/.docs/README.md`, `architecture.md`
- **상태:** 설계 정본 (코드 미구현)

### apps/demo — MDI 탭 active/inactive 시각 대비

- **요약:** workarea 내 MDI 탭 active·inactive 배경·글자·accent 대비 강화 (`demo-ui.css` 토큰·`role`/`aria-selected` 오버라이드)
- **파일:** `apps/demo/src/styles/demo-ui.css`
- **검증:** `pnpm -C apps/demo build`

### apps/demo — MenuManagement tree CRUD

- **요약:** `MenuManagementPage` — `enableTreeRows`·`getSubRows`·mock 계층 메뉴 CRUD
- **파일:** `apps/demo/src/pages/admin/menu-management/**`, registry, mock menu, i18n
- **검증:** `pnpm -C apps/demo build`

### apps/demo — Gate D4 admin CRUD 1차 연동

- **요약:** `GenDataGridCrud` 의존·CSS·UserManagement(mock CRUD)·Actuals(readonly) 페이지·registry·mock menu
- **파일:** `apps/demo/package.json`, `src/main.tsx`, `src/pages/admin/**`, `src/pages/co/actuals/**`, registry, i18n
- **검증:** `pnpm -C apps/demo build`

## 2026-06-29

### root 문서 — gen-datagrid · gen-datagrid-crud 현재 상태 반영

- **요약:** 패키지 문서·소스 검토 후 V2 workspace 이관·Gate 진행 상황을 root 문서에 동기화
- **변경:** `README.md`, `.docs/01-OVERVIEW.md`, `02-ARCHITECTURE.md`, `03-V1-RELATIONSHIP.md`, `04-ROADMAP.md`, `06-PACKAGE-REVIEW-PLAN.md`, `.docs/README.md`
- **근거:** gen-datagrid Gate 0~9 ✅ (test 198), gen-datagrid-crud Gate 10~11 ✅ (test 9), demo `package.json` grid dep 없음

## 2026-06-29

### packages/gen-datagrid · gen-datagrid-crud — monorepo 설정 정합

- **요약:** 이관 패키지 `package.json`·`tsconfig`·`vite`·`vitest`를 V2 monorepo 표준(React 19, Storybook 10, Vite 6.4, Vitest 4.1)에 맞춤
- **변경:** Storybook 8 잔존 dep 제거 → `apps/storybook` 위임, `private`/`type: module`, 버전 `0.0.0`
- **파일:** `packages/gen-datagrid/*`, `packages/gen-datagrid-crud/*`, `apps/storybook/package.json`

### apps/demo — Welcome 링크 + 주소창 딥링크

- `?menu=` 풀 로드: Welcome + 지정 메뉴; Welcome 버튼으로 Chart/Dashboard (SPA)

### apps/demo — URL deep link = openMenuItem

- `useDemoMenuDeepLink`: `?menu=` → `openMenuItem`, 기존 탭 유지

### packages/gen-frame — FrameBrand

- 기본 로고 `src/assets/default-logo.png`, `FrameBrand` 컴포넌트
- demo `AppShell` → `brand-logo.png` override

### packages/gen-frame F5 — single page host

- `createSingleNavigationController`, `useSingleNavigationController`, `SinglePageHost`
- Storybook `GenFrame/Navigation/Single`, README navigation mode 가이드

### packages/gen-frame F4 — URL sync

- `createQueryTabUrlSyncAdapter`, `useUrlSync` (`?tab=<pageId>`)
- demo `AppShell` 연동, test 28건

### apps/demo F4 — URL tab 복원

- `demoUrlSync.ts`, `useUrlSync` + `resolvePayloadFromPageId`
- URL에 tab 있으면 초기 메뉴 자동 오픈 스킵

### apps/demo F3 — gen-frame AppShell 연동

- AppShell → WorkspaceFrame + MdiPageHost + FrameLayoutToggle
- useOpenPage → useMdiNavigationController, mapAppMenuToFrame

### packages/gen-frame F2 — titleBar + layout showcase

- TitleBarNav, NavRenderer, FrameLayoutToggle, useFrameLayout
- Storybook Matrix/TitleBar, test 18건

### packages/gen-frame F1 — WorkspaceFrame + leftPanel

- `WorkspaceFrame`, `LeftPanelNav`, types, Storybook `GenFrame/Layout/LeftPanel`
- test 6건, build 통과

### packages/gen-frame F0 — 설계·문서 scaffold

- `packages/gen-frame/` 디렉터리, `architecture.md`, `plan.md` (F0~F5)
- 앱 프레임: layout mode, NavigationController, URL sync, MDI/single host
- 저장소: `02-ARCHITECTURE.md`, `decisions.md` 반영

### apps/demo Soft Modern UI

- demo 전용 Soft Modern 시각 규칙: `demo-ui.css`, `DemoSurface`, shell·페이지·카드 통일
- 설계 문서: `apps/demo/.docs/ui-direction.md`

## 2026-06-28

### apps/demo Gate D3 — Chart / Dashboard

- ChartDemoPage, DashboardDemoPage + gen-chart composable API
- gen-chart C8 demo 선행 완료 (grid 연동 제외)

### apps/demo Gate D2 — API · menu · registry · i18n

- shared/api, componentRegistry, MenuSidebar, i18n, PageHeader/AdminPageLayout
- mock env 기본; backend 연동 시 `VITE_USE_MOCK_*=false`

### apps/demo Gate D1 — App shell + MDI

- Mock login, AppShell, MDIContainer, Placeholder tab, Toast on maxTabs
- deps: `@gen-office/mdi`, `@gen-office/ui`

### 소스 규칙 문서 분리 — 09-SOURCE-CONVENTIONS

- 인코딩·파일 헤더·`@remark`/`@history`·변경 기록 분업을 `.docs/09-SOURCE-CONVENTIONS.md`로 이동
- `AGENTS.md`는 요약 + 링크만 유지 (슬림화)

### apps/demo Gate D0 scaffold

- Vite app `@gen-office/demo`, ThemeProvider, placeholder App
- `pnpm -C apps/demo build` 검증

### apps/demo 아키텍처·Plan 문서

- Phase D0~D3: scaffold·shell·chart (grid 불필요)
- Phase D4~D5: admin·Actuals (gen-datagrid 합류 후)
- `apps/demo/.docs/architecture.md`, `plan.md`

## 2026-06-27

### @gen-office/gen-chart Phase 1 마감

- **범위:** Gate C0~C7 (차트 엔진 MVP) — core, render, interaction, motion enter, responsive, dashboard Storybook
- **Phase 2 보류:** C8 (demo·`gen-datagrid-chart`), motion 고급, treemap, crosshair 등
- **착수 조건:** `gen-datagrid` MVP, `apps/demo`, `gen-datagrid-chart` scaffold
- 문서: `packages/gen-chart/.docs/phase.md`, `gates.md`, `05-GEN-CHART.md`, `04-ROADMAP.md`, `06-PACKAGE-REVIEW-PLAN.md`

## 2026-06-27

### @gen-office/gen-chart Gate C7 responsive + dashboard

- `resolveResponsiveSize` 추출, `ResponsiveChartContainer` 단위·통합 테스트
- Storybook `GenChart/Responsive`, `GenChart/Dashboard` (카드 그리드, V1 DashboardDemoPage 수용 기준)
- test 78건, build green

### @gen-office/gen-chart Gate C6b motion

- CSS enter motion (line/bar/area/pie), `useChartMotion`, reduced-motion + GC006 large data
- Storybook `GenChart/Motion`, test 73건

### @gen-office/gen-chart tooltip hit layer 전체 차트

- hit layer `plotArea`만 덮던 문제 → 전체 차트 + legend absolute overlay
- x축 라벨 구간에서 tooltip 사라지던 현상 수정

### @gen-office/gen-chart tooltip 위치 flip/clamp

- `resolveTooltipPosition` — 툴팁 크기 측정 후 차트 경계 내 flip/clamp
- `ChartTooltip` — `useLayoutEffect`로 위치 재계산

### @gen-office/gen-chart Gate C6 interaction

- `ChartTooltip` / `ChartLegend` 구현, `useInteractiveChart`
- `ChartRoot` hook options memo — legend toggle 상태 유지
- Storybook `GenChart/Interaction`, test 60건
- 다음: C6b motion

### @gen-office/gen-chart PolarSeries Storybook docs

- `PolarSeries.stories.tsx` — `component: PolarSeriesDemo`, `tags: ['autodocs']`, docs description, `layout: 'padded'` (CartesianSeries 패턴)

### @gen-office/gen-chart Gate C5 polar render

- `PolarChart` / `usePolarChart` / `PolarPlot` / `PieSeries` / `DonutSeries` — core arc geometry SVG render
- `PolarChartModel.geometries`, `polarLayout` 노출
- Storybook `GenChart/PolarSeries` (pie, donut)
- 다음: C6 tooltip/legend interaction

### @gen-office/gen-chart area baseline x축 정렬

- domain에 0 없을 때 area baseline = yDomain min (x축), 0 포함 시 y=0
- `resolveAreaBaselineY` · geometry test

### @gen-office/gen-chart Gate C4 cartesian series

- `LineSeries` / `BarSeries` / `AreaSeries` — core geometry SVG render
- `CartesianChartModel.geometries` 노출, bar visible 시 y domain 0 baseline
- Storybook `GenChart/CartesianSeries`
- test 48건 · build green
- 다음: C5 polar render

### @gen-office/gen-chart Y축 nice domain

- `applyAxisBounds`: 기본 min/max d3 `.nice()` (5% padding 제거)
- `ChartAxisOptions`: `min`/`max` `'nice'` · `'dataMin'`/`'dataMax'`/숫자 override
- bar zero baseline은 C4
- test 43건

### @gen-office/gen-chart visx axis/grid 좌표 수정

- x·y축 미접합 버그: core 절대 scale + visx `left`/`top` 이중 오프셋
- `createPlotLocalScales` — plot-local range, `Group left/top={plotArea}` 로 axis/grid 정렬
- test 39건 · build green

### @gen-office/gen-chart Gate C3 cartesian primitives

- `CartesianPlot`, `ChartGrid`, `ChartXAxis`, `ChartYAxis` — visx internal renderer
- `CartesianChartModel` scales/xDomain/yDomain 노출, empty state, Storybook `GenChart/CartesianPrimitives`
- `@visx/axis`, `@visx/grid`, `@visx/group` 추가 · storybook `@gen-office/gen-chart` 의존
- test 36건 · build green
- 다음: C4 series render

### @gen-office/gen-chart Gate C2 hook + layout

- `useGenChart`: model + width/height, visibility toggle 시 re-render
- `computePlotArea`: legend reserve (top/bottom), `resolveLegendOptions`, `computeLegendReserveHeight`
- `ChartContext` / `PlotContext`, `ChartRoot` / `CartesianChart` provider wiring
- test 34건 · build green
- 다음: C3 cartesian primitives

### @gen-office/gen-chart Gate C1.5 polar core

- `createPolarModel`: polar layout, pie/donut arc geometry, `getNearestDatum`, visibility toggle
- 모듈: `normalizePolarSeries`, `computePolarLayout`, `pieArcs`, `polarNearest`, `computePolarState`
- `PolarChartModel`에 `visibleSeries`, `plotArea` 추가
- test 23건 · build green
- 다음: C2 `useGenChart`

### @gen-office/gen-chart Gate C1 cartesian core

- `createCartesianModel`: domain, geometry, `getNearestDatum`, visibility toggle → yDomain 재계산
- d3-scale 기반 `createCartesianScales`, line/bar(area) geometry, `cartesianNearest`
- test 16건 · build green
- 다음: C2 `useGenChart`

### @gen-office/gen-chart Gate C0 scaffold

- types, themes (`resolveChartTokens`), core warnings, stub `ChartRoot`/`ResponsiveChartContainer`/series primitives
- `pnpm -C packages/gen-chart build` · test 6건 통과
- 다음: C1 `createCartesianModel`

### 아이디어 문서 — composable Page Frame

- `.docs/idea/` 신규 — README, `page-frame-composable.md` (StandardPageFrame 스케치, V1 대응, MDI·gen-chart 관계, 미채택)
- `.docs/README.md` — idea 섹션 링크

### @gen-office/gen-chart V2 아키텍처·Gate 문서화

- 재사용 차트 엔진 방향: headless core (`d3-scale`) + composable React + visx internal only
- `packages/gen-chart/.docs/` — architecture.md, gates.md (C0~C8, C1.5, C6b), README, implementation-log
- `.docs/05-GEN-CHART.md` 개정 — ChartRoot API, plot 분리, motion C6b, GC006, 오픈 이슈 합의
- `.docs/02-ARCHITECTURE.md`, `06-PACKAGE-REVIEW-PLAN.md` gen-chart 섹션 갱신
- 다음: Phase 0 scaffold (C0)

### @gen-office/mdi 패키지 리뷰 1차 마감

- P0~P2·Storybook Gate·Docs store 격리 완료; test 41·build green
- review-log·review-plan·README·06-PACKAGE-REVIEW-PLAN §4 mdi 갱신
- 후속: gen-chart 또는 apps/demo MDI shell 연동; P3·Deferred는 보류

### @gen-office/mdi architecture.md — store 격리 구조 반영

- `MDIStoreProvider` / `createMDIStore` / Context·singleton 이중 모델, §4·§8·§9 갱신

### @gen-office/mdi Storybook Docs store 격리

- `MDIStoreProvider` + `createMDIStore` — Docs 동시 렌더 시 story별 탭 상태 분리
- `packages/mdi/.docs/review-log.md` 기록; 테스트 41건 통과

### @gen-office/mdi TabBar activeTab scroll 단일 동기화

- syncTabBarScrollToActiveTab + 활성 Tab ref; 가시성(rect)/좌표(offsetLeft) 분리

### @gen-office/mdi TabBar 가로 스크롤 연동 (2차)

- rAF 재시도 + scrollIntoView/수동 scrollLeft + ResizeObserver; Tab flex-shrink:0; ManyTabsScroll story

### @gen-office/mdi TabBar 가로 스크롤 연동

- 신규/활성 탭이 `.tabListWrap` 밖에 있을 때 scroll-into-view; `tabScroll.ts` + TabBar `useLayoutEffect`
- 테스트 29건 통과

## 2026-06-27

### @gen-office/mdi Storybook Gate

- MDIContainer stories 6종; storybook build green; apps/storybook mdi·ui deps

### @gen-office/mdi P2 V2 컨벤션·a11y·i18n

- clsx 전환, types 분리, TabBar 키보드·포커스·tabBarLabels; 테스트 25건

### @gen-office/mdi P1 테스트·소비자 setup

- `src/index.css` theme side-effect; store 테스트 14건 + MDIContainer smoke 6건 (총 18)
- 동일 id `addTab` focus-only 정책 문서화; setup 전역 `reset`

### @gen-office/mdi P0 public API·동작 정합

- `onMaxTabsReached`: `setOnMaxTabsReached` + MDIContainer 연동, `addTab` limit 시 호출
- TabPanel: `visibility:hidden` → `display:none`; TS6133 제거
- maxTabs **정책 A** (하향 시 기존 탭 유지); `reset()` store API
- `test/store/mdiStore.test.ts` 4건; build/test green

### @gen-office/mdi 패키지 스캐폴딩·V2 설정 정합

- V1 소스 이식 후 `package.json` devDependency·peerDependency를 `ui`/`theme`와 동일 버전으로 맞춤 (`react` 19.2.7, `vite` 6.4.3, `vitest` 4.1.9, Storybook 10.4.6 등)
- 미사용 `clsx` 의존 제거; `jsdom`·`clean` 스크립트 추가
- `vite.config.ts` lib name·external을 mdi 의존성(`@gen-office/ui`, `zustand` 등)에 맞게 수정
- `vitest.config.ts`·`test/setup.ts` 추가 (`passWithNoTests`)
- 루트 `package.json` `pnpm.overrides`에 `vitest`, `jsdom`, `vite-plugin-dts`, testing-library 버전 고정 추가
- `packages/mdi/.docs/review-log.md` 작성 (스캐폴딩·미결 항목·검증 기록)
- `packages/mdi/.docs/architecture.md` 작성 (디렉터리·컴포넌트·store·데이터 흐름 다이어그램)
- `packages/mdi/.docs/review-plan.md` 작성 (P0~P3 우선순위·Gate·Storybook·demo 선행 조건)
- 검증: `pnpm install`, `pnpm -C packages/mdi build`, `pnpm -C packages/mdi test`, `pnpm build`

## 2026-06-25

### @gen-office/ui V1 이관 마감

- C1~C9 composed Gate 완료; orphan `popupInput/` 제거; `review-log.md` 작성
- 다음 트랙: `mdi`, `@gen-office/html-editor`

### @gen-office/ui C9 TreeView Storybook 수동 Gate

- C9 Gate 마감 (TreeView + SplitLayout 조합 story 포함)

### @gen-office/ui C9 TreeView Gate

- TreeView V2 정리, stories, test 5건, gate 문서 (`tree-view.md`)

### @gen-office/ui composed 구조 정리 (`panels/` 롤백)

- SplitLayout `composed/` 복귀; TreeView `composed/treeView`, RichTextEditor `@gen-office/html-editor` 방향 문서화

### @gen-office/ui `panels/` 디렉터리 분리

- SplitLayout `composed/` → `panels/`; 문서 `.docs/panels/`; Story `UI/Panels/*`

### @gen-office/ui C8 ModalInput Storybook 수동 Gate

- C8 Gate 마감 (ModalInput + scroll layout + multi tooltip 포함)

### @gen-office/ui C8 ModalInput Gate

- ModalInput V2 Gate: 헤더·named export, stories, test 7건, gate 문서 (`modal-input.md`)
- C8 계획 ModalInput 단독으로 변경 (PopupInput 제외)

### @gen-office/ui C7 TreeCombobox Storybook 수동 Gate

- C7 Gate 마감 (TreeCombobox + FilterBar tree-combo, selectLeafOnly 포함)

### @gen-office/ui C7 TreeCombobox Gate

- TreeCombobox 정리, FilterBar tree-combo, test 5건 + stories

### @gen-office/ui C6 Combobox Storybook 수동 Gate

- C6 Gate 마감 (Combobox + FilterBar combo 연동 포함)

### @gen-office/ui MultiCombobox selected tooltip

- `selectedTooltip='auto'`, `formatSelectedTooltip`, test 3건 추가

### @gen-office/ui C6 Combobox Gate

- Combobox/MultiCombobox 정리, FilterBar combo 연동, test 5건 + stories

### @gen-office/ui FilterBar date · month 필드

- StandardFilterBar + DatePicker/MonthPicker, Story `WithDateAndMonth`

### @gen-office/ui C5b DatePicker Storybook 수동 Gate

- C5b Gate 완료 (C5a+C5b DatePicker 트랙 마무리)

### @gen-office/ui C5b DatePicker MaskedInput 연동

- 4컴포넌트 리팩터, composed test 6건, Storybook stories

### @gen-office/ui C5a MaskedInput Storybook 수동 Gate

- focus · dark · a11y 확인 완료

### @gen-office/utils C5a mask 엔진

- `format/mask.ts`, `maskPresets/date.ts`, unit test 6건

### @gen-office/ui C5a MaskedInput 구현

- `core/maskedInput/*`, `@gen-office/utils` mask 연동, RTL test 6건

### @gen-office/ui C5 — MaskedInput 선행 · DatePicker 플랜

- C5a MaskedInput + C5b DatePicker; `masked-input.md`, `date-picker.md`, `migration-plan.md`, `decisions.md`

### @gen-office/ui FilterBar C4 마무리

- CSS `filterItemLabel`, StandardFilterBar collapse·enterToSearch·clearLabel tests

### @gen-office/ui FilterField `label` · 옵션 연결

- `title` → `label`; `clearable`/`clearLabel` text·search 연결; 미사용 타입 필드 제거
- 변경: `filterBar/*`, `filter-bar.md`, tests

### @gen-office/ui FilterBar Storybook · 문서 정리

- `BorderlessCollapsible*` 스토리 이름·미사용 헬퍼 제거; `filter-bar.md`, `implementation-log.md` 동기화
- 변경: `packages/ui/src/composed/filterBar/FilterBar.stories.tsx`, `packages/ui/.docs/composed/filter-bar.md`

### @gen-office/ui FilterBar collapse chevron toggle

- `collapseToggle` border | actions-icon; borderless bottom-edge only (no divider line)

### @gen-office/ui FilterBar simple/detail collapse

- `collapsible`, `collapsedCount`, `simple` field, `expandLabel`/`collapseLabel`; actions column 토글 버튼

### @gen-office/ui FilterBar actions column 배치

- `actionsPlacement` `footer` → `column` — fields 오른쪽 세로 stack; `ColumnActions` story

### @gen-office/ui FilterBar 레이아웃 표준 (2-zone · size preset)

- fields grid + footer actions; `FilterBarFieldSize`, theme `--filter-field-width-*`
- `packages/theme/.../filter-bar.css`, `resolveFilterItemSize.ts`, stories/tests/docs

### @gen-office/ui FilterBar Item 가로 배치 옵션

- `FilterBarItemLayout` (`vertical` | `horizontal`) — `FilterBar.itemLayout`, `FilterBar.Item.layout`
- `StandardFilterBar.itemLayout`, `FilterField.layout` 동일 전달
- stories HorizontalItemLayout, tests 2건, `filter-bar.md` API 문서
- Default·Horizontal 스토리 필드 6개, decorator maxWidth 960px

### @gen-office/ui FilterBar · StandardFilterBar Gate (Wave 5 — C4)

- `composed/filterBar` — FilterBar compound, StandardFilterBar, SearchInput 내부 전용
- combo/multi-combo → C6 Combobox 연동 전 placeholder
- stories `UI/Composed/{FilterBar,StandardFilterBar}`, tests, `filter-bar.md`

### @gen-office/ui Filter composed 명명 — FilterBar · StandardFilterBar

- V1 SimpleFilterBar → StandardFilterBar; SearchInput 내부 전용
- `migration-plan.md` C4, `decisions.md`, grouped-select·deferred 참조 갱신

### @gen-office/ui `MasterDetailLayout` 문서 제외

- V2 미이관 결정 — `migration-plan.md` C4 제거, C5~C11 → C4~C10 재번호
- `split-layout.md` MasterDetailLayout 언급 삭제; `decisions.md` 기록

### @gen-office/ui SplitLayout Gate (Wave 5 — C3)

- V1 `composed/SplitLayout` 이식 — flex 2-pane, pointer resize, CSS vars
- stories `UI/Composed/SplitLayout`, `test/composed/SplitLayout.test.tsx`, `.docs/composed/split-layout.md`
- 파일 헤더 `@remark` (export, layout height 계약, Storybook title)

### @gen-office/ui AlertDialog · ConfirmDialog Gate (Wave 5 — C1/C2)

- V1 `composed/AlertDialog` · `ConfirmDialog` 이식 — `Dialog` compound + `Button`, variant 아이콘
- Gate — 파일 헤더, `clsx`, close `aria-label`·`:focus-visible`, `처리중...` 로딩 문구
- stories `UI/Composed/{AlertDialog,ConfirmDialog}`, tests, `.docs/composed/{alert-dialog,confirm-dialog}.md`
- `comfirmDialog` 오타 폴더 없음 확인 (이미 정리됨)

### @gen-office/ui Toast Storybook · `ToastViewport portalled`

- preview frame 클리핑 — story frame / `fullscreen` / `portalled`(`document.body`) 정리
- `RadixSlide` story — Radix docs slide-in, iframe body 우하단

### @gen-office/ui Tooltip · Toast · Progress (Wave 5-ext)

- `@radix-ui/react-tooltip`, `react-toast`, `react-progress` core 추가
- stories, tests, `.docs/core/{tooltip,toast,progress}.md`, `migration-plan.md` Wave 5-ext

### @gen-office/ui Breadcrumb · Tabs · Tree Gate (Wave 4)

- Breadcrumb — `clsx`, `:focus-visible`, stories/test/docs (`UI/Core4-navigation/Breadcrumb`)
- Tabs — `cn`→`clsx`, semantic fg 토큰, stories title 정리, test/docs
- Tree — stories, test, a11y `role="tree"`, focus ring, docs

### @gen-office/ui Calendar — @daypicker/react v10

- `react-day-picker` → **`@daypicker/react` ^10.0.1** — v10 `classNames` 키·`.rdp-root` CSS 변수
- `date-fns ^4.1.0` — DayPicker transitive 4.4.0과 호환 확인
- `Calendar.stories.tsx`, `test/core/Calendar.test.tsx`, `.docs/core/calendar.md`

## 2026-06-24

### @gen-office/ui Popover · DropdownMenu · Select Gate

- Wave 3-13~15 — stories, tests, docs, `src/index.ts` export, `StandardSelect` rename

### @gen-office/ui Drawer Gate (Wave 3-12) — 완료

- V1 custom Drawer → `core/drawer` — stories, test, docs, export
- Portal·focus trap 없음 (V1 parity)

### @gen-office/ui SimpleRadioGroup → StandardRadioGroup

- `StandardRadioGroup.tsx`, types, stories, test — `RadioGroup` primitive 유지
- `.docs/core/radio.md`, `migration-plan.md`, `decisions.md`

### @gen-office/ui Dialog Gate · StandardDialog rename

- `SimpleDialog` → **`StandardDialog`** (`StandardDialog.tsx`, types, stories)
- `Dialog` compound primitive 유지 — 헤더·types·`:focus-visible` 토큰
- `Dialog.test.tsx`, `StandardDialog.test.tsx`, `.docs/core/dialog.md`

### @gen-office/ui Dialog rename 롤백

- `BaseDialog*` 소스 변경 원복 → `Dialog` + `SimpleDialog` (이관 당시 구조)
- `decisions.md` — Dialog/BaseDialog 명칭은 **검토안(미적용)** 으로 정리

### @gen-office/ui deferred 목록

- `packages/ui/.docs/deferred.md` — Wave 1–5 이관 후 enhancement (D-001 Slider value bubble)

### @gen-office/ui Button core 문서

- `packages/ui/.docs/core/button.md` — API·variant·asChild·loading·Gate
- `packages/ui/.docs/README.md` 링크 추가

## 2026-06-23

### @gen-office/ui Input·Textarea core 이식 정리

- export·스토리·테스트·문서; Label 스토리 Input 연동

### @gen-office/ui Wave 0 Vitest 스캐폴드

- `pnpm -C packages/ui test` 스크립트·RTL devDeps·Button smoke test

### @gen-office/ui Badge core 이식 정리

- barrel export·토큰·문서 (`packages/ui/.docs/core/badge.md`)

### @gen-office/ui Separator core 이식 정리

- 헤더·스토리 taxonomy·`packages/ui/.docs/core/separator.md`

### @gen-office/ui Label core 이식 정리

- ref 타입·스토리 의존성 수정, `packages/ui/.docs/core/label.md` 추가

### Storybook 사이드바 — Theme 맨 아래 정렬

- `storySort.order: ['UI', '*', 'Theme']`; Theme stories `title: 'Theme/Theme'` (단일 레벨 root는 sort 미적용)

### 디자이너·퍼블리셔용 디자인 토큰 가이드

- `.docs/08-DESIGN-TOKENS-GUIDE.md` — 색상 추가·변경 절차, 역할별 온보딩, 체크리스트
- `.docs/README.md`, `packages/theme/.docs/README.md` 링크 추가

### Button `brand` variant·토큰 전면 제거

- theme: `--button-brand-*` 삭제 (`button.css`)
- ui: `ButtonVariant`에서 `brand` 제거, `.brand` CSS·스토리 삭제
- `cssTokens.test.ts`: `--button-brand` 부재 assert 추가

### @gen-office/theme primary near-black (#171717)

- 마젠타 primary 폐기 → near-black CTA; danger Bootstrap red와 시각 분리
- `base.css`, `theme-dark.css`, `button.css`, 테스트·문서 갱신

### @gen-office/ui 이관 Plan·아키텍처 문서

- `packages/ui/.docs/architecture.md` — Radix 래퍼, clsx, Vitest + Storybook Gate
- `packages/ui/.docs/migration-plan.md` — Wave 0~5, core 우선 이관 순서
- 다음 구현: Wave 0 스캐폴드 → Button 첫 Gate

### @gen-office/ui package.json React 19·V2 스택 정렬

- V1(React 18 / Storybook 8) → V2 monorepo 기준: React 19.2.7, Storybook 10.4.6, Vite 6.4.3
- SB8 전용 패키지 제거(`addon-essentials`, `blocks`, `core` 등), `addon-docs` 추가
- `peerDependencies`: `react`/`react-dom` `^19.0.0` (`theme`와 동일)

### @gen-office/utils 패키지 검토 마무리

- review-log 종료 표시, 다음 순서 `ui`
- 최종: 57 tests, V2 date/normalize API, V1 compat 분리, `cn`/clsx 정책 확정

### @gen-office/utils `cn` / `clsx` 정책

- `cn` V1 호환 유지, V2 신규 패키지는 `clsx` 직접 사용 — decisions.md·utils README 반영

### @gen-office/utils 패키지 검토 완료

- devDeps 정리, review-log, README, Y/N helper, normalize.v1, 테스트·migration 문서
- `packages/utils/.docs/review-log.md` — Gate 완료

### @gen-office/utils format/date V1 alias 분리

- `format/date.v1.ts` — V1 deprecated alias, `date.ts`는 V2 API 전용

### AGENTS.md `@remark` 파일 헤더 규칙

- 소스 파일 헤더에 `@remark` 섹션 추가 가능 (함수 목록·deprecation·제약 등)
- `packages/utils/src/**` 11개 파일에 즉시 적용

### @gen-office/utils format/date API 통합

- `parseDateString` / `formatDateString` — `yyyymmdd`, `yyyymm`, `ymd`+구분자
- `formatDateDisplay` — ko-KR UI 표시, V1 이름은 deprecated alias
- 변경: `packages/utils/src/format/date.ts`, 테스트·`.docs/README.md`

### utils 패키지 가이드 문서

- `packages/utils/.docs/README.md` — API·우선 사용 원칙 (루트 README 대신 패키지 가이드)
- 루트 `README.md` utils 섹션 변경 취소

### @gen-office/utils V1 이식 점검

- 파일 헤더 추가, vite/vitest 설정 수정, `parseApiDate` 버그 수정
- `normalizeUseYnWithDefault` — `normalizeUseYn` 호출로 수정
- `packages/utils/.docs/implementation-log.md` 생성

### @gen-office/theme 색상 토큰 정책 반영

- 1층 CSS 팔레트 hex 통일, primary `#C6004D`, Bootstrap status, brand 제거
- `lightTheme`/`darkTheme`/`ChartTokens` JS export 제거, `Theme.colors.primary`로 정리
- `ThemeProvider` CSS 변수 매핑 수정, grid `color-mix`가 `--color-primary` 참조
- 결정 로그: `.docs/logs/decisions.md`
- 변경 파일: `packages/theme/src/styles/tokens/*`, `provider/ThemeProvider.tsx`, `types/theme.types.ts`, 테스트·스토리·문서

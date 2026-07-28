<!-- packages/gen-datagrid-crud/.docs/implementation-log.md
Records GenDataGridCrud package planning and implementation changes.
-->

# GenDataGridCrud 구현 로그

## 2026-07-20

### ActionBar buttonMode + DataGridCrudChrome

- **요약:** `actionBar.buttonMode: 'label' | 'icon'` 추가. `DataGridCrudChromeProvider`로 앱 전역 토글. icon 모드는 `Button size="icon"`, `aria-label`/`title` 유지. demo 환경설정 Switch + localStorage.
- **파일:** `DataGridCrudActionBar.tsx`, `GenDataGridCrud.types.ts`, `chrome/DataGridCrudChrome.tsx`, `index.ts`, `test/thinShell.test.tsx`, `apps/demo/.../useDemoPageChrome.ts`, `DemoSettingsModal.tsx`, `AppShell.tsx`

## 2026-07-12

### #3 App Integration Expansion — workflow · QA · readonly ActionBar

- **요약:** `workflow-patterns.md` (A/B/C) · QA 가이드 demo 4화면 갱신. readonly 시 ActionBar 기본 `includeBuiltIns`에서 mutation 숨김. thinShell 테스트. remaining-work-plan #3 complete. Lkup/Role 등 추가 admin 이식은 demo D4 follow-up.
- **파일:** `DataGridCrudActionBar.tsx`, `GenDataGridCrud.types.ts`, `test/thinShell.test.tsx`, `.docs/workflow-patterns.md`, `.docs/app-integration-qa-guide.md`, `.docs/gen-datagrid-crud-package-design.md`, `.docs/README.md`, `plan/remaining-work-plan.md`

### #2 Package Surface Cleanup — onStateChange 가이드 + headless Storybook

- **요약:** package-design에 `onStateChange` 구독 가이드·headless controller 예시 추가. Storybook `HeadlessControllerCustomActionBar`.
- **파일:** `gen-datagrid-crud-package-design.md`, `GenDataGridCrud.types.ts`, `stories/GenDataGridCrud.stories.tsx`, `plan/remaining-work-plan.md`

### #1 Add Row Insert Position — top prepend + docs/tests

- **요약:** `createdRowPosition: 'top'`일 때 연속 Add를 prepend(최신=0번). bottom append 유지. package-design·README 예시, thinShell 순서·commit 테스트.
- **파일:** `useDataGridCrudController.tsx`, `GenDataGridCrud.types.ts`, `test/thinShell.test.tsx`, `.docs/gen-datagrid-crud-package-design.md`, `.docs/README.md`, `plan/remaining-work-plan.md`

## 2026-07-10

### MasterDetail chevron toggle + Storybook (CRUD `masterDetail`)

- **요약:** `renderDetailChevronToggle` re-export 소비 · CRUD Storybook `MasterDetailLeadingColumn`/`MasterDetailChevronToggle` · demo UserPage chevron.
- **검증:** `pnpm -C packages/gen-datagrid-crud test`
- **파일:** `packages/gen-datagrid-crud/src/stories/GenDataGridCrud.stories.tsx`, `packages/gen-datagrid/src/features/master-detail/detailChevronToggle.tsx`, `apps/demo/src/pages/admin/user/UserPage.tsx`

### Master-detail Config (`masterDetail` prop) 구현

- **요약:** CRUD top-level `masterDetail` prop · `resolveMasterDetailGridProps` · demo UserPage 마이그레이션. gen-datagrid 변경 없음.
- **검증:** `pnpm -C packages/gen-datagrid-crud test`
- **파일:** `src/GenDataGridCrud.types.ts`, `src/GenDataGridCrud.tsx`, `src/features/master-detail/resolveMasterDetailGridProps.ts`, `src/index.ts`, `test/masterDetailConfig.test.tsx`, `apps/demo/src/pages/admin/user/UserPage.tsx`

### Master-detail Config architecture + plan (CRUD `masterDetail` prop)

- **요약:** gen-datagrid flat API 유지, CRUD top-level `masterDetail` 통합 설계·구현 slice 문서화.
- **파일:** `.docs/architecture/master-detail-config-architecture.md`, `.docs/plan/master-detail-config-plan.md`, `.docs/plan/remaining-work-plan.md`, `.docs/gen-datagrid-crud-package-design.md`, `.docs/README.md`

## 2026-07-09

### Remaining Work Plan — Dirty baseline revert cross-link

- **요약:** gen-datagrid dirty baseline 복귀 시 field clean 미구현 이슈를 backlog에 cross-link. CRUD는 grid dirty에만 의존.
- **파일:** `.docs/plan/remaining-work-plan.md`

### GenDataGridCrud `gridRef` prop

- **요약:** 외부에서 `GenDataGridHandle`(예: `emitCellValueChange`)을 쓸 수 있도록 optional `gridRef` 추가. 내부 controller ref와 병합.
- **파일:** `src/GenDataGridCrud.tsx`, `src/GenDataGridCrud.types.ts`

### Remaining Work Plan — Built-in Editor meta cross-link

- **요약:** gen-datagrid Gate 4.3 editor meta backlog 링크 갱신 (`Built-in Editor Column Meta Extensions`).
- **파일:** `.docs/plan/remaining-work-plan.md`

### Remaining Work Plan — Editor 제공 범위 외 명시

- **요약:** cell editor는 gen-datagrid 책임. CRUD plan에 범위 외 절·gen-datagrid `editNormalize` backlog 링크.
- **파일:** `.docs/plan/remaining-work-plan.md`

### Remaining Work Plan — Add Row 삽입 위치 정리

- **요약:** `createdRowPosition` (top/bottom) Gate 11 기구현 현황·연속 Add prepend 갭·per-call/arbitrary insert 범위를 `remaining-work-plan.md`에 정리.
- **파일:** `.docs/plan/remaining-work-plan.md`

### Remaining Work Plan 신설 — Add Row 첫 editable 포커스

- **요약:** `plan/remaining-work-plan.md` 생성. 행 추가 후 첫 editable 컬럼 edit 진입 백로그 등록 (gen-datagrid handle API 선행 의존).
- **파일:** `.docs/plan/remaining-work-plan.md`, `.docs/README.md`

### 디자인 토큰·theme 정렬 구현 (단계 1~3)

- **조치:** `src/styles/tokens.css` 신설 (`--gen-datagrid-crud-*`, gen-datagrid Shell 파생). `index.css` theme `--color-*` 제거, action bar separator 1줄, grid `border-top` 삭제.
- **검증:** `pnpm -C packages/gen-datagrid-crud build` · vitest 17 passed. dist에 `--gen-datagrid-crud-actionbar-bg` 존재, `--color-fg-default` 없음.
- **관련 파일:** `src/styles/tokens.css`(신규), `src/index.css`, `.docs/architecture/design-tokens-architecture.md`, `.docs/plan/design-tokens-restructure-plan.md`

### 디자인 토큰·theme 정렬 architecture/plan (단계 0)

- **조치:** `index.css`의 theme semantic 직참조·`--color-fg-default` 오류·이중 보더 이슈를 정리. `--gen-datagrid-crud-*`는 gen-datagrid Shell만 파생, theme `--color-*` 금지. `styles/tokens.css` + action bar chrome + layout separator 정책 문서화.
- **관련 파일:** `.docs/architecture/design-tokens-architecture.md`(신규), `.docs/plan/design-tokens-restructure-plan.md`(신규), `.docs/README.md`

## 2026-07-08

### 셀 편집값 in-place 표시 (dirty overlay)

- **증상:** 셀을 편집하면 dirty 마커는 뜨지만 표시값이 원본으로 원복되고, 저장(refetch) 후에만 값이 보였다.
- **원인:** GenDataGrid는 헤드리스 계약(`gen-datagrid/.docs/reference/cell-edit-api.md §7`)상 편집 시 `data`를 직접 변경하지 않고 dirty state에만 값을 기록한다. 표시 반영은 "부모"가 `onCellValueChange`로 `data`를 갱신해야 하는데, CRUD 래퍼가 그 역할을 하지 않아 기존 행 편집이 화면에 반영되지 않았다.
- **조치:** `useDataGridCrudController`가 컨트롤러가 이미 보유한 `dirtyState.cells`(편집값 포함)를 기반으로 표시 데이터(`displayData = gridData + dirty overlay`)를 파생해 그리드에 전달하도록 변경. 그리드 코어는 계약대로 무변경.
- **계약 유지:** 커밋은 `getChangeSet`의 patch 기반이라 그대로 동작. `handle.getData()`(commitArgs.data)와 표시 데이터가 편집값으로 일관됨. `dataVersion` 변경/`acceptChanges` 시 dirty가 비워지며 overlay도 자동 해제.
- **관련 파일:** `src/crud/useDataGridCrudController.tsx`

## 2026-07-01

### CRUD state 함수 identity 의존성 보정 (V1 `01cd1dd`)

- `DataGridCrudUiState`의 `canCreateRow`, `canExport` 계산이 함수 identity 변화에 의해 매 렌더 새 state를 만들지 않도록 boolean 값으로 분리했다.
- `onStateChange`는 ref로 최신 callback을 유지하고 state effect 의존성에서 제외했다.
- 빈 `createdRows`일 때 `createdRowIds`는 stable empty array를 사용한다.
- `GenDataGridCrud`가 `GenDataGrid`에 `data`와 `columns`를 전달할 때 입력 참조 변경 시에만 memoized copy를 만들도록 변경했다.
- inline `createRow`와 `onStateChange`가 함께 써도 반복 통지가 발생하지 않는 회귀 테스트를 추가했다.
- 원인·해결 내용: `.docs/customer-info-loading-loop.md`
- 관련 파일: `src/GenDataGridCrud.tsx`, `src/crud/useDataGridCrudController.tsx`, `test/thinShell.test.tsx`

### gridProps DataGrid feature flag 전달 허용 (V1 `9230ea2`)

- `GenDataGridCrud`가 고정하던 `enableDirtyState`, `enableRowStatus`, `enableCurrentRowHighlight`, `enableRowSelection`, `enableColumnFilters`, `enableColumnReorder`를 `gridProps`로 opt-out 또는 override할 수 있게 했다.
- CRUD가 소유해야 하는 data, columns, getRowId, controlled state callback은 계속 내부 소유로 유지했다.
- Dashboard처럼 읽기 전용으로 쓰는 CRUD 화면에서 row selection/status 시스템 컬럼을 숨길 수 있도록 테스트를 추가했다.
- 관련 파일: `src/GenDataGridCrud.types.ts`, `src/GenDataGridCrud.tsx`, `src/crud/useDataGridCrudController.tsx`, `test/thinShell.test.tsx`

### V1 동기화 — CRUD 편집 기본값 및 column 타입

- V1 `frontend` 커밋 `413398f`, `35fe691` 변경을 V2에 반영했다.
- `editSelectOnFocus` 기본값 `true`, `editPolicy.continueTriggers.click` 기본값 `true`를 `GenDataGridCrud`에 적용했다.
- `columns` prop 타입을 `GenDataGridColumnDef`로 변경했다.
- thin shell 테스트에 select-on-focus·click continuation 기본값 및 opt-out 케이스를 추가했다.
- 관련 파일: `src/GenDataGridCrud.tsx`, `src/GenDataGridCrud.types.ts`, `test/thinShell.test.tsx`, `.docs/implementation-log.md`

## 2026-06-30

### ActionBar와 Grid 사이 경계선 보강

- `GenDataGridCrud` ActionBar와 Grid 사이에 명시적인 구분선이 보이도록 `.gen-datagrid-crud__grid` 상단 border를 추가했다.
- ActionBar의 `border-bottom: 0` 정책은 유지하고, Grid 영역이 shell 경계선을 책임지도록 정리했다.
- ActualsPage에서 ActionBar와 Grid가 한 덩어리처럼 붙어 보이면서도 경계가 사라지지 않도록 보정했다.
- 관련 파일: `src/index.css`, `.docs/implementation-log.md`

## 2026-06-30

### GenDataGrid 기본 CSS 포함 보정

- `GenDataGridCrud` CSS entry가 내부 `GenDataGrid` 기본 스타일을 함께 포함하도록 보정했다.
- demo app이 `@gen-office/gen-datagrid-crud/index.css`만 import해도 grid/root/viewport/cell 레이아웃 스타일이 적용되도록 했다.
- ActualsPage에서 DOM은 렌더링되지만 cell이 grid가 아니라 세로로 나열되던 문제의 원인을 CSS 누락으로 정리했다.
- 관련 파일: `src/index.css`, `.docs/implementation-log.md`

## 2026-06-30

### ActualsPage 표시를 위한 wrapper 높이 체인 보강

- `GenDataGridCrud` wrapper가 flex layout 안에서 남은 높이를 채우도록 기본 CSS를 보강했다.
- `.gen-datagrid-crud`, `.gen-datagrid-crud__grid`, 내부 `.gen-datagrid`까지 flex height chain이 이어지도록 처리했다.
- ActualsPage처럼 `workarea`가 flex column인 화면에서 `GenDataGrid` viewport가 0 높이에 가깝게 잡히는 문제를 방지했다.
- 관련 파일: `src/index.css`, `.docs/implementation-log.md`

## 2026-06-30

### Gate 12 ActualsPage 전환 및 migration 문서화

- demo app의 `ActualsPage`를 `GenGridCrud`에서 `GenDataGridCrud`로 전환했다.
- readonly 조회 화면 기준으로 data, columns, getRowId, dataVersion, ActionBar custom action, filter/export shell, virtualization, pinning, column sizing, current row highlight를 연결했다.
- `apps/demo`에 `@gen-office/gen-datagrid-crud` dependency와 CSS import를 추가했다.
- 기존 `GenGridCrud` 전용 chart context menu, row spanning, getCellStyle, real Excel export, ActionBar style 옵션은 migration gap으로 문서화했다.
- Gate 12 계획, migration guide, app QA guide를 추가했다.
- 관련 파일: `apps/demo/package.json`, `apps/demo/src/main.tsx`, `apps/demo/src/pages/co/actuals/ActualsPage.tsx`, `.docs/gate-12-app-integration-plan.md`, `.docs/gen-grid-crud-migration-guide.md`, `.docs/app-integration-qa-guide.md`, `.docs/README.md`, `.docs/implementation-log.md`

## 2026-06-30

### Gate 11.5 Export source shell 구현

- `GenDataGridCrudProps.onExport`와 `DataGridCrudExportArgs<TData>` public type을 추가했다.
- Excel action은 `onExport`가 있을 때만 활성화하도록 변경했다.
- export action이 현재 view data, 원본 source data, local created rows, last change set, CRUD UI state를 전달하도록 했다.
- 실제 파일 생성은 Gate 12 또는 별도 Excel workflow 범위로 남겼다.
- export source contract와 Excel disabled 상태를 테스트로 고정했다.
- 관련 파일: `src/GenDataGridCrud.tsx`, `src/GenDataGridCrud.types.ts`, `src/crud/useDataGridCrudController.tsx`, `src/components/DataGridCrudActionBar.tsx`, `src/index.ts`, `test/thinShell.test.tsx`, `.docs/gate-11-crud-mutation-plan.md`, `.docs/gen-datagrid-crud-package-design.md`, `.docs/implementation-log.md`

## 2026-06-30

### Gate 11.4 Commit result advanced handling 구현

- `onCommit`이 `{ ok: false, fieldErrors }`를 반환하면 field errors를 `DataGridCrudUiState.fieldErrors`에 반영하도록 했다.
- commit 실패 시 `error`를 `validationError`에 보관하고 `onCommitError`를 호출한다.
- commit 실패 시 `acceptChanges()`를 호출하지 않고 created rows와 dirty marker를 유지하도록 cleanup timing을 고정했다.
- commit 성공 시에만 `acceptChanges()`, created row clear, field error clear를 수행한다.
- 서버 field error가 cell marker로 표시되고 pending created row가 유지되는 테스트를 추가했다.
- 관련 파일: `src/crud/useDataGridCrudController.tsx`, `test/thinShell.test.tsx`, `.docs/gate-11-crud-mutation-plan.md`, `.docs/gen-datagrid-crud-package-design.md`, `.docs/implementation-log.md`

## 2026-06-30

### Gate 11.3 Field error marker 연결

- `DataGridCrudUiState.fieldErrors`를 `GenDataGrid`의 `getCellValidation`과 compose하도록 wrapper를 보강했다.
- field error key 규칙을 `${rowId}.${columnId}`로 고정했다.
- field error가 있는 cell은 `severity: 'error'`와 message를 반환하고, field error가 없으면 app이 제공한 기존 `gridProps.getCellValidation` 결과를 유지한다.
- validation 실패 후 cell marker와 기존 app validation이 함께 유지되는 테스트를 추가했다.
- 관련 파일: `src/GenDataGridCrud.tsx`, `test/thinShell.test.tsx`, `.docs/gate-11-crud-mutation-plan.md`, `.docs/gen-datagrid-crud-package-design.md`, `.docs/implementation-log.md`

## 2026-06-30

### Gate 11.2 Commit validation 구현

- `GenDataGridCrudProps.validateCommit`을 추가해 commit 전 업무 검증을 실행할 수 있게 했다.
- `DataGridCrudValidationResult`, `DataGridCrudFieldErrors` public type과 `onValidationError` callback을 추가했다.
- validation 실패 시 `onCommit` 호출을 차단하고 `fieldErrors`, `validationError`를 `DataGridCrudUiState`에 보관하도록 했다.
- Save 성공 또는 Reset 시 validation state를 정리하도록 처리했다.
- validation 실패 시 commit이 호출되지 않고 field errors가 state로 발행되는 테스트를 추가했다.
- 관련 파일: `src/GenDataGridCrud.tsx`, `src/GenDataGridCrud.types.ts`, `src/crud/useDataGridCrudController.tsx`, `src/index.ts`, `test/thinShell.test.tsx`, `.docs/gate-11-crud-mutation-plan.md`, `.docs/gen-datagrid-crud-package-design.md`, `.docs/implementation-log.md`

## 2026-06-30

### Gate 11.1 Created row store 구현

- `GenDataGridCrudProps.createRow`와 `createdRowPosition`을 추가했다.
- controller가 local `createdRows`를 보관하고 `gridData`를 `data`와 합성해 `GenDataGrid`에 전달하도록 변경했다.
- created row는 row status `created`로 표시하고, Save 시 created row의 dirty patch를 `changeSet.created`에 병합한다.
- created row patch가 `changeSet.updated`에 중복으로 남지 않도록 필터링했다.
- Reset은 local created rows와 grid dirty marker를 함께 정리하고, Delete는 created row를 local store에서 제거하도록 처리했다.
- 관련 파일: `src/GenDataGridCrud.tsx`, `src/GenDataGridCrud.types.ts`, `src/crud/useDataGridCrudController.tsx`, `src/components/DataGridCrudActionBar.tsx`, `test/thinShell.test.tsx`, `src/stories/GenDataGridCrud.stories.tsx`, `.docs/gate-11-crud-mutation-plan.md`, `.docs/gen-datagrid-crud-package-design.md`, `.docs/implementation-log.md`

### Gate 10 Storybook 후보 추가

- Gate 10.7 Storybook smoke 후보를 추가했다.
- readonly ActionBar, dirty save shell, custom action context 흐름을 수동 확인할 수 있게 했다.
- 관련 파일: `src/stories/GenDataGridCrud.stories.tsx`, `package.json`, `.docs/gate-10-thin-shell-plan.md`, `.docs/implementation-log.md`

### Gate 10 thin shell 검증 및 handle flush 보강

- `GenDataGridCrud` 저장 흐름에서 active editor를 `flushEditing()`으로 커밋한 뒤 최신 grid handle에서 change set을 다시 읽도록 보강했다.
- Save 버튼은 active editor가 아직 dirty marker를 만들기 전에도 클릭할 수 있도록, readonly/committing 상태만으로 비활성화한다.
- `GenDataGrid`의 editing draft를 ref에도 보관해 외부 imperative handle이 같은 이벤트 턴에서 최신 editor 값을 읽을 수 있게 했다.
- Gate 10 최소 workflow 테스트를 추가했고 save/reset/delete/ActionBar contract를 검증했다.
- 관련 파일: `src/crud/useDataGridCrudController.tsx`, `src/components/DataGridCrudActionBar.tsx`, `test/thinShell.test.tsx`, `../gen-datagrid/src/features/editing/useCellEditing.ts`, `../gen-datagrid/src/renderers/div-grid/DataGridRoot.tsx`

### Gate 10 thin shell 1차 구현

- `@gen-office/gen-datagrid-crud` package scaffold를 추가했다.
- `GenDataGridCrud`, `DataGridCrudActionBar`, `useDataGridCrudController`를 thin shell로 구현했다.
- controller는 Gate 9 `GenDataGridHandle` API를 사용해 save/reset/delete/filter/column reorder shell을 제공한다.
- save 흐름은 `flushEditing() -> getChangeSet() -> onCommit() -> acceptChanges()` 순서로 연결했다.
- add row와 real Excel export는 Gate 11/12 범위로 남기고 현재는 no-op shell로 둔다.
- 관련 파일: `package.json`, `tsconfig.json`, `vite.config.ts`, `src/index.ts`, `src/GenDataGridCrud.tsx`, `src/GenDataGridCrud.types.ts`, `src/crud/useDataGridCrudController.tsx`, `src/components/DataGridCrudActionBar.tsx`, `src/index.css`, `.docs/gate-10-thin-shell-plan.md`

### Gate 10 세부 실행 계획 문서화

- `GenDataGridCrud Thin Shell` 구현을 10.1-10.7 slice로 나누어 실행 계획을 문서화했다.
- package scaffold, public type model, controller shell, ActionBar shell, wrapper, minimal workflow, Storybook/demo 후보의 완료 기준을 정리했다.
- Gate 10과 Gate 11/12의 경계를 분리했다.
- 관련 파일: `.docs/gate-10-thin-shell-plan.md`, `.docs/README.md`, `.docs/implementation-log.md`

## 2026-06-29

### Gate 10 준비 문서 연결

- `gen-datagrid-crud` 구현을 Gate 10 `GenDataGridCrud Thin Shell`로 연결했다.
- 선행 조건을 Gate 9 `Handle / Data Ownership Readiness` 완료로 명시했다.
- 관련 파일: `.docs/README.md`, `.docs/implementation-log.md`

### GenDataGridHandle 선행 계획 연결

- `gen-datagrid-crud` 구현 전 필요한 `GenDataGridHandle` 확장 계획과 architecture 문서를 연결했다.
- `flushEditing`, `getData`, `getChangeSet`, `acceptChanges`를 CRUD save pipeline의 선행 조건으로 명시했다.
- `insertRows`와 `load`는 controlled/uncontrolled data ownership 결정 후 처리할 후속 slice로 분리했다.
- 관련 파일: `.docs/README.md`, `.docs/gen-datagrid-crud-readiness-audit.md`, `.docs/gen-datagrid-crud-package-design.md`, `.docs/implementation-log.md`

### 초기 설계 문서 작성

- `GenDataGrid`의 CRUD 준비도를 평가하고, 이미 제공하는 data/edit/dirty/delete/selection 기능과 부족한 public handle 후보를 정리했다.
- `gen-datagrid-crud`를 독자 상태 관리자가 아니라 얇은 workflow/controller와 ActionBar UI shell로 설계했다.
- 기존 `gen-grid-crud`에서 재사용할 수 있는 ActionBar, validation, export 구조와 새로 작성해야 하는 grid adapter 영역을 분리했다.
- 관련 파일: `.docs/README.md`, `.docs/gen-datagrid-crud-readiness-audit.md`, `.docs/gen-datagrid-crud-package-design.md`, `.docs/implementation-log.md`

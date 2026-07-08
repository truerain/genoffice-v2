<!-- packages/gen-datagrid/docs/plan/remaining-work-plan.md
Tracks remaining GenDataGrid work as executable gates after the main MVP surface.
-->

# GenDataGrid Remaining Work Plan

이 문서는 완료된 Gate 1-8 이후의 남은 작업을 실행 가능한 Gate 단위로 관리한다.
완료된 구현 이력은 `../log/implementation-log.md`, 완료된 계획 이력은
`../log/planning-history.md`, 설계 근거는 `../architecture/*` 문서에 기록한다.

## Current Status

GenDataGrid는 주요 MVP 표면에 대한 구현 커버리지를 갖고 있다.

- div renderer and scoped DOM contract
- active cell and keyboard navigation
- range selection and clipboard copy
- editing and paste MVP
- column sizing, pinning, and reorder
- filtering, footer, pagination, dirty state, and data ownership MVP
- row virtualization, dynamic row measurement, and scroll-seeking placeholders
- master-detail, nested grid composition, and tree rows
- body column span, grouped headers, validation markers, and visual row merge
- system columns and current row highlight

남은 작업은 `GenDataGridCrud`를 얇게 만들기 위한 handle/data ownership 정리와,
CRUD 패키지 구현, app integration, 그리고 후속 확장 backlog로 나눈다.

## Execution Gates

### Gate 9. Handle / Data Ownership Readiness

Status: complete.

목표: `GenDataGridCrud`가 별도 grid state를 많이 들지 않도록 `GenDataGridHandle`의
CRUD 선행 API를 확정하고 구현한다.

Plan:

- `handle-extension-plan.md`

Architecture:

- `../architecture/handle-data-ownership-architecture.md`

Scope:

- `GenDataGridHandle<TData = unknown>` generic 정리
- `getData()`
- `getRow(rowId)`
- `getChangeSet()`
- `acceptChanges(rowIds?)`
- `flushEditing()`
- `cancelEditing()`
- controlled/uncontrolled data ownership 문서 기준 반영

Deferred from Gate 9:

- `revertChanges(rowIds?)`
- `insertRows(rows, options?)`
- `load(nextData, options?)`
- `hardReset()`
- controlled current row API

Exit criteria:

- handle type과 implementation이 일치한다.
- 기존 `resetDirtyState`, `commitDirtyState`, `deleteRows`, `getDirtyState` 동작이 깨지지 않는다.
- dirty cells와 deleted row ids 기반 `getChangeSet()` 테스트가 있다.
- `flushEditing()`은 active editor가 없을 때 no-op으로 안전하게 동작한다.
- controlled `data`는 handle이 몰래 mutation하지 않는다는 정책이 문서와 테스트에 반영된다.

### Gate 10. GenDataGridCrud Thin Shell

목표: `@gen-office/gen-datagrid-crud` 패키지의 기본 구조, ActionBar, controller shell을 만든다.

Package docs:

- `../../gen-datagrid-crud/.docs/gen-datagrid-crud-package-design.md`
- `../../gen-datagrid-crud/.docs/gen-datagrid-crud-readiness-audit.md`

Scope:

- package scaffold
- `GenDataGridCrud` wrapper
- `useDataGridCrudController`
- ActionBar UI 이식
- readonly/filter/export 중심 최소 workflow
- `GenDataGrid` handle 기반 save 준비 흐름 연결
- first Storybook or demo integration candidate

Exit criteria:

- `@gen-office/gen-datagrid-crud` build가 통과한다.
- ActionBar는 grid를 직접 알지 않고 `state`와 `actionApi`만 받는다.
- readonly 조회 화면에서 filter/export/custom action shell을 사용할 수 있다.
- CRUD 패키지가 `GenDataGrid` dirty/delete/selection 상태를 중복 구현하지 않는다.

### Gate 11. CRUD Mutation Completion

목표: edit/update/delete/save 흐름을 완성하고 validation marker와 commit pipeline을 연결한다.

Scope:

- edit/update patch collection
- delete workflow
- save workflow
- `beforeCommit`, `onCommit`, success/error callback
- field validation orchestration
- `getCellValidation` 연결
- field error 유지/초기화 정책
- created row 정책 결정

Created row decision:

- 1차로 CRUD-local created row store를 둘 수 있다.
- 구현 중 중복이 커지면 `GenDataGrid.insertRows()`를 Gate 11 내부 선행 slice로 승격한다.

Exit criteria:

- update/delete/save flow 테스트가 있다.
- validation error가 cell marker로 표시된다.
- save 성공 후 `acceptChanges()` 또는 `dataVersion` 변경으로 marker가 정리된다.
- controlled app data를 CRUD wrapper가 몰래 mutation하지 않는다.

### Gate 12. App Integration / Migration

Status: complete.

Completed references:

- `../../../gen-datagrid-crud/.docs/gate-12-app-integration-plan.md`
- `../../../gen-datagrid-crud/.docs/gen-grid-crud-migration-guide.md`
- `../../../gen-datagrid-crud/.docs/app-integration-qa-guide.md`

목표: demo app에서 실제 화면 전환 기준을 검증하고 `GenGridCrud`와의 차이를 문서화한다.

Scope:

- demo page 1개 이상 `GenDataGridCrud`로 전환
- `ActualsPage` 같은 readonly/export 중심 화면 우선 검토
- 기존 `GenGridCrud` API와 migration guide 작성
- Storybook/QA guide 작성
- Excel/export 완성도 검증
- app-level controlled data usage guide 보강

Exit criteria:

- demo TypeScript check가 통과한다.
- 기존 `GenGridCrud` 사용 화면과 새 `GenDataGridCrud` 사용 화면의 책임 차이가 문서화된다.
- migration guide가 app 개발자가 적용할 수 있는 prop mapping을 제공한다.

### Gate 13. Type Declaration Distribution (dist .d.ts)

Status: complete (2026-07-08).

목표: `gen-datagrid`·`gen-datagrid-crud`가 `dist/index.d.ts`(및 하위 선언)를 실제로
배포해, 소비처(`apps/demo` 등)가 손으로 작성한 ambient 스텁 없이 실제 타입을 쓰게 한다.

배경 / 진단 (2026-07-08):

- 두 패키지 모두 `package.json`의 `types`는 `./dist/index.d.ts`를 가리키지만 **dist에는
  `index.css`·`index.mjs`만 존재하고 `.d.ts`가 없다.**
- `vite.config.ts`에 `vite-plugin-dts`가 설정돼 있고 빌드 로그도
  `[unplugin:dts] Declaration files built`를 출력하지만 **실제로 파일이 기록되지 않는다**
  (패키지 어디에도 신규 `.d.ts` 없음). `pnpm.overrides`의 `vite-plugin-dts: 5.0.2` 핀이
  비정상적으로 보이므로 버전/플러그인 동작부터 점검 필요.
- 그 결과 `apps/demo`는 임시 스텁 `apps/demo/src/types/gen-datagrid-crud.d.ts`로 API를
  수동 선언 중이며, 이 스텁이 실제 런타임 `changeSet`(예: `updated[i].row`,
  `deleted[i].row`, `cells`)을 누락해 소비처가 전체 행 등 정보를 타입으로 활용하지 못한다.
  (런타임 `dist/index.mjs`는 이미 `row`를 반환함 — 순수 타입 파이프라인 문제.)

근본 원인 (2026-07-08 확정):

- 패키지 `tsconfig.json`의 `composite: true` + `references`(`tsconfig.test.json`) 조합에서
  선언 방출이 동작하지 않는다. `vite-plugin-dts@5.0.2`는 이 상태에서 성공 로그만 남기고
  파일을 쓰지 않으며, `tsc -p tsconfig.json --emitDeclarationOnly`도 동일 원인으로
  `TS6305`(Output file has not been built) 에러가 난다. `.tsbuildinfo` 캐시 삭제로도
  해결되지 않음(설정 문제이지 캐시 문제가 아님).

해결 (2026-07-08):

- 각 패키지에 선언 전용 클린 설정 `tsconfig.build.json` 추가
  (`composite:false`, `incremental:false`, `emitDeclarationOnly:true`, `references:[]`,
  stories/test 제외).
- build script를 `vite build && tsc -p tsconfig.build.json`로 변경(선언은 tsc가 담당).
- `vite.config.ts`에서 무동작 `vite-plugin-dts` 플러그인 제거, 미사용 devDep 정리.
- d.ts 방출로 드러난 crud 잠재 타입 오류 2건 수정:
  - `DataGridCrudActionBar` save 버튼 `variant` `'brand'` → `'primary'`
    (`ButtonVariant`에 `'brand'` 없음).
  - `DataGridCrudController.gridRef` 타입을 React 19 `useRef` 반환에 맞춰
    `RefObject<GenDataGridHandle<TData> | null>`로 수정.
- `apps/demo` 임시 스텁 `src/types/gen-datagrid-crud.d.ts` 제거, 실제 타입으로 검증.
- (미적용/선택) 실제 `changeSet.updated[i].row` 노출로 `apps/demo/src/shared/api/commit.ts`의
  `buildCommitPayload`를 `args.data` 재구성 대신 `row` 직접 사용으로 단순화 가능
  (가이드 문서 계약 변경을 수반하므로 후속 판단).

Exit criteria (충족):

- `gen-datagrid` dist 44개, `gen-datagrid-crud` dist 5개 `.d.ts` 실제 생성,
  `changeSet.updated[i].row: TData`·`deleted[i].row?: TData`·`cells` 포함 확인.
- `apps/demo`가 ambient 스텁 없이 `tsc --noEmit` 통과.
- 소비처가 `updated[i].row`를 타입 안전하게 사용 가능.

참고 (범위 밖):

- `vite-plugin-dts@5.0.2`는 root `pnpm.overrides`에 핀되어 다른 패키지
  (`ui`/`theme`/`utils`/`mdi`/`gen-chart`/`gen-frame`)에서도 사용 중이다. 동일 증상 가능성이
  있으나 해당 패키지는 package review 트랙 소유이므로 이 Gate에서는 손대지 않는다.

## Backlog After Gate 12

### Documentation Consistency

- stale status text 정리
- 오래된 Korean 문서 mojibake 복구
- README link와 plan/log 구조 정합성 유지
- API reference implementation status 유지

### Visual Row Merge Follow-up

- pinned column sticky merge labels
- non-virtual continuation value rendering
- `visualRowMerge.getValue`
- `visualRowMerge.compare`
- tree/detail/body col span 조합 정책

### Header Group Follow-up

- pinned group header split/sticky behavior
- `groupVisibilityToggle`
- group header resize/reorder/filter affordance

### Current Row Controlled API

- `currentRowId`
- `defaultCurrentRowId`
- controlled `activeCell`과 controlled `currentRowId` 충돌 정책
- active cell과 current row 독립 이동 정책

### Virtualization Follow-up

- column virtualization
- browser-level visual regression
- Storybook interaction or Playwright large-row scroll checks

### Clipboard And Editing Follow-up

- paste-to-selection
- clipboard value formatter policy
- paste type coercion policy
- reserved `editOnActiveCell`, `keepEditingOnNavigate` 활성화 또는 제거 결정
- popup/custom editor navigation policy 보강

### Filtering Follow-up

- structured filter operators
- typed filter editors
- multi-condition filters
- manual/server filtering examples

### Tree Follow-up

- async/lazy child loading API
- flat parentId adapter
- tree + master-detail combination policy
- tree drag/drop reorder
- `treeToggleColumnId`
- `treeCollapseBehavior`
- server-side tree filtering semantics

### Public API Surface Cleanup

- implemented handle reference와 Gate 9 계획 정합성 유지
- deferred data mutation handle 정책 정리
- row/cell className and style callback API
- empty state and toolbar slot API
- public surface 안정화 후 API reference split

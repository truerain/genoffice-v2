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
- 실제 `changeSet.updated[i].row` 노출로 `apps/demo/src/shared/api/commit.ts`의
  `buildCommitPayload`를 `args.data` 재구성 대신 `row` 직접 사용으로 단순화 완료
  (`getRowId` 인자 제거, 가이드 `data-integration.md` 시그니처 동기화).

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

### Row Status Context API (Page / Column Access)

Status: planned.

배경 (2026-07-09, `apps/demo` UserPage):

- `GenDataGridRowStatus`(`clean` | `created` | `updated` | `deleted`)는 Gate 8.7·`GenDataGridCrud`
  `rowStatusResolver`로 이미 계산되지만, **앱 컬럼 정의**(`meta.editable`, `cell`, `getEditOptions` 등)의
  콜백 컨텍스트에는 내려오지 않는다.
- 소비처가 신규/수정 행 분기를 `row.userId`·`NEW_ROW_ID_PREFIX` 같은 **도메인 데이터 우회**로 처리 중이며,
  `deleted`/`updated` 구분이 불가능하다.
- `enableRowStatus` 시스템 컬럼·`data-gen-datagrid-row-status` DOM은 **시각 확인용**이며, 타입 안전한
  컬럼 로직 API가 아니다.

목표: 페이지·컬럼 레이어에서 **그리드가 이미 해석한 row status**를 조회해, editable/display/validation
규칙에 사용할 수 있는 public API를 추가한다.

Architecture (신규 또는 Gate 8.7 follow-up):

- `../architecture/gate-8-7-system-columns-architecture.md` §Row Status 연계
- (작성 시) `../architecture/gate-8-9-row-status-context-api-architecture.md` — 컨텍스트 확장·단일
  resolver 소유권·CRUD 연동

제안 API (1차, 택1 또는 병행 — architecture에서 확정):

1. **컨텍스트 확장 (권장 1차)**  
   `GenDataGridEditableContext` 및 동일 패턴 콜백(`GenDataGridValidationContext`,
   `GenDataGridBodyColSpanContext`, `GenDataGridVisualRowMergeContext` 등)에  
   `rowStatus: GenDataGridRowStatus` 추가.  
   내부 `resolveRowStatus()` 결과를 재사용(컬럼·편집기·검증이 동일 정본).

2. **명시 조회 헬퍼 (보조)**  
   `GenDataGridHandle.getRowStatus(rowId): GenDataGridRowStatus | undefined` — imperative·테스트·
   Storybook용. 컬럼 콜백과 값이 일치해야 함.

3. **CRUD 연동**  
   `GenDataGridCrud`의 `rowStatusResolver`(createdRowIdSet + dirty/deleted)를 grid 쪽 단일 resolver로
   위임; 앱이 `gridProps.rowStatusResolver`를 오버라이드할 때도 컬럼 `rowStatus`와 **동일 함수**를
   쓰도록 문서화.

Scope:

- `GenDataGrid.types.ts` — 컨텍스트 타입·handle 메서드(선택) 확장
- `DataGridRoot` / `DataGridBodyRow` — `resolveRowStatus` 결과를 editable·cell·validation 경로에 주입
- `editableCell.ts` — `createEditableContext`에 `rowStatus` 포함
- `api-structure.md`, `api-comparison-with-gen-grid.md` 갱신
- interaction 테스트: created/updated/deleted 행에서 `meta.editable(({ rowStatus }) => …)` 동작
- `gen-datagrid-crud` — 기존 `rowStatusResolver`와 중복 없이 grid 주입 경로 확인
- 소비처 예시: `apps/demo` `userColumns` — `NEW_ROW_ID_PREFIX` 대신 `rowStatus === 'created'`로
  userId 표시/편집 정책 (별도 앱 PR)

Deferred:

- custom row status **renderer** API (Gate 8.7 excluded 유지)
- `createdRowIdSet` 등 CRUD 내부 집합의 직접 export
- server-side row status와의 동기화 (dirty만으로 `updated` 판별하는 현 정책 유지)

Exit criteria:

- 컬럼 `meta.editable` / `cell` / `getEditOptions`에서 `rowStatus`를 타입 안전하게 읽을 수 있다.
- grid 기본 resolver와 `rowStatusResolver` 오버라이드 시 컬럼·시스템 status 컬럼이 **같은 값**을 쓴다.
- `GenDataGridCrud` + demo UserPage 패턴이 문서·스토리 또는 테스트로 고정된다.
- `userId`·sentinel 접두사에 의존한 행 상태 분기 가이드가 demo `.docs`에 “비권장”으로 명시된다.

참고 소비처:

- `apps/demo/src/pages/admin/user/userColumns.ts` (userId 표시/편집)
- `apps/demo/.docs/guide/page-conventions.md` §공통코드·컬럼 분기

### Editor Input Normalize — Format Presets (meta.editNormalize)

Status: planned.

배경 (2026-07-09, `apps/demo` `loginId` / `userColumnEditors.tsx`):

- 소문자 전용 입력을 위해 app에서 `renderEditor`로 built-in text editor를 **거의 재작성**했다.
- `handleBuiltinEditorKeyDown`, `createEditorBlurHandler`를 쓰지 않아 **키보드·blur 계약**이 built-in과 어긋날 수 있다.
- paste는 editor를 거치지 않아 app `validateCommit` / commit mapper에서 **별도 정규화**가 필요하다.
- `uppercaseText`, `digitsOnly` 등이 늘면 app마다 editor 복제가 반복된다.

**패키지 소유:** `@gen-office/gen-datagrid` (editing runtime).  
**`gen-datagrid-crud`는 editor 미제공** — [CRUD package design](../../gen-datagrid-crud/.docs/gen-datagrid-crud-package-design.md) §포함하지 않는다 (cell editing 재구현 안 함). CRUD는 `gridProps` 위임·문서 예시만.

목표: format 제약(소문자·대문자·숫자만 등)을 **meta 한 줄**로 선언하고, typing·paste·printable-key 진입 등 **모든 입력 경로**에 동일 적용한다.

#### 권장 1차 API

```ts
// GenDataGridColumnMeta
editNormalize?: (value: unknown, ctx: GenDataGridEditableContext<TData>) => unknown;

// 사용 예
meta: {
  editable: true,
  editType: 'text',
  editNormalize: (v) => String(v ?? '').toLowerCase(),
}

// 또는 preset editType (내부적으로 editNormalize와 동일 구현)
editType: 'lowercaseText' | 'uppercaseText' | 'digitsOnly';
```

공통 헬퍼 export (패키지 또는 `@gen-office/utils`):

- `normalizeLowercase`, `normalizeUppercase`, `normalizeDigitsOnly`

#### 적용 지점 (누락 시 버그)

1. `DefaultCellEditor` `onChange` (`renderEditor.tsx`)
2. paste application → `onCellValueChange` 직전 (Gate 4.2 경로)
3. (선택) printable-key로 편집 시작할 때 첫 문자

#### 2차 — custom editor 기반 (mask·lookup 등)

built-in으로 안 되는 UI는 **factory export**로 복제만 줄인다.

```ts
import { createBuiltinTextEditor, normalizeLowercase } from '@gen-office/gen-datagrid';

meta: { renderEditor: createBuiltinTextEditor({ normalize: normalizeLowercase }) }
```

- `handleBuiltinEditorKeyDown`, `createEditorBlurHandler`를 public export 또는 factory 내부 캡슐화
- popover/modal lookup은 app custom `renderEditor` 유지 (Gate 4.1-d surface)

#### 제공 범위 정리

| 종류 | 제공 위치 | 비고 |
| --- | --- | --- |
| lowercase / uppercase / digits | gen-datagrid meta (1차) | loginId, code, 사번 |
| text / number / date / select / textarea / checkbox | **기구현** `editType` | 변경 없음 |
| email·phone mask, 공통코드 select | app | 도메인·i18n 결합 |
| lookup / modal editor | app `renderEditor` | 무거우면 2차 별도 모듈 검토 |

#### Scope

- `GenDataGrid.types.ts` — `editNormalize`, preset `editType`
- `renderEditor.tsx`, paste pipeline — 정규화 hook
- `cell-edit-api.md`, `editor-implementation-contract.md` 갱신
- interaction 테스트: typing, paste, Tab/Enter/Escape가 built-in text와 동일
- 소비처: `apps/demo` `userColumns` — `userColumnEditors.tsx` 제거·meta 전환 (별도 app PR)

#### Deferred

- regex·복잡 mask·IME 조합 세밀 정책
- `@gen-office/datagrid-editors` 분리 패키지 (preset이 크게 늘 때만)

Exit criteria:

- `editNormalize` 또는 `editType: 'lowercaseText'`만으로 demo `loginId`가 동작하고 custom `renderEditor`가 불필요하다.
- paste로 대문자를 넣어도 commit 전 값이 정규화된다.
- CRUD `flushEditing()` + Save 경로에서 동일 값이 `getChangeSet()`에 반영된다.

참고 소비처:

- `apps/demo/src/pages/admin/user/userColumnEditors.tsx`
- `apps/demo/src/pages/admin/user/userColumns.ts` (`loginId`)

### Gate 8.8 Row Hover Highlight

Status: complete.

목표: 포인터 아래 행을 시각 강조하는 Row Hover Highlight (`enableRowHoverHighlight`, default **true**).

Architecture:

- `../architecture/gate-8-8-row-hover-highlight-architecture.md`

Scope:

- `enableRowHoverHighlight?: boolean` (default **true**; `false`로 끔)
- `--gen-datagrid-row-hover-bg` 토큰
- 루트 `data-row-hover-highlight` + 행 `:hover` 스타일
- current row / selection / deleted와의 cascade (hover가 양보)

Exit criteria:

- [x] prop off/on 시각·테스트 고정 (기본 ON, `false` 시 비활성)
- [x] pinned·virtual는 CSS `:hover` 1차 (마커 방식은 회귀 시 승격)
- [x] `enableCurrentRowHighlight`와 동시 사용 시 current가 hover보다 우선

### Virtualization Follow-up

- column virtualization
- browser-level visual regression
- Storybook interaction or Playwright large-row scroll checks

### Clipboard And Editing Follow-up

- **Editor input normalize** — [`meta.editNormalize` / format presets](#editor-input-normalize--format-presets-metaeditnormalize) (demo `loginId` 배경)
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
- **Row Status Context API** (위 Backlog) — 컬럼·페이지용 `rowStatus` 컨텍스트

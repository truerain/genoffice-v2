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

남은 작업은 코어 정합성 보강(P0), API/UX 확장(P1), 중장기 확장(P2)으로 관리한다.

## Active Backlog (Prioritized)

### P0. 코어 정합성 우선

_P0 항목은 2026-07-09 구현 완료. 이력: `../log/planning-history.md`, `../log/implementation-log.md`._

### P1. API/UX 확장

### Row Status Cell Display Context

Status: complete (2026-07-09).

목표: body cell **표시·스타일** 콜백에도 `rowStatus`를 주입해 `meta.editable`과 동일 정본을 사용한다.

Scope (구현):

- `GenDataGridCellContext` (= `GenDataGridEditableContext`)
- `meta.renderCell`, `meta.cellClassName`, `meta.cellStyle`
- `DataGridBodyRow` — `renderCell` > TanStack `cell` > `formatCellValue` 우선순위
- `demo` `userColumns` `userId` — `meta.renderCell` + `rowStatus === 'created'`

Deferred:

- grid prop `getCellClassName` / `getCellStyle`
- `meta.cellStyle` 외 `backgroundColor`/`color` sugar meta

### Built-in Editor Column Meta Extensions

Status: planned.

배경 (2026-07-09, `apps/demo` `userColumnEditors.tsx`):

- `loginId` 소문자·`empNo` 10자 제한을 app `renderEditor`로 구현하면 built-in keyboard/blur 계약이 중복된다.
- `maxLength`처럼 **선언 한 줄**로 충분한 제약도 custom editor가 필요하다.
- paste·printable-key 진입은 editor를 거치지 않아 app `validateCommit` / commit mapper 보조가 반복된다.

**패키지 소유:** `@gen-office/gen-datagrid`. **`gen-datagrid-crud`는 editor 미제공** — [CRUD package design](../../gen-datagrid-crud/.docs/gen-datagrid-crud-package-design.md).

목표: built-in `DefaultCellEditor`가 소비하는 **column meta**를 확장해, format·길이·숫자 범위 등을 `renderEditor` 없이 선언한다. 모든 입력 경로(typing, paste, printable-key)에 **동일 파이프라인** 적용.

#### 기구현 meta (참고 — 변경 없음)

| Meta | 설명 |
| --- | --- |
| `editable` | 편집 가능 여부 (함수형 포함) |
| `editType` | `text` \| `number` \| `date` \| `select` \| `textarea` \| `checkbox` |
| `editOptions` / `getEditOptions` | select 옵션 |
| `editPlaceholder` | input/textarea placeholder |
| `editSelectOnFocus` | focus 시 전체 선택 (grid prop override) |
| `editCommitOnBlur` | blur 시 commit (grid prop override) |
| `editPolicy` | 진입·이동·openOnEditStart·blurOwnership |
| `editBlurOwnership` | column blur ownership override |
| `renderEditor` | custom editor (built-in meta보다 우선) |

Grid props 대응: `editSelectOnFocus`, `editCommitOnBlur`, `editPolicy`, `editorFactory`, `isCellEditable`.

#### 추가 개발 후보 meta

| Meta | 타입 | 적용 `editType` | 우선순위 | 설명 · demo 배경 |
| --- | --- | --- | --- | --- |
| **`editMaxLength`** | `number` | `text`, `textarea` | **1차** | 최대 글자 수. HTML `maxLength` + `slice`. **empNo 10자** |
| **`editNormalize`** | `(value, ctx) => unknown` | text 계열 | **1차** | 값 변환 파이프라인. **loginId lowercase** |
| **`editType` preset** | `lowercaseText` \| `uppercaseText` \| `digitsOnly` \| `alphanumeric` | — | **1차** | `editNormalize` sugar |
| **`editTrimOnCommit`** | `boolean` | `text`, `textarea` | **1차** | commit 시 `trim()` (공백-only 방지 보조) |
| **`editPattern`** | `RegExp` 또는 preset id | `text`, `textarea` | 2차 | 허용 문자 정규식. `digitsOnly`는 preset으로 |
| **`editMinLength`** | `number` | `text`, `textarea` | 2차 | 최소 길이 — **validation** 연동 권장 (입력 차단만으로는 부족) |
| **`editMin`** / **`editMax`** | `number` | `number`, `date` | 2차 | HTML `min` / `max` |
| **`editStep`** | `number` | `number` | 2차 | HTML `step` |
| **`editRows`** / **`editCols`** | `number` | `textarea` | 2차 | textarea 크기 힌트 |
| **`editInputMode`** | `'text'` \| `'numeric'` \| `'decimal'` \| `'email'` \| `'tel'` \| `'url'` | `text`, `number` | 2차 | 모바일 키보드 힌트 (`inputMode`) |
| **`editEmptyOption`** | `{ label, value? }` | `select` | 2차 | 빈 값 placeholder option |
| **`editSelectClearable`** | `boolean` | `select` | 2차 | 선택 해제 허용 |
| **`editParse`** / **`editFormat`** | `(value, ctx) => …` | `number`, `date`, `text` | 2차 | 표시값 ↔ 편집값 (천단위 등). paste coercion과 연계 |
| **`editAutoComplete`** | `string` \| `'off'` | `text` | 3차 | HTML `autocomplete` |
| **`editAutoCapitalize`** / **`editAutoCorrect`** / **`editSpellCheck`** | boolean | `text`, `textarea` | 3차 | 모바일·맞춤법 (loginId: off) |
| **`editAriaLabel`** | `string` | 전체 | 3차 | `aria-label` override (기본: `{columnId} editor`) |
| **`editClassName`** | `string` | 전체 | 3차 | editor DOM 추가 class |

**범위 외 (app / custom `renderEditor`):** mask(전화번호)·popover lookup·modal editor·공통코드 `getEditOptions`·도메인 validation message.

#### 값 처리 파이프라인 (구현 계약)

모든 inbound 값에 동일 순서 적용:

```text
raw input
  → editNormalize (및 editType preset)
  → editMaxLength slice
  → editPattern 필터 (거부 시 이전 draft 유지 또는 partial accept — architecture에서 확정)
  → draft
commit 시 (선택) editTrimOnCommit
paste / printable-key / flushEditing 경로도 동일 hook
```

`GenDataGridEditorContext`에 resolved `maxLength`, `normalize`, `pattern` 등을 전달해 custom `renderEditor`도 동일 meta를 재사용할 수 있게 한다.

공통 헬퍼 export (`@gen-office/gen-datagrid` 또는 `@gen-office/utils`):

- `normalizeLowercase`, `normalizeUppercase`, `normalizeDigitsOnly`, `normalizeMaxLength(n)`

#### 구현 slice

| Slice | 항목 | 산출 |
| --- | --- | --- |
| **4.3-a** | `editMaxLength`, `editNormalize`, preset `editType`, `editTrimOnCommit` | `DefaultCellEditor`, paste, context, tests |
| **4.3-b** | `editMin`/`editMax`/`editStep`, `editRows`/`editCols`, select empty/clearable | number/textarea/select built-in |
| **4.3-c** | `editPattern`, `editInputMode`, HTML attribute meta | 고급 text 제약 |
| **4.3-d** | `createBuiltinTextEditor` factory, keyboard/blur helper export | custom editor 복제 제거 |

#### Scope

- `GenDataGrid.types.ts` — meta·context 타입
- `features/editing/renderEditor.tsx`, `editorContext.ts`, `cellRuntime.ts` — resolve·적용
- paste pipeline (`features/range-selection/` 등) — inbound 정규화
- `cell-edit-api.md`, `editor-implementation-contract.md`, `api-structure.md`
- interaction 테스트: typing, paste, Tab/Enter/Escape, CRUD `flushEditing` + Save
- 소비처: `apps/demo` `userColumns` — `userColumnEditors.tsx` 제거·meta 전환 (별도 app PR)

#### Deferred

- IME 조합 중간 상태·regex 거부 UX 세밀 정책
- `editMinLength` 입력 차단 vs commit validation only 정책
- `@gen-office/datagrid-editors` 분리 패키지

#### Exit criteria

- `meta: { editType: 'text', editNormalize: lowercase, editMaxLength: 10 }`만으로 demo `loginId`·`empNo` 동작.
- paste·Save(`flushEditing`) 후에도 동일 제약이 유지된다.
- built-in keyboard/blur 테스트 회귀 없음.

참고 소비처:

- `apps/demo/src/pages/admin/user/userColumnEditors.tsx`
- `apps/demo/src/pages/admin/user/userColumns.ts` (`loginId`, `empNo`)

### MasterDetail Expand Toggle Customization

Status: planned.

배경 (2026-07-09, `apps/demo` UserPage):

- `enableMasterDetail` 사용 시 확장 버튼(`.gen-datagrid__detail-toggle`)은 `DataGridBodyRow`에서
  **첫 user cell**(`firstUserCellIndex`)에 고정 렌더링된다.
- 버튼 UI는 `+/-` 텍스트 + 고정 className으로 그려져, 소비처는 CSS override 외에는
  위치/마크업/아이콘을 제어할 수 없다.
- 화면별로 "확장 버튼 전용 선행 컬럼", "특정 컬럼 anchor", "커스텀 아이콘(chevron)" 요구가 존재한다.

목표: MasterDetail 확장 버튼의 **위치(anchor)·표현(style/icon)·렌더링 방식**을 public API로
재정의할 수 있게 한다.

제안 API (architecture에서 확정):

1. `detailToggleColumnId?: string`
   - 기본값: 현재 정책(`firstUserCellIndex`)
   - 지정 시 해당 columnId 셀에 토글 렌더링
2. `renderDetailToggle?: (ctx) => ReactNode`
   - `row`, `rowId`, `expanded`, `toggle()`, `canExpand` 전달
   - 미지정 시 기존 기본 버튼 유지
3. `detailToggleProps?: { ariaLabelExpand?, ariaLabelCollapse?, className? }`
   - 기본 렌더러 세부 제어용 (가벼운 확장)

Scope:

- `GenDataGrid.types.ts` — MasterDetail toggle 관련 prop 타입
- `renderers/div-grid/DataGridBodyRow.tsx` — `firstUserCellIndex` 고정 로직 분리, anchor/renderer 적용
- `index.css` — 기본 toggle 스타일 토큰화(`--gen-datagrid-detail-toggle-*`)
- `stories/GenDataGrid.baseline.stories.tsx` — Gate 8.2 변형(기본/컬럼 anchor/커스텀 렌더러)
- `test/interaction.test.tsx` — 클릭/키보드/focus/stopPropagation 회귀
- `reference/api-structure.md`, `reference/cell-edit-api.md`(상호작용 영향 범위) 갱신

Deferred:

- row별 동적 anchor (함수형) — 2차
- tree toggle과 master-detail toggle의 개별 pinning zone 정책 — 2차
- 디자인시스템 아이콘 패키지 강결합(기본 API는 headless 유지)

Exit criteria:

- 소비처가 확장 버튼 위치를 `detailToggleColumnId`로 바꿀 수 있다.
- 소비처가 `renderDetailToggle`로 아이콘/버튼 마크업을 교체할 수 있다.
- 기존 기본 동작(first-user-cell + `+/-`)은 설정 없이 유지된다.
- virtualization/tree/master-detail 조합에서 토글 동작 회귀가 없다.

### P2. 중장기 Follow-up (계속)

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

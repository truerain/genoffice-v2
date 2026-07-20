<!--
 @file packages/ui/.docs/logs/implementation-log.md
 @description Implementation and migration change log for @gen-office/ui.

 @created 2026-06-23
-->
# UI 구현 로그

## 2026-07-20

### PageLayoutChrome — 헤더 표시 컨텍스트

- `PageLayoutChromeProvider` / `usePageLayoutChrome` 추가. `PageLayout`이 `showHeader=false`일 때 header 슬롯만 생략(filter·content 유지).
- 앱 설정으로 전역 토글할 때 페이지별 수정 없이 사용.
- 관련 파일: `composed/pageLayout/PageLayoutChrome.tsx`, `PageLayout.tsx`, `pageLayout/index.ts`

## 2026-07-12

### FilterBar 라벨 font 토큰

- theme `--filter-bar-label-font-size|weight|color` 추가, `.filterItemLabel`에 연결. 기존 `--font-size-base`/폴백 불일치 해소(`sm` 기준).
- 관련 파일: `FilterBar.module.css`, `packages/theme/.../filter-bar.css`, `filter-bar.md`

### ModalInput — hideTrigger (grid lookup)

- `hideTrigger` / `defaultSearchValue` / `commitOnItemClick` / `draggable` / `dialogContentRef` 추가. DialogContent에 `data-gen-datagrid-editor-surface`.
- 관련 파일: `ModalInput.tsx`, `ModalInput.types.ts`, `ModalInput.test.tsx`, `modal-input.md`

## 2026-07-01

### RangeDatePicker DateRange 타입 정렬

- `RangeDatePicker` public `DateRange`를 `@daypicker/react` 타입으로 re-export해 `Calendar` `selected` prop과 불일치하던 TS2322를 수정했다.
- `Calendar.stories.tsx` range 예제 state 타입도 동일하게 맞췄다.
- 관련 파일: `src/composed/datePicker/RangeDatePicker.types.ts`, `src/core/calendar/Calendar.stories.tsx`

### PageLayout / PageHeader composed 추가

- `composed/pageLayout`에 MDI 탭 workarea용 `PageLayout`, `PageHeader`를 추가했다.
- `contentVariant` scroll/fill, header/filter slot, theme token 기반 padding/gap (`--page-layout-padding`, `--page-layout-gap`)을 지원한다.
- demo `AdminPageLayout`·`PageHeader`를 제거하고 `@gen-office/ui` import로 전환했다.
- 관련 파일: `src/composed/pageLayout/*`, `src/index.ts`, `apps/demo/src/pages/**`, `apps/demo/src/styles/demo-ui.css`

## 2026-06-25

### V1 이관 마감 정리

- orphan `composed/popupInput/` 삭제 (export·git 미추적 잔존). `combobox/`는 canonical 유지 (Windows에서는 `comboBox`와 동일 경로)
- `review-log.md` 작성; `migration-plan.md` §11 후속 트랙으로 갱신

### C9 TreeView Storybook 수동 Gate 완료

- `UI/Composed/TreeView`, `WithSplitLayout` — expand/collapse all, selection, light/dark 확인
- `tree-view.md` §6 Gate 전항목 완료 → **C9 Gate 마감**

### C9 TreeView Gate

- `composed/treeView/*` — V2 정리: 헤더, `core/tree` import, expand/collapse `aria-label`
- `TreeView.test.tsx` 5건, stories `UI/Composed/TreeView` (+ `WithSplitLayout`)
- `tree-view.md` Gate 문서

### ui `panels/` 롤백 — composed 단일 구조

- SplitLayout `composed/splitLayout` 복귀; `panels/`·`.docs/panels/` 제거
- TreeView → `composed/treeView` (C9); RichTextEditor → `@gen-office/html-editor` (ui 밖)
- `migration-plan.md` §6, `architecture.md`, `decisions.md` 갱신

### `src/panels/` 디렉터리 분리

- `composed/splitLayout` → `panels/splitLayout`; test `test/panels/`; Story `UI/Panels/SplitLayout`
- `migration-plan.md` §6a composed / §6b panels; `.docs/panels/README.md`

### C8 ModalInput Storybook 수동 Gate 완료

- `UI/Composed/ModalInput` — search, single/multi, table columns, confirm/cancel, clear, tooltip, scroll layout, light/dark 확인
- `modal-input.md` §6 Gate 전항목 완료 → **C8 Gate 마감**

### ModalInput multi selectedTooltip

- MultiCombobox와 동일: `selectedTooltip='auto'`, `formatSelectedTooltip`, modal open 시 비활성, test 3건

### ModalInput dialog scroll layout

- 모달 전체 스크롤 제거: `.dialog` flex column + `overflow: hidden`, header/footer 고정
- 목록(`.listWrap`)만 스크롤; `modalHeight` 기본값 제거(optional), 지정 시 `max-height` 상한

### C8 ModalInput Gate

- `composed/modalInput/*` — V2 정리: 파일 헤더, default export 제거, named export only
- PopupInput 제외 결정 반영 — C8 ModalInput 단독
- `ModalInput.test.tsx` 7건, stories `UI/Composed/ModalInput`
- `modal-input.md`, `migration-plan.md` C8, `filter-bar.md` custom 안내 갱신

### C7 TreeCombobox Storybook 수동 Gate 완료

- `UI/Composed/TreeCombobox`, `WithTreeComboField` — expand, filter, keyboard, clear, light/dark, selectLeafOnly 확인
- `tree-combobox.md` §6 Gate 전항목 완료 → **C7 Gate 마감**

### TreeCombobox selectLeafOnly

- default `true`: branch 클릭/Enter → expand; leaf만 선택
- `selectLeafOnly={false}` opt-out; FilterBar `tree-combo` field prop

### TreeCombobox first-open panel UX

- `expandRootsOnOpen` (default): root + selection path auto-expand on open
- popover min-height 6 rows; `expandRootsOnOpen={false}` opt-out

### C7 TreeCombobox Gate

- `composed/treeCombobox/*` — V1 이관본 정리: 헤더, `PopoverAnchor`, `autoSelect={false}`, default export 제거
- `TreeCombobox.test.tsx` 5건, stories; StandardFilterBar `tree-combo` + `WithTreeComboField`
- `tree-combobox.md`, `filter-bar.md` 갱신

### C6 Combobox Storybook 수동 Gate 완료

- `UI/Composed/Combobox`, `WithComboFields` — filter, keyboard, clear, grouped, light/dark 확인
- `combobox.md` §6 Gate 체크리스트 전항목 완료 → **C6 Gate 마감**

### MultiCombobox selected tooltip

- `selectedTooltip` (`auto` 기본): 2개 이상 선택 시 hover/focus tooltip에 전체 label 목록
- `formatSelectedTooltip`, popover open 시 tooltip 비활성, label 없을 때 `aria-label` 보강
- tooltip `side="top"` — option list popover(아래)와 구분

### C6 Combobox / MultiCombobox Gate

- `composed/comboBox/*` — V1 이관본 정리: 파일 헤더, `PopoverAnchor`, Input `autoSelect={false}`, default export 제거
- `Combobox.test.tsx` 5건, `Combobox.stories.tsx`; StandardFilterBar `combo` / `multi-combo` 연동
- Story `WithComboFields`, `filter-bar.md`·`combobox.md` Gate 문서

### FilterBar `date` · `month` · range 필드 연동

- `date-range` → `RangeDatePicker`, `month-range` → `RangeMonthPicker`; range pickers `fullWidth`
- Story `WithDateAndMonth`에 date/month/range 4종 포함

### C5b DatePicker Storybook 수동 Gate

- `UI/Composed/DatePicker` — single/range/month, light/dark, keyboard; V1 UX 회귀 없음 확인
- C5b Gate `date-picker.md` §5 완료

### C5b DatePicker — MaskedInput 연동

- `composed/datePicker/*` — DatePicker·MonthPicker `MaskedInput`; Range* `Input` readOnly + suffix trigger
- `datePickerUtils.ts`, `CalendarTrigger` (forwardRef for PopoverTrigger)
- split `.field` CSS 제거; `clearable`·`separator` prop; `react-day-picker` import 제거
- `DatePicker.test.tsx` 6건, `DatePicker.stories.tsx`; MaskedInput `onKeyDown` 병합
- Input↔Calendar 동기화: popover open 시 `display` parse → `draftValue`·`calendarMonth`; `onComplete` 연동

### C5a MaskedInput Storybook 수동 Gate

- title `UI/Core/maskedInput/MaskedInput` — focus, dark, a11y 이상 없음 확인
- `masked-input.md` §8 수동 항목 완료

### C5a MaskedInput 구현

- `core/maskedInput/` — `MaskedInput`, `useMaskInput`, types, stories
- core `Input` wrapper; preset `ymd` · `ym`; display string + `MaskState` / `onComplete`
- `MaskedInput.test.tsx` 6건 통과 (ymd/ym typing, paste, clearable, suffix, onComplete)
- Gate checklist `masked-input.md` §8 갱신 (수동 Storybook·cross-link 제외)

### C5a/C5b 플랜 — MaskedInput · DatePicker

- C5 → **C5a** core MaskedInput + utils `format/mask` → **C5b** DatePicker 리팩터
- `.docs/core/masked-input.md`, `.docs/composed/date-picker.md`, `migration-plan.md` §5c, `decisions.md`, deferred D-003

### FilterBar C4 마무리 — CSS · 테스트 보강

- `filterItemTitle` → `filterItemLabel` (CSS module)
- `StandardFilterBar` test: `enterToSearch`, collapsible, `clearLabel`
- C4 Gate checklist `filter-bar.md` 갱신

### FilterField `label` · 위젯 옵션 정리

- `FilterField`·`FilterBar.Item`: `title` → `label` (form 관례); 미연결 `maxVisibleItems`·`optionItemHeight`·`options.group` 제거
- `clearable`·`clearLabel` → text · search (`Input`·`SearchInput`); default clearable `true`
- stories·tests·`filter-bar.md` 갱신

### FilterBar Storybook · 문서 정리

- 제거된 `BorderlessCollapsible*` 전용 스토리 이름을 `filter-bar.md`·로그에서 정리
- `FilterBar.stories.tsx` 미사용 `CollapsibleFieldItems`·`borderlessPageDecorator` 삭제
- panel border는 `StandardFilterBar` CSS·compound `className`으로 구분; collapse는 `Collapsible` 등 기존 스토리로 확인

### FilterBar · StandardFilterBar Storybook 수동 Gate (Wave 5 — C4)

- 수동 확인 완료 — compound · select · light/dark · multi-row wrap
- title `UI/Composed/FilterBar`, `UI/Composed/StandardFilterBar`

### FilterBar collapse chevron toggle

- `collapseToggle` `border` (bottom-edge) | `actions-icon`; `divider` deprecated
- `FilterBarCollapseToggle.tsx`, theme `--filter-bar-collapse-toggle-size`

### FilterBar simple/detail collapse

- `collapsible`, `collapsedCount`, field `simple`, toggle in actions column
- `filterBarCollapse.ts`, stories `Collapsible`, tests

### FilterBar 2-zone layout · size preset

- `filterFields` (12-col grid) + `filterActionsColumn`; `actionsPlacement` column | inline
- `FilterBarFieldSize` xs~xl + fill; theme `filter-bar.css`; `resolveFilterItemSize.ts`
- stories·tests·`filter-bar.md`·`decisions.md` 갱신

### FilterBar · StandardFilterBar Gate (Wave 5 — C4)

- V1 `composed/FilterBar` 이식 — compound + `StandardFilterBar` (V1 SimpleFilterBar)
- `clsx`, 토큰, `SearchInput` 비공개, combo 필드 C6 placeholder
- stories, tests, `.docs/composed/filter-bar.md`
- `filterRow` `align-items: flex-end`, 검색 버튼 `fullWidth` 제거 — Item·actions 겹침 방지
- `StandardFilterBar` 기본 bordered panel (`StandardFilterBar.module.css`)
- `FilterBar.Item` `layout` vertical | horizontal, `itemLayout` 기본값

### Filter composed 명명 — FilterBar · StandardFilterBar

- V1 `SimpleFilterBar` → `StandardFilterBar`; `SearchInput` 비공개 export
- `migration-plan.md` C4·§10, `decisions.md`, `grouped-select.md`, `deferred.md`

### `MasterDetailLayout` V2 제외 (문서)

- V1 미사용 wrapper — Wave 5에서 제외; `migration-plan.md`·`split-layout.md`·`decisions.md` 반영

### SplitLayout Gate (Wave 5 — C3)

- `composed/splitLayout` — stories, test, `.docs/composed/split-layout.md`, export
- Storybook: Default, Resizable, PercentWidth, Vertical, ResizableVertical, HiddenResizeLine

### AlertDialog · ConfirmDialog Gate (Wave 5 — C1/C2)

- `composed/alertDialog`, `composed/confirmDialog` — headers, `clsx`, focus ring, V1 `처리중...`
- stories `UI/Composed/*`, `test/composed/*`, `.docs/composed/alert-dialog.md`, `confirm-dialog.md`

### composed 파일 헤더 `@remark` 보강

- `alertDialog`, `confirmDialog`, `splitLayout` — AGENTS.md 규약에 맞게 export·의존·Storybook title 등 `@remark` 추가

### Dialog header `padding-right` 조정

- `Dialog.module.css` — `:has(.close)`일 때만 close(2rem) 공간 예약; `showClose={false}`(AlertDialog)는 균일 padding
- 여분 `0.25rem` gap 제거

### ToastViewport `portalled` — Storybook frame 탈출

- `createPortal(document.body)` — `fixed`만으로는 Storybook canvas transform/overflow에 갇힘
- `RadixSlide` story에 `portalled` 적용

### Toast Storybook preview · RadixSlide

- `Toast.stories.module.css` — compact frame / fullscreen / Radix slide animation
- `RadixSlide` — `toastUseBrowserViewport`, `portalled` viewport

### Breadcrumb · Tabs · Tree Gate (Wave 4)

- Gate — headers, `clsx`, tests, `.docs/core/{breadcrumb,tabs,tree}.md`, stories

### Calendar — @daypicker/react v10

- v10 `classNames`, `.docs/core/calendar.md`, tests/stories

### Tooltip · Toast · Progress (Wave 5-ext)

- Radix compound/tooltip·toast, Progress variant/size
- `UI/Core5-feedback/*`, test/docs/export

## 2026-06-24

### GroupedSelect 구상 문서 · Deferred D-002

- `.docs/composed/grouped-select.md` — multi-field Select chrome (Popover + StandardSelect × N)
- `deferred.md` D-002, `select.md`·`README.md` cross-link

### Popover · DropdownMenu · Select Gate (Wave 3-13~15)

- V1 이식 — `clsx`, 파일 헤더, `:focus-visible` 토큰, stories/test/docs/export
- `SimpleSelect` → **`StandardSelect`** (index·stories 정리)
- Storybook: `UI/Core3-overlays/{Popover,DropdownMenu,Select,StandardSelect}`

### Drawer Gate (Wave 3-12) — 완료

- `Drawer.tsx` — V1 custom 이식, `clsx`, close `:focus-visible`, overlay `data-testid`
- `Drawer.stories.tsx`, `Drawer.test.tsx`, `.docs/core/drawer.md`, `src/index.ts` export
- Storybook 수동 Gate 통과, title `UI/Core3-overlays/Drawer`

### SimpleRadioGroup → StandardRadioGroup

- `StandardRadioGroup.tsx`, stories, `StandardRadioGroup.test.tsx` — `RadioGroup` primitive 유지
- `index.ts`, `.docs/core/radio.md`, `migration-plan.md` 갱신

### StandardDialog 스토리 높이 · 리사이즈 측정

- `StandardDialog.stories.tsx` — `initialHeight`, `DemoBody`, Storybook decorator(`minHeight: 32rem`)
- `StandardDialog.tsx` — resizable 측정 시 `initialHeight` 미만으로 축소되지 않도록 보정

### Dialog close 버튼 헤더 정렬

- `Dialog.module.css` — close inset을 header padding과 동기화, header `min-height`·`padding-right` 예약

### Dialog Gate · StandardDialog rename

- `SimpleDialog` → `StandardDialog`; `Dialog` primitive 유지
- tests, `StandardDialog.stories.tsx`, `.docs/core/dialog.md`, README

### Dialog rename 롤백 · 명칭 검토안

- `BaseDialog*` rename 원복 — `Dialog` + `SimpleDialog` 유지
- `decisions.md` — Dialog/BaseDialog 명칭 검토안(미적용)

### Deferred 목록 생성 (UI 이관 완료 후 진행)

- `.docs/deferred.md` — D-001 Slider thumb 값 tooltip/value bubble
- `.docs/README.md`, `migration-plan.md`, `core/slider.md` 링크

### Button core 문서 추가

- `.docs/core/button.md` — API·variant/size·asChild·loading·토큰·Gate·V1 대비
- `.docs/README.md` — button.md 링크 (Wave 1 템플릿)

## 2026-06-23

### Radio · Slider core 이식 (사용자) — clsx·헤더·문서·test

- **Radio:** `Radio.tsx`, types, css, `SimpleRadioGroup` — 헤더, V1 hex → theme 토큰, `useId()` id 스코프
- **Radio stories:** `UI/Core/Radio`, `UI/Core/SimpleRadioGroup`, core `Label`
- **Slider:** 헤더, `--color-brand-secondary` → `--color-primary`, focus ring 토큰
- `slider.stories.tsx` → `Slider.stories.tsx`, `UI/Core/Slider`
- `test/core/Radio.test.tsx`, `SimpleRadioGroup.test.tsx`, `Slider.test.tsx`
- `.docs/core/radio.md`, `slider.md`

### Switch core 이식 (사용자) — clsx·헤더·문서·test

- `Switch.tsx`, `Switch.types.ts`, `Switch.module.css`, `index.ts` — 파일 헤더, V1 hex → theme 토큰
- `index.tsx` → `index.ts` (패키지 convention)
- `Switch.stories.tsx` — core `Label` 연동, `AllStates`·`FormExample` 추가
- `test/core/Switch.test.tsx`, `.docs/core/switch.md`
- `pnpm -C packages/ui test` (29) · `build` 통과

### Checkbox core 이식 (사용자) — clsx·헤더·문서·test

- `Checkbox.tsx` — `cn` → `clsx`, 파일 헤더
- `Checkbox.types.ts` — `ComponentPropsWithoutRef` 명시 import
- `Checkbox.module.css` — V1 마젠타 hex → `--button-focus-ring`, `--color-primary-dark`, `--color-fg-inverse`
- `checkbox.stories.tsx` → `Checkbox.stories.tsx`, title `UI/Core/Checkbox`
- `test/core/Checkbox.test.tsx`, `.docs/core/checkbox.md`

### Checkbox stories 점검

- `Checkbox.stories.tsx` — `UI/Core/Checkbox`, 파일 헤더, core `Label` 연동
- `ErrorChecked`, `WithRequiredLabel`, `FormExample` 스토리 추가
- standalone 스토리에 `aria-label` (autodocs·a11y)

### ui build — theme CSS `@import` resolve

- `vite.config.ts`, `vitest.config.ts` — `@gen-office/theme/index.css` → `../theme/src/index.css` alias
- PostCSS가 패키지명을 로컬 경로로 해석하던 오류 수정 (`pnpm -C packages/ui build` 통과)

### Input·Textarea core 이식 (사용자) — 정리

- 파일 헤더, `UI/Core/*` 스토리, `Texttarea.stories.tsx` → `Textarea.stories.tsx` 오타 수정
- focus ring V1 magenta rgba → `--button-focus-ring` / status `color-mix`
- `Label.stories` → core `Input` 사용
- `test/core/Input.test.tsx`, `Textarea.test.tsx`, `.docs/core/input.md`, `textarea.md`

### Wave 0 — Vitest 스캐폴드

- `vitest.config.ts`, `test/setup.ts`, `test/core/Button.test.tsx`
- `package.json` — `test`, `test:watch` 스크립트 및 RTL·vitest devDeps
- `test/core/Label.test.tsx`, `Separator.test.tsx`, `Badge.test.tsx` 추가

### Badge core 이식 (사용자) — 헤더·export·문서 정리

- `src/index.ts`에 badge export 추가 (누락)
- status variant `color: white` → `var(--color-fg-inverse)`
- `UI/Core/Badge` 스토리, secondary·outline argTypes/AllVariants
- `.docs/core/badge.md`, 로그·architecture 갱신

### Separator core 이식 (사용자) — 헤더·문서 정리

- `Separator.types.ts` — `ComponentPropsWithoutRef` 명시 import
- `Separator.stories.tsx` — `UI/Core/Separator`, Variants 스토리, `decorative` argType
- 파일 헤더·`.docs/core/separator.md`, `SeparatorVariant` export
- `pnpm -C packages/ui build` 통과

### Label core 이식 (사용자) — 오류·문서 정리

- `Label.tsx` — `forwardRef` 타입 `HTMLLabelElement` (기존 `HTMLButtonElement` 오류 수정)
- `Label.stories.tsx` — `UI/Core/Label`, Input/Checkbox 미이식 → native `StoryInput` 헬퍼
- 파일 헤더·`.docs/core/label.md` 추가, architecture·README 갱신
- `pnpm -C packages/ui build` 통과

### Button `brand` variant·토큰 제거

- `Button.types.ts`, `Button.module.css`, `Button.stories.tsx` — `brand` 전면 삭제
- theme `--button-brand-*` alias 제거 (primary만 사용)

### Button core 이식 (사용자) — 헤더·구조 점검

- `src/core/button/` — Button.tsx, types, module.css, stories, index.ts
- `src/index.css` 추가 (theme import)
- `vite.config.ts` — `@vitejs/plugin-react` 제거, theme 패턴 lib build (vite/internal 오류 해결)
- `src/vite-env.d.ts` — CSS Modules 타입
- `pnpm -C packages/ui build` 통과

### 이관 Plan·아키텍처 문서

- `.docs/architecture.md` — core/composed, Radix 패턴, Vitest + Storybook Gate
- `.docs/migration-plan.md` — Wave 0~5, core 20 + composed 순서
- `.docs/README.md` — 문서 인덱스
- `package.json` React 19 / Storybook 10 정렬 (선행)

### 다음

- Wave 0: vite/vitest 스캐폴드
- Wave 1-1: **Button** 첫 Gate

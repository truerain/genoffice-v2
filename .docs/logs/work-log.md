<!--
 @file .docs/logs/work-log.md
 @description Repository-level implementation work log for GenOffice V2.

 @created 2026-06-23
-->
# GenOffice V2 작업 로그

## 2026-06-27

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

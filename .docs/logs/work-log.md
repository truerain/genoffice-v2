<!--
 @file .docs/logs/work-log.md
 @description Repository-level implementation work log for GenOffice V2.

 @created 2026-06-23
-->
# GenOffice V2 작업 로그

## 2026-06-25

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

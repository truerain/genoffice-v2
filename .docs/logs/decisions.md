<!--
 @file .docs/logs/decisions.md
 @description Architecture and technology decision log for GenOffice V2.

 @created 2026-06-23
-->
# GenOffice V2 결정 로그

역시간순. 같은 날짜 섹션 안에서도 **최신 항목이 위**.

## 2026-06-25

### @gen-office/ui V1 이관 마감

- **Wave 5 composed C1~C9** Gate 완료 (AlertDialog … TreeView)
- **제외·별도:** PopupInput 제거, RichTextEditor → `@gen-office/html-editor`
- **정리:** orphan `popupInput/` 삭제; canonical `combobox/` 유지
- **다음 패키지 리뷰:** `mdi`
- 문서: `packages/ui/.docs/review-log.md`, `migration-plan.md` §11

### @gen-office/ui 소스 구조 — `composed/` 단일, RichTextEditor ui 밖

- **`src/panels/` 도입 보류·롤백** — SplitLayout `composed/splitLayout` 유지; TreeView도 `composed/treeView`
- **UX 구분은 문서로** — TreeCombobox(필드) vs TreeView(탐색 패널); 물리 폴더 분리는 규모상 불필요
- **RichTextEditor** — V1 composed 이관 대신 **`@gen-office/html-editor` 별도 패키지**; `ui` Wave 5 Gate 제외
- 문서: `migration-plan.md` §6, `architecture.md`

### @gen-office/ui C5 — MaskedInput 선행 · DatePicker 순서

- **C5a** core **MaskedInput** (+ `@gen-office/utils` `format/mask`) — V1 없음; 1차 preset `ymd`·`ym`
- **C5b** composed DatePicker 계열 — MaskedInput + Calendar + Popover; V1 raw input split chrome **미사용**
- **구조 분리** — mask 엔진·MaskedInput은 DatePicker import 없음; `Date` parse/format은 composed만; date preset은 registry 한 종류
- value: MaskedInput = **display string**; DatePicker = **`Date`**
- 범용 mask(전화·사업자번호 등) → deferred **D-003**
- 문서: `packages/ui/.docs/core/masked-input.md`, `composed/date-picker.md`; `migration-plan.md` §5c·C5a/C5b

### @gen-office/ui FilterBar 레이아웃 표준 — 2-zone · size preset

- **fields / actions 분리** — `actionsPlacement="column"` 기본; actions는 fields **오른쪽 세로 column**
- **필드 너비** — `FilterBarFieldSize` (`xs`~`xl`, `fill`); theme `--filter-field-width-*`
- **정렬** — fields 영역 12-column CSS Grid, `align-items: end`; `flex`/`width`는 legacy
- **`inline`** — V1 한 줄 flex 호환; 신규 화면은 `column` + `size` 사용
- **simple/detail** — chevron on bottom border (`border`); borderless = `border-bottom` only; `divider` removed

### @gen-office/ui Filter composed 명명 — `FilterBar` + `StandardFilterBar`

- **FilterBar** + `FilterBar.Item` — V1 compound 레이아웃 유지 (grid action **bar**·데이터 **row**와 구분)
- V1 **SimpleFilterBar** → **StandardFilterBar** (`StandardDialog`·`StandardSelect` 패턴)
- V1 **SearchInput** — 내부 전용, public export 없음
- `FilterRow`·`FilterGroup` 등 대안은 grid `row` 혼동·`*Group` 의미 축으로 보류

### @gen-office/ui `MasterDetailLayout` V2 미이관

- V1 `composed/MasterDetailLayout` — `SplitLayout` + optional `title`/`actions` 헤더 thin wrapper
- **앱/demo 사용 0건**; admin 화면은 `SplitLayout` 직접 + `PageHeader` 패턴
- V2 Wave 5에서 **제외**; `migration-plan.md` C4 삭제·이후 순번 조정

## 2026-06-24

### @gen-office/ui StandardRadioGroup 적용

- `SimpleRadioGroup` → `StandardRadioGroup` (`RadioGroup` + `Radio` primitive 유지)
- 앱 폼 기본 라디오 API; 커스텀 레이아웃은 `RadioGroup` + `Radio`

### @gen-office/ui StandardDialog 적용

- `SimpleDialog` → `StandardDialog` (Dialog primitive 이름 유지)
- 앱 화면 기본 모달 API; composed·커스텀은 `Dialog*` compound

## 2026-06-23

### @gen-office/theme primary → near-black (Danger와 구분)

- **`--color-primary`:** `#171717` (light hover `#262626`, tint `var(--base-neutral-100)`)
- **dark mode primary:** `#fafafa` (CTA invert), hover `#ffffff`
- **이유:** 마젠타 primary(`#C6004D`)와 Bootstrap danger(`#DC3545`) 시각적 혼동
- **button.css:** focus/outline/shadow 마젠타 rgba → neutral; dark outline overrides 추가
- **danger/status:** Bootstrap red 유지

### @gen-office/utils `cn` vs `clsx` 정책

- **`cn`:** V1 `ui`/`mdi` 이식 호환용으로 `@gen-office/utils`에 유지 (clsx thin wrapper).
- **V2 신규·수정:** className 병합은 각 패키지가 **`clsx` 직접 의존**해 사용. utils에 `cn` 확장·신규 export 하지 않음.
- ui 이식 완료 후 `cn` 모듈 제거 검토.

### @gen-office/theme 색상 토큰 정책

- **1층 팔레트:** CSS 변수가 유일한 source of truth. 색 값은 `#rrggbb` hex.
- **강조색(primary):** ~~`#C6004D`~~ → **`#171717`** (near-black CTA; danger red와 분리). dark mode CTA `#fafafa`.
- **status:** Bootstrap 계열 유지 (`#28a745`, `#ffc107`, `#dc3545`, `#17a2b8`).
- **brand 토큰 제거:** `--color-brand`·`--button-brand-*` 삭제. Button·CTA는 primary만 사용.
- **JS 프리셋 제거:** `lightTheme` / `darkTheme` export 삭제. `useTheme()`만 런타임 JS API.
- **ChartTokens:** `@gen-office/theme`에서 제거. `@gen-office/gen-chart` 패키지에서 정의·소유.
- **Theme 타입:** `colors.brand` → `colors.primary` (`default` / `light` / `dark`).

관련 문서: `packages/theme/.docs/ref/token-sources-and-decisions.md`

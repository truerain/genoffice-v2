<!--
 @file packages/ui/.docs/composed/filter-bar.md
 @description Architecture and usage notes for FilterBar and StandardFilterBar.

 @created 2026-06-25
-->
# FilterBar · StandardFilterBar (`composed/filterBar`)

검색/필터 composed입니다. V1 `FilterBar` / `SimpleFilterBar` 이식이며 V2에서는 **`StandardFilterBar`** 로 이름을 맞춥니다.

| 컴포넌트 | 역할 |
| --- | --- |
| **FilterBar** | compound 레이아웃 (`FilterBar.Item`, `actions`) |
| **StandardFilterBar** | `fields[]` 선언형 (V1 `SimpleFilterBar`) |
| **SearchInput** | 내부 전용 (`type: 'search'`), **export 없음** |

## 레이아웃 모델 (2-zone)

```text
FilterBar
├── filterFields        ← 필드 (12-column CSS Grid, wrap)
└── filterActionsColumn ← actions (필드 오른쪽, 세로 stack) — 기본 `actionsPlacement="column"`
```

| `actionsPlacement` | 설명 |
| --- | --- |
| `column` (기본) | fields 오른쪽에 actions를 **세로 column**으로 배치 (`align-items: flex-end`로 컨트롤 bottom 정렬) |
| `inline` | V1 호환 — fields와 같은 flex row (`margin-left: auto`) |

## 필드 너비 (`size`)

`flex` / `width` 문자열 대신 **`size` preset**을 1차 API로 사용합니다.

| size | grid span (12-col) | theme token |
| --- | --- | --- |
| `xs` | 2 | `--filter-field-width-xs` (120px) |
| `sm` | 2 | `--filter-field-width-sm` (160px) |
| `md` (기본) | 3 | `--filter-field-width-md` (200px) |
| `lg` | 4 | `--filter-field-width-lg` (280px) |
| `xl` | 6 | `--filter-field-width-xl` (360px) |
| `fill` | 6 | keyword 등 — `minmax(md, 1fr)` |

`flex` / `width`는 legacy escape hatch (`size` 미지정 시만). `flex > 0` → `fill`로 매핑.

## 파일

```text
packages/ui/src/composed/filterBar/
├── FilterBar.tsx
├── FilterBar.types.ts
├── FilterBar.module.css
├── FilterBarCollapseToggle.tsx
├── filterBarCollapse.ts
├── resolveFilterItemSize.ts
├── FilterBar.stories.tsx
├── StandardFilterBar.tsx
├── StandardFilterBar.module.css
├── StandardFilterBar.stories.tsx
├── SearchInput.tsx          ← internal
└── index.ts
```

Public export: `FilterBar`, `StandardFilterBar`, `FilterBarFieldSize`, `FilterBarActionsPlacement`, `FilterField`, …

## FilterBar (compound)

| Prop | 설명 |
| --- | --- |
| `children` | `FilterBar.Item` 목록 |
| `actions` | 검색·초기화 등 |
| `itemLayout` | Item label 배치 기본값 |
| `actionsPlacement` | `column` \| `inline` |
| `collapsible` | simple/detail 토글 활성화 |
| `collapsedCount` | simple 모드 기본 노출 개수 (default `3`) |
| `defaultExpanded` / `expanded` / `onExpandedChange` | detail 펼침 상태 |
| `collapseToggle` | 토글 UI — 아래 표 |
| `borderedPanel` | StandardFilterBar — full panel border; skips extra bottom border on root |
| `expandLabel` / `collapseLabel` | chevron `aria-label`·`title` (default `상세` / `간단히`) |

### `collapseToggle`

| 값 | 적용 | UI |
| --- | --- | --- |
| `border` (기본) | compound · StandardFilterBar | chevron on **bottom border** — borderless는 `border-bottom`만, panel은 전체 border 하단 |
| `actions-icon` | `inline` 또는 수동 | actions column 상단 icon chevron |

`divider` — **deprecated** (`border`와 동일). `inline` + `collapsible` 시 `actions-icon` 기본.

`FilterBar.Item`: `label`, **`size`**, `layout`, **`simple`**, `children`

| `layout` | 설명 |
| --- | --- |
| `vertical` (기본) | label 위 · 컨트롤 아래 |
| `horizontal` | label 왼쪽 · 컨트롤 오른쪽 |

### FilterField 공통 · 위젯 옵션

| Prop | 적용 type | 설명 |
| --- | --- | --- |
| `label` | 전체 | `FilterBar.Item` label (Input·Select `label` prop과 동일 관례) |
| `placeholder` | text · search · select | |
| `clearable` | text · search · **date · month · date-range · month-range** | default `true` |
| `clearLabel` | text · search | clear 버튼 `aria-label` |
| `locale` / `separator` | **date · month** | DatePicker / MonthPicker |
| `locale` / `formatOptions` | **date-range** | RangeDatePicker |
| `locale` | **month-range** | RangeMonthPicker |
| `fromMonth` / `toMonth` | **month · month-range** | MonthPicker / RangeMonthPicker |
| `options` | select | `FilterFieldOption[]` |
| `enterToSearch` | text | Enter 시 `onSearch` |

## StandardFilterBar (선언형)

| Prop | 타입 | 설명 |
| --- | --- | --- |
| `value` / `onChange` | `TFilters` | 필터 draft 상태 |
| `fields` | `FilterField<T>[]` | 필드 정의 (`size` 권장) |
| `onSearch` | `() => void` | 검색 버튼 (column actions) |
| `searchLabel` | `string` | 기본 `'Search'` |
| `actions` | `ReactNode` | `onSearch` 대체 actions 슬롯 |
| `itemLayout` / `actionsPlacement` | | FilterBar와 동일 |
| `collapsible` / `collapsedCount` / … | | FilterBar collapse 옵션 동일 |

### FilterField `simple`

`simple: true` — collapsible 시 **항상 simple 모드에 노출**. 하나라도 지정하면 `collapsedCount` 대신 `simple` 필드만 simple 모드에 표시.

### FilterField `type`

| type | 위젯 | 비고 |
| --- | --- | --- |
| `text` | `Input` | `enterToSearch` → Enter 시 `onSearch` |
| `search` | `SearchInput` (internal) | 아이콘 prefix |
| `select` | `StandardSelect` | |
| `date` | `DatePicker` | `Date \| undefined` value |
| `month` | `MonthPicker` | `Date \| undefined` (day=1) |
| `date-range` | `RangeDatePicker` | `DateRange \| undefined` |
| `month-range` | `RangeMonthPicker` | `MonthRange \| undefined` |
| `combo` / `multi-combo` | **C6 Combobox 전 placeholder** | `custom` 사용 권장 |
| `custom` | `render(value, onChange)` | PopupInput 등 |

## 스타일·토큰 (`@gen-office/theme`)

`packages/theme/src/styles/tokens/components/filter-bar.css`

| 토큰 | 용도 |
| --- | --- |
| `--filter-field-width-xs` … `xl` | 필드 preset 너비 |
| `--filter-field-gap` | fields grid gap |
| `--filter-bar-actions-gap` | actions 버튼 gap (column stack) |
| `--filter-bar-actions-min-width` | actions column 최소 너비 |
| `--filter-bar-border` / `bg` / `radius` | StandardFilterBar panel |

fields grid: `align-items: end` — 줄마다 컨트롤 bottom 정렬.

## Storybook

- **FilterBar:** `Compound`, `HorizontalItemLayout`, `ColumnActions`, `Collapsible`, `InlineActions`
- **StandardFilterBar:** `Default`, `HorizontalItemLayout`, `Collapsible`, `TextWithEnterSearch`, `WithDateAndMonth`

## Gate 체크리스트 (Wave 5 — C4)

- [x] 파일 헤더, `clsx`, theme 토큰, `@remark`
- [x] V1 `SimpleFilterBar` → `StandardFilterBar`, `SearchInput` 비공개
- [x] 2-zone layout, `size` preset, tests, stories, docs
- [x] Storybook 수동: compound · select · light/dark · multi-row wrap
- [x] `FilterField` `label` · `clearable`/`clearLabel` 연동, 내부 CSS `filterItemLabel`
- [ ] C6 이후: `combo` / `multi-combo` 실제 Combobox 연동 (C4 범위 밖)

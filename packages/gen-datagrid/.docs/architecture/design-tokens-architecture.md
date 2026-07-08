<!--
 @file packages/gen-datagrid/.docs/architecture/design-tokens-architecture.md
 @description GenDataGrid 디자인 토큰 계층(하이브리드) 구조·규칙 정본.

 @created 2026-07-09
-->
# GenDataGrid 디자인 토큰 아키텍처 (하이브리드)

GenDataGrid의 `--gen-datagrid-*` CSS 커스텀 프로퍼티 **계층·네이밍·theme 연동 규칙**을 정의한다. 구현 순서·체크리스트는 [plan/design-tokens-restructure-plan.md](../plan/design-tokens-restructure-plan.md)를 본다.

> **상태:** 초기 토큰 내부화(2026-07-08) 완료 후 **계층 재구조화** 대기. 본 문서는 구조 정본.
>
> 관련: [design-tokens-restructure-plan.md](../plan/design-tokens-restructure-plan.md) · [.docs/10-THEME-TOKEN-MIGRATION-PLAN.md](../../../../.docs/10-THEME-TOKEN-MIGRATION-PLAN.md) · [08-DESIGN-TOKENS-GUIDE.md](../../../../.docs/08-DESIGN-TOKENS-GUIDE.md) · [Gate 8.7 System Columns](gate-8-7-system-columns-architecture.md)

---

## 1. 배경

### 1.1 초기 토큰 내부화 (2026-07-08)

- theme `components/grid.css`(`--grid-*`) 삭제, V1 하위호환 금지.
- `packages/gen-datagrid/src/tokens.css` 신설, `index.css` hex → 토큰 치환.
- CSS 로드 **B 방식**: 패키지는 theme를 self-import하지 않고, 앱이 `@gen-office/theme/index.css`를 1회 로드.

### 1.2 재구조화가 필요한 이유

현재 `tokens.css`는 **팔레트(Foundation) → Chrome → Feature** 순으로 잡혀 있다.

| 문제 | 설명 |
| --- | --- |
| mini-theme 중복 | `--gen-datagrid-color-*`가 theme semantic(`--color-*`)을 재수출하는 별칭 레이어 |
| 영역 토큰 불완전 | footer·filter·pagination 등이 `--gen-datagrid-color-*`를 CSS에서 직접 참조 |
| System 컬럼 모호 | `--gen-datagrid-system-cell-*` 이름은 통합이나 body bg만 실제 적용 |
| AG Grid·gen-chart와 불일치 | 영역 prefix + feature 토큰 하이브리드가 업계·레포 내 관례에 더 가깝다 |

---

## 2. 확정 방향: 하이브리드

**AG Grid의 영역 prefix + GenDataGrid DOM 구조 + feature 토큰**을 결합한다.

```text
Shell (그리드 루트)
  bg, border, text, accent, font-size
  └── theme semantic 브리지는 Shell에만 (3~5개)

Regions (DOM 영역)
  Header
  Body
  Footer
  System (Header / Body / Footer override — AG Grid에는 없는 GenDataGrid 고유)

Chrome (Shell 하위 UI, 데이터 셀 밖)
  global-filter, pagination, footer-bar

Features (상태·기능)
  selection, current-row, editor, dirty, validation, row-status,
  merge-label, skeleton, master-detail toggles, …
```

### 2.1 AG Grid와의 관계

| 항목 | AG Grid | GenDataGrid (본 설계) |
| --- | --- | --- |
| 전역 | `backgroundColor`, `accentColor` | `--gen-datagrid-bg`, `--gen-datagrid-accent` |
| Header | `headerBackgroundColor`, `headerTextColor` | `--gen-datagrid-header-*` |
| Body | `cellTextColor`, `dataBackgroundColor` | `--gen-datagrid-body-*` |
| Footer / pinned | `footerRowBorder`, `pinnedRow*` | `--gen-datagrid-footer-*` |
| System 컬럼 | 별도 계층 없음 (`checkbox*`, `rowNumbers*`) | **영역별 override** + feature 토큰 |
| 파생 | `ref` / `mix` (JS API) | `var()` / `color-mix()` (CSS) |

System을 header/body/footer로 나누는 것은 AG Grid보다 촘촘하지만, 현재 `index.css` 선택자(`header-cell` / `cell` / `footer-row-cell`)와 일치한다.

### 2.2 theme 연동 (D4 정제)

| 규칙 | 내용 |
| --- | --- |
| Shell만 브리지 | `--gen-datagrid-bg`, `--gen-datagrid-surface`, `--gen-datagrid-border`, `--gen-datagrid-text`, `--gen-datagrid-text-muted` 정도만 `var(--color-*, #hex)` |
| 하위 레이어 | **절대 `--color-*` 직접 참조 금지**. `--gen-datagrid-*`만 참조 |
| accent / status | datagrid 고유 literal 또는 shell `accent`에서 `color-mix` 파생. theme `--color-status-*` 직접 연결 안 함 |
| 다크모드 | shell 브리지 semantic이 뒤집히면 하위가 연쇄 반영. feature 전용 raw 값만 필요 시 `[data-theme=dark]` 검토 |

---

## 3. 네이밍 규칙

```text
--gen-datagrid-{layer}-{element?}-{property}
```

| 접두 | 예 | 비고 |
| --- | --- | --- |
| (없음) | `--gen-datagrid-bg` | Shell |
| `header-` | `--gen-datagrid-header-bg` | Header 영역 |
| `body-` | `--gen-datagrid-body-cell-bg` | Body 데이터 셀 |
| `footer-` | `--gen-datagrid-footer-bg` | 집계 footer row |
| `system-header-` | `--gen-datagrid-system-header-bg` | System · Header override |
| `system-body-` | `--gen-datagrid-system-body-bg` | System · Body override |
| `system-footer-` | `--gen-datagrid-system-footer-text` | System · Footer override |
| `chrome-` | `--gen-datagrid-chrome-filter-bg` | global-filter 등 |
| `feature-` 또는 기능명 | `--gen-datagrid-selection-bg` | Feature (기능명 직접도 허용) |

**폐기 예정:** `--gen-datagrid-color-*`, `--gen-datagrid-system-cell-*`, `--gen-datagrid-cell-*`(→ `body-cell-*`로 이관)

**유지 (런타임 prop 연동):** `--gen-datagrid-row-height`, `--gen-datagrid-header-height`, `--gen-datagrid-footer-row-height`, `--gen-datagrid-detail-row-height`, `--gen-datagrid-current-row-height` — 토큰 파일에 정의하지 않고 inline style / CSS default로 유지.

---

## 4. 토큰 계층 상세

### 4.1 Shell

| 토큰 | 기본 파생 | theme 브리지 |
| --- | --- | --- |
| `--gen-datagrid-bg` | — | `var(--color-bg-primary, #ffffff)` |
| `--gen-datagrid-border` | — | `var(--color-border-default, #d0d7de)` |
| `--gen-datagrid-text` | — | `var(--color-fg-primary, #24292f)` |
| `--gen-datagrid-text-muted` | — | `var(--color-fg-secondary, #57606a)` |
| `--gen-datagrid-text-disabled` | — | `var(--color-text-disabled, #8c959f)` |
| `--gen-datagrid-accent` | — | `var(--color-primary, #0969da)` |
| `--gen-datagrid-surface` | — | `var(--color-bg-tertiary, #f6f8fa)` — header/footer/system/chrome 파생용 Shell 보조면 |
| `--gen-datagrid-font-size` | `14px` | — |

### 4.2 Header

| 토큰 | 기본 파생 |
| --- | --- |
| `--gen-datagrid-header-bg` | `var(--gen-datagrid-bg)` 또는 surface 톤 `color-mix` |
| `--gen-datagrid-header-text` | `var(--gen-datagrid-text)` |
| `--gen-datagrid-header-border` | `var(--gen-datagrid-border)` |
| `--gen-datagrid-header-group-bg` | `color-mix(text 4%, header-bg)` |
| `--gen-datagrid-header-font-weight` | `600` (V2 확정, theme 500 미승계) |

### 4.3 Body

| 토큰 | 기본 파생 |
| --- | --- |
| `--gen-datagrid-body-cell-bg` | `var(--gen-datagrid-bg)` |
| `--gen-datagrid-body-cell-text` | `var(--gen-datagrid-text)` |
| `--gen-datagrid-body-cell-border` | `var(--gen-datagrid-border)` |

공통 셀 border(`header-cell`, `cell`, `footer-row-cell`)는 각 영역 border 토큰을 참조.

### 4.4 Footer

| 토큰 | 기본 파생 |
| --- | --- |
| `--gen-datagrid-footer-bg` | surface 톤 (`color-mix` 또는 header-bg와 동일 정책) |
| `--gen-datagrid-footer-text` | `var(--gen-datagrid-text)` |
| `--gen-datagrid-footer-border` | `var(--gen-datagrid-border)` |
| `--gen-datagrid-footer-rowgroup-bg` | `var(--gen-datagrid-footer-bg)` |

### 4.5 System (영역별 override)

DOM: `data-system-column="true"` on `header-cell` / `cell` / `footer-row-cell`.

| 토큰 | 기본 파생 | 비고 |
| --- | --- | --- |
| `--gen-datagrid-system-header-bg` | `var(--gen-datagrid-header-bg)` | 현재 header는 system bg override 없음 → 명시적 동일값 |
| `--gen-datagrid-system-header-text` | `var(--gen-datagrid-header-text)` | |
| `--gen-datagrid-system-body-bg` | surface 톤 | 기존 `system-cell-bg` 역할 |
| `--gen-datagrid-system-body-text` | `var(--gen-datagrid-text-muted)` | |
| `--gen-datagrid-system-footer-bg` | `var(--gen-datagrid-footer-bg)` | |
| `--gen-datagrid-system-footer-text` | `var(--gen-datagrid-text-muted)` | |

**System 컬럼 타입별 (치수):**

| 토큰 | 기본값 | 대상 |
| --- | --- | --- |
| `--gen-datagrid-system-row-number-font-size` | `12px` | `.gen-datagrid__row-number` |
| `--gen-datagrid-system-row-status-dot-size` | `8px` | `.gen-datagrid__row-status` |
| `--gen-datagrid-system-row-selection-size` | `14px` | checkbox |

색상: row-status dot은 §4.7 Feature `row-status-*` 사용.

### 4.6 Chrome (데이터 영역 밖)

| 토큰 | 기본 파생 | 대상 CSS |
| --- | --- | --- |
| `--gen-datagrid-chrome-filter-bg` | `var(--gen-datagrid-bg)` | `.gen-datagrid__global-filter` |
| `--gen-datagrid-chrome-filter-border` | `var(--gen-datagrid-border)` | |
| `--gen-datagrid-chrome-filter-input-border` | `var(--gen-datagrid-border)` | input |
| `--gen-datagrid-chrome-pagination-bg` | `var(--gen-datagrid-bg)` | pagination, footer-bar |
| `--gen-datagrid-chrome-pagination-border` | `var(--gen-datagrid-border)` | |
| `--gen-datagrid-chrome-pagination-button-bg` | surface 톤 | button |
| `--gen-datagrid-chrome-pagination-button-text` | `var(--gen-datagrid-text)` | |

column filter UI(trigger, popover) 토큰 세분화 수준은 [plan §4 오픈 이슈](../plan/design-tokens-restructure-plan.md#4-오픈-이슈) 참고.

### 4.7 Features

| 그룹 | 토큰 | 비고 |
| --- | --- | --- |
| **Interaction** | `--gen-datagrid-active-color` | `var(--gen-datagrid-accent)` |
| | `--gen-datagrid-selection-bg` | accent 12% mix |
| | `--gen-datagrid-selection-bg-pinned` | accent 12% + bg |
| | `--gen-datagrid-current-row-bg` | accent 7% + bg |
| | `--gen-datagrid-editor-border-color` | `var(--gen-datagrid-accent)` |
| **Row status** | `--gen-datagrid-row-status-created` | literal `#1a7f37` (V2) |
| | `--gen-datagrid-row-status-updated` | literal `#bf8700` (amber, theme status와 분리) |
| | `--gen-datagrid-row-status-deleted` | literal `#cf222e` |
| **Dirty / deleted** | `--gen-datagrid-dirty-color`, `-dirty-row-bg` | warning 톤 literal |
| | `--gen-datagrid-deleted-row-text`, `-deleted-row-bg` | |
| **Validation** | `--gen-datagrid-validation-error-color` | literal danger |
| | `--gen-datagrid-validation-warning-color` | literal warning |
| **Skeleton** | `--gen-datagrid-placeholder-bar` | disabled text mix |
| **Visual row merge** | `--gen-datagrid-merge-label-bg/text/accent` | shell/body 참조로 파생 |
| **Master-detail / tree** | toggle border/bg/accent | `index.css` 규칙 토큰화 |

---

## 5. 소비자 오버라이드

```css
/* 전역 */
:root {
  --gen-datagrid-font-size: 13px;
}

/* 특정 그리드 */
[data-gen-datagrid-root='actuals'] {
  --gen-datagrid-body-cell-bg: #fafafa;
}

/* 페이지 래퍼 */
.actuals-page .gen-datagrid {
  --gen-datagrid-header-bg: #f0f0f0;
}
```

규칙: **가장 가까운 조상**에서 `--gen-datagrid-*` 재정의. Shell 토큰만 바꿔도 파생 체인으로 하위가 따라간다.

---

## 6. 소스 파일 구조 (목표)

```text
packages/gen-datagrid/src/
  index.css                 # 공개 CSS 엔트리 (선택자·레이아웃)
  styles/
    tokens.css              # :root --gen-datagrid-* 정의만 (§2 계층 주석)
```

- **위치 방침:** `src/tokens.css`가 아니라 `src/styles/tokens.css`. 엔트리와 토큰 역할을 분리하고, theme의 `styles/tokens/` 관례와 맞춘다. `themes/`는 gen-chart식 JS light/dark preset용이라 CSS 단일 파일에는 쓰지 않는다.
- **분할:** `styles/tokens/*.css`로 Shell/Feature를 나누는 것은 토큰 수가 크게 늘 때만 검토. 재구조화 1차는 단일 `styles/tokens.css` 유지.
- `index.css`는 `@import './styles/tokens.css'`만 하고, `--color-*` / `--gen-datagrid-color-*`를 직접 참조하지 않는다.

---

## 7. 참고

- 구현·마이그레이션·체크리스트: [design-tokens-restructure-plan.md](../plan/design-tokens-restructure-plan.md)
- System 컬럼 DOM 계약: [gate-8-7-system-columns-architecture.md](gate-8-7-system-columns-architecture.md)
- 레포 theme 마이그레이션: [.docs/10-THEME-TOKEN-MIGRATION-PLAN.md](../../../../.docs/10-THEME-TOKEN-MIGRATION-PLAN.md)

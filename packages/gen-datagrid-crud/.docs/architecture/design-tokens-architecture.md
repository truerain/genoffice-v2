<!--
 @file packages/gen-datagrid-crud/.docs/architecture/design-tokens-architecture.md
 @description GenDataGridCrud 디자인 토큰·theme 연동 구조 정본.

 @created 2026-07-09
-->
# GenDataGridCrud 디자인 토큰 아키텍처

`@gen-office/gen-datagrid-crud`의 CSS 커스텀 프로퍼티 **소유권·theme 연동·gen-datagrid 정렬** 규칙을 정의한다. 구현 순서는 [plan/design-tokens-restructure-plan.md](../plan/design-tokens-restructure-plan.md)를 본다.

> **상태:** 구현 완료 (2026-07-09). `src/styles/tokens.css` + `index.css` 토큰 치환·보더 정리.
>
> 관련: [gen-datagrid design-tokens-architecture.md](../../gen-datagrid/.docs/architecture/design-tokens-architecture.md) · [.docs/10-THEME-TOKEN-MIGRATION-PLAN.md](../../../../.docs/10-THEME-TOKEN-MIGRATION-PLAN.md) · [08-DESIGN-TOKENS-GUIDE.md](../../../../.docs/08-DESIGN-TOKENS-GUIDE.md)

---

## 1. 패키지 역할

GenDataGridCrud는 **얇은 셸**이다.

```text
.gen-datagrid-crud
  ├── .gen-datagrid-crud-actionbar   ← CRUD 전용 chrome (toolbar)
  └── .gen-datagrid-crud__grid
        └── .gen-datagrid            ← gen-datagrid 토큰·스타일 소유
```

- **그리드 내부** 색·보더·hover·current row → `gen-datagrid` (`--gen-datagrid-*`)
- **Action bar·셸 구분선** → `gen-datagrid-crud` (`--gen-datagrid-crud-*`)

CRUD가 theme `--color-*`를 직접 쓰지 않는다. theme 브리지는 **gen-datagrid Shell**에만 두고, CRUD는 **gen-datagrid Shell을 재참조**한다.

---

## 2. 현재 문제 (2026-07-09 검토)

`src/index.css`만 존재하며 `@import '@gen-office/gen-datagrid/index.css'` 후 CRUD 선택자가 theme를 직접 참조한다.

| 현재 참조 | 문제 |
| --- | --- |
| `var(--color-border-default, #d7dde5)` | 폴백 hex가 gen-datagrid border(`#d0d7de`)와 불일치 |
| `var(--color-surface, #fff)` | semantic이 아닌 **base** 변수. `semantic.css`에 `--color-bg-secondary` 등으로 매핑됨 |
| `var(--color-fg-default, #1f2937)` | **존재하지 않는 이름** → 항상 폴백 hex (다크·테마 미반영) |
| `var(--color-fg-secondary, #64748b)` | semantic은 `--color-fg-secondary` 있으나 폴백이 gen-datagrid muted와 다름 |

추가:

- `.gen-datagrid-crud__grid { border-top }` + `.gen-datagrid { border }` → **이중 보더** 가능
- 패키지 전용 `styles/tokens.css` 없음 → gen-datagrid 하이브리드 계층과 불일치

---

## 3. 확정 방향

### 3.1 원칙 (gen-datagrid D4 정제 확장)

| 규칙 | CRUD |
| --- | --- |
| theme self-import | **금지** (B 방식). 앱이 `@gen-office/theme/index.css` 1회 로드 |
| theme `--color-*` 직접 참조 | **금지** (`index.css`·`tokens.css` 모두) |
| 값의 원천 | **`--gen-datagrid-*` Shell/Chrome 파생** (그리드와 동일 톤) |
| 네임스페이스 | **`--gen-datagrid-crud-*`** (패키지 소유) |
| gen-datagrid chrome 재사용 | `--gen-datagrid-chrome-*`를 CRUD에서 **직접 쓰지 않음**. CRUD chrome은 자체 토큰, 값만 grid Shell에서 파생 |

### 3.2 파일 구조 (목표)

```text
packages/gen-datagrid-crud/src/
  index.css                 # @import gen-datagrid + ./styles/tokens.css; 선택자만 토큰 참조
  styles/
    tokens.css              # :root --gen-datagrid-crud-*
```

`index.css` import 순서:

```css
@import '@gen-office/gen-datagrid/index.css';
@import './styles/tokens.css';
```

gen-datagrid CSS가 먼저 로드되어 `--gen-datagrid-*`가 정의된 뒤 CRUD 토큰이 파생된다.

### 3.3 계층

```text
Shell (CRUD 루트·공통)
  border, bg, text, text-muted
  └── gen-datagrid Shell 참조만 (theme 브리지 없음)

Chrome · Action bar
  bg, border, padding, title, total, divider

Layout · Shell 구분
  grid-separator (action bar ↔ grid 경계 1줄)
```

Feature 토큰(버튼 variant 등)은 **1차 범위 밖**. Action bar 버튼은 `@gen-office/ui` `Button`이 theme/component 토큰을 사용한다.

---

## 4. 네이밍 규칙

```text
--gen-datagrid-crud-{layer}-{element?}-{property}
```

| 접두 | 예 | 비고 |
| --- | --- | --- |
| (없음) | `--gen-datagrid-crud-border` | Shell |
| `actionbar-` | `--gen-datagrid-crud-actionbar-bg` | Action bar 영역 |
| `layout-` | `--gen-datagrid-crud-layout-grid-separator` | action bar / grid 구분 |

`--gen-datagrid-chrome-*` 이름을 CRUD에 재사용하지 않는다(의미: 그리드 global-filter/pagination).

---

## 5. 토큰 명세 (목표)

### 5.1 Shell — gen-datagrid 파생

| 토큰 | 파생 |
| --- | --- |
| `--gen-datagrid-crud-border` | `var(--gen-datagrid-border)` |
| `--gen-datagrid-crud-bg` | `var(--gen-datagrid-bg)` |
| `--gen-datagrid-crud-text` | `var(--gen-datagrid-text)` |
| `--gen-datagrid-crud-text-muted` | `var(--gen-datagrid-text-muted)` |
| `--gen-datagrid-crud-surface` | `var(--gen-datagrid-surface)` |

### 5.2 Chrome · Action bar

| 토큰 | 파생 | 대상 CSS |
| --- | --- | --- |
| `--gen-datagrid-crud-actionbar-bg` | `var(--gen-datagrid-crud-surface)` | `.gen-datagrid-crud-actionbar` |
| `--gen-datagrid-crud-actionbar-border` | `var(--gen-datagrid-crud-border)` | action bar border |
| `--gen-datagrid-crud-actionbar-padding` | `8px` | padding |
| `--gen-datagrid-crud-actionbar-gap` | `8px` / `6px` | gap (bar / actions) |
| `--gen-datagrid-crud-actionbar-title-font-size` | `14px` | title |
| `--gen-datagrid-crud-actionbar-title-font-weight` | `600` | title |
| `--gen-datagrid-crud-actionbar-title-color` | `var(--gen-datagrid-crud-text)` | title |
| `--gen-datagrid-crud-actionbar-total-font-size` | `12px` | total |
| `--gen-datagrid-crud-actionbar-total-color` | `var(--gen-datagrid-crud-text-muted)` | total |
| `--gen-datagrid-crud-actionbar-divider` | `var(--gen-datagrid-crud-border)` | total 왼쪽 구분선 |

### 5.3 Layout · Grid 구분선

| 토큰 | 파생 | 비고 |
| --- | --- | --- |
| `--gen-datagrid-crud-layout-grid-separator` | `var(--gen-datagrid-crud-border)` | action bar 하단 **또는** grid 상단 **한 곳만** |

**보더 정책 (확정):**

- Action bar: `border` 3면(top/left/right) + **하단은 layout separator 1줄**로 grid와 연결
- `.gen-datagrid-crud__grid`: **`border-top` 제거** (이중선 방지)
- `.gen-datagrid`: 외곽선은 gen-datagrid `border` 유지. CRUD wrapper 안에서 grid 상단은 action bar separator와 맞닿음

---

## 6. 현재 → 목표 매핑

| 현재 (`index.css`) | 목표 토큰 |
| --- | --- |
| `var(--color-border-default, #d7dde5)` | `--gen-datagrid-crud-border` / `actionbar-border` / `layout-grid-separator` |
| `var(--color-surface, #fff)` | `--gen-datagrid-crud-actionbar-bg` |
| `var(--color-fg-default, #1f2937)` | `--gen-datagrid-crud-actionbar-title-color` |
| `var(--color-fg-secondary, #64748b)` | `--gen-datagrid-crud-actionbar-total-color` |
| `.gen-datagrid-crud__grid border-top` | **삭제** (separator는 action bar 쪽) |

---

## 7. theme / 다크모드

- CRUD 토큰은 `--gen-datagrid-*`만 참조한다.
- 앱이 theme를 로드하면 gen-datagrid Shell semantic이 뒤집히고, CRUD는 **연쇄 반영**된다.
- CRUD 자체 `[data-theme=dark]` 블록은 **1차 불필요**.

---

## 8. 소비자 오버라이드

```css
/* 특정 CRUD 화면 */
.actuals-crud .gen-datagrid-crud {
  --gen-datagrid-crud-actionbar-bg: #f8fafc;
}

/* 그리드와 함께 톤 변경은 Shell 재정의로 충분 */
.actuals-crud {
  --gen-datagrid-bg: #fafafa;
}
```

`:root`에서 `--gen-datagrid-crud-*`만 바꿔도 action bar만 조정 가능. Shell 토큰을 바꾸면 grid+CRUD가 같이 따라간다.

---

## 9. 비목표 (1차)

- Action bar `Button` variant 토큰화 (ui/theme 소유 유지)
- `gen-datagrid-crud` 자체 theme self-import
- theme `--color-*` 별칭 레이어를 CRUD에 재도입
- filter/export 전용 chrome 토큰 (후속)

---

## 10. 참고

- 구현 계획: [design-tokens-restructure-plan.md](../plan/design-tokens-restructure-plan.md)
- 그리드 토큰 정본: [gen-datagrid design-tokens-architecture.md](../../gen-datagrid/.docs/architecture/design-tokens-architecture.md)
- 레포 theme 마이그레이션: [.docs/10-THEME-TOKEN-MIGRATION-PLAN.md](../../../../.docs/10-THEME-TOKEN-MIGRATION-PLAN.md)

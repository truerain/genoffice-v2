<!--
 @file apps/demo/.docs/guide/app-styles-naming.md
 @description CSS file and token naming for apps/demo as reference-app template.

 @created 2026-07-09
-->
# App Styles Naming — Reference App Template

`apps/demo`는 GenOffice V2 **레퍼런스·쇼케이스 앱**이면서, `apps/<고객앱>`을 만들 때 **복사 템플릿**으로 쓸 수 있습니다.  
스타일 파일·토큰·data-attribute 네이밍은 **앱 템플릿 레이어**와 **데모 전용 쇼케이스 레이어**를 구분합니다.

> 레포 공통 theme 규칙: [.docs/08-DESIGN-TOKENS-GUIDE.md](../../../../.docs/08-DESIGN-TOKENS-GUIDE.md)

---

## 1. `src/styles/` 파일 레이아웃

| 파일 | 역할 | fork 시 |
| --- | --- | --- |
| `app.css` | html/body/#root 리셋·전역 font | **유지** |
| `theme-overrides.css` | (선택) `:root` `--color-*` 브랜딩 | 고객사 primary 등 |
| `app-shell.css` | Shell `--app-*`, chrome/workarea/MDI | **유지**, 값 조정 |
| `datagrid-overrides.css` | `--gen-datagrid-*`·pinned edge 등 | **유지**, 필요 시 채움 |

**import 순서 (`main.tsx`):**

```text
@gen-office/theme/index.css
@gen-office/ui/index.css
… (mdi, gen-frame, gen-chart)
@gen-office/gen-datagrid-crud/index.css
./styles/app.css
./styles/theme-overrides.css    ← 선택
./styles/app-shell.css
./styles/datagrid-overrides.css
```

패키지 CSS **뒤**, 페이지 CSS Module **앞**에 둡니다.

---

## 2. 네이밍 접두사

| 접두 | 범위 | 예 | fork |
| --- | --- | --- | --- |
| `--color-*` | theme semantic (앱에서 override) | `--color-primary` | `theme-overrides.css` |
| `--app-*` | **앱 셸** alias (chrome/workarea/surface) | `--app-workarea-bg` | `app-shell.css` |
| `data-app-*` | 셸 DOM 스코프 | `data-app-workarea` | AppShell 등 |
| `--gen-datagrid-*` | 그리드 패키지 | `--gen-datagrid-border` | `datagrid-overrides.css` |
| `--gen-datagrid-crud-*` | CRUD 셸 | `--gen-datagrid-crud-actionbar-bg` | `datagrid-overrides.css` |
| `data-demo-*` | **쇼케이스 페이지만** (`pages/demo/*`) | `data-demo-chart-page` | fork 시 삭제 가능 |
| `Demo*` 컴포넌트 | 쇼케이스 UI (`DemoSurface`) | — | fork 시 유지·교체 선택 |

**규칙:** `--demo-*` / `demo-ui.css`는 **사용하지 않음** (2026-07-09 `app-shell.css` + `--app-*`로 통일).

---

## 3. `app-shell.css` vs `datagrid-overrides.css`

| | `app-shell.css` | `datagrid-overrides.css` |
| --- | --- | --- |
| 대상 | gen-frame chrome, workarea, MDI 탭, `--app-*` | gen-datagrid / gen-datagrid-crud |
| theme | `[data-gen-frame-root]`·`[data-app-workarea]`에서 `--color-*` remap | theme `--color-*` **직참조 금지** |
| 토큰 | `--app-chrome-bg`, `--app-mdi-tab-*` | `--gen-datagrid-*`, `--gen-datagrid-crud-*` |
| 선택자 | shell·MDI·sidebar | `[data-pinned-edge]`, `[data-grid-id]` |

그리드 배경·보더는 workarea의 `--color-*` remap → gen-datagrid Shell 브리지로 **간접** 반영됩니다. pinned shadow처럼 토큰이 없는 규칙만 `datagrid-overrides.css`에 둡니다.

---

## 4. `theme-overrides.css` (선택)

08 가이드와 동일. **브랜드 semantic만** `:root` / `[data-theme='dark']`에서 덮습니다.

```css
:root {
  --color-primary: #a50034;
}
```

chrome/workarea 톤은 `app-shell.css`의 `--app-*`가 담당합니다. 두 파일 역할을 섞지 않습니다.

---

## 5. Fork 체크리스트

1. `apps/demo` → `apps/<name>` 복사
2. `package.json` name·scripts 경로 조정
3. `app-shell.css` — `--app-chrome-*`, `--app-workarea-bg` 브랜딩
4. `theme-overrides.css` — `--color-primary` 등 (필요 시)
5. `datagrid-overrides.css` — pinned edge·그리드 토큰 (필요 시)
6. `pages/demo/*`, `DemoSurface` — 쇼케이스 유지 여부 결정
7. `data-app-workarea` — AppShell에 유지 (셸 계약)

---

## 6. 관련 문서

- [ui-direction.md](./ui-direction.md) — Soft Modern 셸 시각 방향
- [08-DESIGN-TOKENS-GUIDE.md](../../../../.docs/08-DESIGN-TOKENS-GUIDE.md) — theme / package 토큰
- [gen-datagrid design-tokens-architecture.md](../../../../packages/gen-datagrid/.docs/architecture/design-tokens-architecture.md)

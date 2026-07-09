<!--
 @file packages/gen-datagrid-crud/.docs/plan/design-tokens-restructure-plan.md
 @description GenDataGridCrud 디자인 토큰·theme 정렬 실행 계획.

 @created 2026-07-09
-->
# GenDataGridCrud 디자인 토큰 재구조화 계획

`index.css`의 theme semantic 직참조를 제거하고, **gen-datagrid Shell 파생 + `--gen-datagrid-crud-*`** 체계로 맞추는 실행 계획이다.

> **구조 정본:** [architecture/design-tokens-architecture.md](../architecture/design-tokens-architecture.md)
>
> **선행:** [gen-datagrid design-tokens-restructure-plan.md](../../gen-datagrid/.docs/plan/design-tokens-restructure-plan.md) (완료)

완료 이력은 `../implementation-log.md`에 기록한다.

---

## 1. 목표

| 항목 | 현재 | 목표 |
| --- | --- | --- |
| 토큰 파일 | 없음 | `src/styles/tokens.css` |
| theme `--color-*` | `index.css` 직접 참조 | **금지** |
| 값 원천 | 각자 폴백 hex | `--gen-datagrid-*` 파생 |
| 잘못된 이름 | `--color-fg-default` | `--gen-datagrid-crud-actionbar-title-color` |
| 보더 | grid `border-top` + grid 외곽 | action bar separator **1줄**, grid `border-top` 제거 |

---

## 2. 토큰 마이그레이션 매핑

| 현재 | 목표 | 조치 |
| --- | --- | --- |
| `--color-border-default` + `#d7dde5` | `--gen-datagrid-crud-border` 등 | rename + grid 파생 |
| `--color-surface` + `#fff` | `--gen-datagrid-crud-actionbar-bg` | rename |
| `--color-fg-default` + `#1f2937` | `--gen-datagrid-crud-actionbar-title-color` | **삭제(오타 토큰)** |
| `--color-fg-secondary` + `#64748b` | `--gen-datagrid-crud-actionbar-total-color` | rename |
| `.gen-datagrid-crud__grid { border-top }` | action bar 하단 border | grid 쪽 border-top **삭제** |

---

## 3. 실행 단계

로드맵 Phase·Gate와 무관한 **본 작업 내부 순서**이다.

### 단계 0 — 문서

- [x] architecture 문서 작성
- [x] 본 plan 문서 작성
- [x] `gen-datagrid-crud/.docs/README.md` 링크
- [x] `.docs/10` §6.6 · `08-DESIGN-TOKENS-GUIDE` crud 절

### 단계 1 — `styles/tokens.css` 신설

- [x] architecture §5 토큰 정의
- [x] `:root`에 `--gen-datagrid-crud-*` (gen-datagrid Shell만 참조)
- [x] `index.css`에 `@import './styles/tokens.css'` (gen-datagrid import **다음**)

### 단계 2 — `index.css` 치환

- [x] 모든 `var(--color-*)` 제거
- [x] action bar / title / total → crud 토큰
- [x] `.gen-datagrid-crud__grid` `border-top` 제거
- [x] action bar border: top/left/right + bottom separator 정책 반영

### 단계 3 — 번들·소비처

- [x] `pnpm -C packages/gen-datagrid-crud build` (CSS 인라인·토큰 확인)
- [ ] `apps/demo` CRUD 화면 라이트·다크 육안 (action bar ↔ grid 톤·보더)

### 단계 4 — 문서·로그

- [x] `implementation-log.md` 구현 기록
- [x] `.docs/logs/work-log.md`
- [x] 본 plan 체크리스트 완료 표시 (단계 3 육안 제외)

---

## 4. 검증

```bash
pnpm -C packages/gen-datagrid-crud build
pnpm -C packages/gen-datagrid-crud exec vitest run 2>&1
```

**수동:** demo에서 GenDataGridCrud — action bar 배경/제목/건수 색, action bar와 grid 경계 1줄, grid 외곽선, 다크 토글.

**dist 확인 (예시):**

- `--gen-datagrid-crud-actionbar-bg` 인라인
- `--color-fg-default` **없음**
- `--gen-datagrid-border` 파생 체인 존재

---

## 5. 변경 파일 (예상)

| 파일 | 작업 |
| --- | --- |
| `packages/gen-datagrid-crud/src/styles/tokens.css` | 신규 |
| `packages/gen-datagrid-crud/src/index.css` | import + 토큰 치환 + border 정리 |
| `packages/gen-datagrid-crud/.docs/{architecture,plan,README,implementation-log}.md` | 갱신 |

---

## 6. 오픈 이슈

| # | 이슈 | 기본 방침 |
| --- | --- | --- |
| O1 | action bar만 surface, grid는 bg — 현재와 동일 톤 유지 | `actionbar-bg` → `gen-datagrid-surface` |
| O2 | border-radius / shadow | 1차 없음 (flat shell) |
| O3 | `@gen-office/ui` Button이 action bar와 색 어긋남 | ui는 별도; CRUD shell만 정렬 |

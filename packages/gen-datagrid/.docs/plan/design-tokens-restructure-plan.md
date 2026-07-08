<!--
 @file packages/gen-datagrid/.docs/plan/design-tokens-restructure-plan.md
 @description GenDataGrid 디자인 토큰 계층 재구조화 실행 계획.

 @created 2026-07-09
-->
# GenDataGrid 디자인 토큰 재구조화 계획

초기 토큰 내부화(2026-07-08) 이후, **하이브리드 계층**으로 `tokens.css`·`index.css`를 정리하는 실행 계획이다.

> **구조 정본:** [architecture/design-tokens-architecture.md](../architecture/design-tokens-architecture.md)
>
> **레포 연동:** [.docs/10-THEME-TOKEN-MIGRATION-PLAN.md](../../../../.docs/10-THEME-TOKEN-MIGRATION-PLAN.md) §6.5 (내부 라벨: WS1.2)

완료된 구현 이력은 `../log/implementation-log.md`에 기록한다.

---

## 1. 목표

| 항목 | 현재 | 목표 |
| --- | --- | --- |
| 최상위 | `--gen-datagrid-color-*` (semantic 재수출) | Shell `--gen-datagrid-bg/border/text/accent` |
| theme semantic | 전 레이어 | **Shell만** `var(--color-*, #hex)` 브리지 |
| Body | `--gen-datagrid-cell-*` | `--gen-datagrid-body-cell-*` |
| System | `--gen-datagrid-system-cell-*` | `system-header/body/footer-*` |
| Footer/Chrome | foundation 직접 참조 | `--gen-datagrid-footer-*`, `--gen-datagrid-chrome-*` |

---

## 2. 토큰 마이그레이션 매핑

| 현재 | 목표 | 조치 |
| --- | --- | --- |
| `--gen-datagrid-color-bg` | `--gen-datagrid-bg` | rename + shell 브리지 |
| `--gen-datagrid-color-border` | `--gen-datagrid-border` | rename |
| `--gen-datagrid-color-text` | `--gen-datagrid-text` | rename |
| `--gen-datagrid-color-text-muted` | `--gen-datagrid-text-muted` | rename |
| `--gen-datagrid-color-text-disabled` | `--gen-datagrid-text-disabled` | rename |
| `--gen-datagrid-color-accent` | `--gen-datagrid-accent` | rename |
| `--gen-datagrid-color-surface` | `--gen-datagrid-surface` (Shell 보조면) | rename; header/footer/system/chrome가 파생 |
| `--gen-datagrid-color-success/warning/danger` | (삭제) | feature literal로 대체 |
| `--gen-datagrid-header-bg/text` | 동일 이름 유지 | 파생 출처 변경 |
| `--gen-datagrid-cell-bg/text` | `--gen-datagrid-body-cell-bg/text` | rename |
| `--gen-datagrid-system-cell-bg/text` | `--gen-datagrid-system-body-bg/text` | rename + header/footer 추가 |
| `--gen-datagrid-status-*` | `--gen-datagrid-row-status-*` | rename 권장 |
| feature 토큰 (selection, dirty, …) | 동일 또는 `row-status` rename | 최소 변경 우선 |

**호환성:** V1 `--grid-*` 미지원. `--gen-datagrid-color-*` 별칭 **유지하지 않음** — 한 번에 치환.

---

## 3. 실행 단계

로드맵 Phase·Gate와 무관한 **본 작업 내부 순서**이다.

### 단계 0 — 문서

- [x] architecture 문서 작성
- [x] 본 plan 문서 작성
- [x] `.docs/10` §6.5 · `decisions.md` D4 정제

### 단계 1 — `styles/tokens.css` 재작성·이동

- [x] `src/tokens.css` → `src/styles/tokens.css`로 이동 (architecture §6)
- [x] architecture §4 계층 주석 순서로 토큰 재정의
- [x] `--gen-datagrid-color-*` 제거, shell 브리지만 semantic 참조
- [x] system header/body/footer, chrome, footer 토큰 추가
- [x] `index.css`의 `@import`를 `./styles/tokens.css`로 갱신

### 단계 2 — `index.css` 치환

- [x] 모든 `--gen-datagrid-color-*` → 영역/shell 토큰
- [x] system 선택자별 토큰 분리 (`header-cell` / `cell` / `footer-row-cell`)
- [x] `rgb(31 35 40 / 12%)` 등 잔여 literal 검토 (shadow는 중립 유지 가능)

### 단계 3 — 번들·소비처

- [x] `pnpm -C packages/gen-datagrid build`
- [x] `pnpm -C packages/gen-datagrid-crud build` (CSS 인라인 확인)
- [ ] `apps/demo` 라이트·다크 육안 확인

### 단계 4 — 문서·로그

- [x] `08-DESIGN-TOKENS-GUIDE.md` grid 절 갱신
- [x] `implementation-log.md` 구현 기록
- [x] `.docs/10` §6.5 체크리스트 완료 표시

---

## 4. 오픈 이슈

| # | 이슈 | 기본 방침 |
| --- | --- | --- |
| O1 | column filter UI 토큰 세분화 수준 | 1차: chrome/body 규칙에 맞는 최소 세트만 |
| O2 | `--gen-datagrid-status-*` → `row-status-*` rename 여부 | 가독성 향상; 1차는 rename 권장 |
| O3 | zebra striping 토큰 | 미구현 — 요구 시 body feature로 추가 |
| O4 | pinned column border 전용 토큰 | AG Grid `pinnedColumnBorder` 대응 — 후속 |

---

## 5. 검증

```bash
pnpm -C packages/gen-datagrid build
pnpm -C packages/gen-datagrid-crud build
pnpm -C packages/gen-datagrid exec tsc -p tsconfig.json --noEmit
pnpm check:encoding
```

**육안 확인 (데모/스토리):** global filter, system columns, dirty, validation, footer row, pagination, dark toggle.

---

## 6. 변경 파일 (예상)

| 파일 | 작업 |
| --- | --- |
| `packages/gen-datagrid/src/styles/tokens.css` | 계층 재작성 (`src/tokens.css`에서 이동) |
| `packages/gen-datagrid/src/tokens.css` | 삭제 |
| `packages/gen-datagrid/src/index.css` | `@import` 경로 + 토큰 참조 치환 |
| `.docs/08-DESIGN-TOKENS-GUIDE.md` | grid 절 갱신 |
| `packages/gen-datagrid/.docs/log/implementation-log.md` | 구현 로그 |
| `.docs/logs/work-log.md` | 레포 작업 로그 |

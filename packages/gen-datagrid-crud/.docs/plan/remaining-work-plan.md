<!--
 @file packages/gen-datagrid-crud/.docs/plan/remaining-work-plan.md
 @description Remaining GenDataGridCrud backlog after Gate 10–12.
 @updated 2026-07-12
-->

# GenDataGridCrud Remaining Work Plan

이 문서는 Gate 10~12 완료 이후 `@gen-office/gen-datagrid-crud`의 **추가 개발·백로그**를 관리한다.
완료된 Gate 계획은 `../gate-10-thin-shell-plan.md`, `../gate-11-crud-mutation-plan.md`,
`../gate-12-app-integration-plan.md`에 있으며, 구현 이력은 `../implementation-log.md`에 기록한다.

선행 그리드 엔진 백로그: [`../../gen-datagrid/.docs/plan/remaining-work-plan.md`](../../gen-datagrid/.docs/plan/remaining-work-plan.md)

## Current Status

GenDataGridCrud는 thin shell + mutation + demo 연동(Gate 12)까지 완료된 상태다.

- `GenDataGridCrud` wrapper · `useDataGridCrudController` · `DataGridCrudActionBar`
- created row store · dirty overlay · commit/validation · ActionBar
- `masterDetail` config prop (2026-07-10)
- `createdRowPosition` top prepend / bottom append + 문서·테스트 (2026-07-12)
- Package surface: `onStateChange` 가이드 · headless ActionBar Storybook (2026-07-12)
- App integration: workflow patterns · QA 갱신 · readonly ActionBar 기본값 (2026-07-12)

## Actionable Now (numbered)

| # | 항목 | 상태 |
| --- | --- | --- |
| **1** | Add Row — Insert Position 보완 (문서·테스트·top prepend) | **complete** (2026-07-12) |
| **2** | Package Surface Cleanup (`onStateChange` 가이드, custom ActionBar Storybook) | **complete** (2026-07-12) |
| **3** | App Integration Expansion (workflow 문서 · QA · readonly ActionBar) | **complete** (2026-07-12) |

## Blocked / Deferred

| 항목 | 상태 |
| --- | --- |
| Add Row — Focus First Editable | **blocked** — gen-datagrid `GenDataGridHandle`에 `focusCell`/`startEditing` 없음 |
| Dirty State — Field Baseline Revert | gen-datagrid P0 **완료** — CRUD 추가 작업 없음 (문서 stale 정리됨) |
| Insert D/E (`afterCurrent` / `atIndex`) | deferred — created/data 블록 병합 한계 + gen-datagrid ownership |

---

## Backlog Detail

### 1. Add Row — Insert Position (삽입 위치) — complete (2026-07-12)

`createdRowPosition?: 'top' | 'bottom'` (default `'top'`).

| 값 | 표시 | 연속 Add |
| --- | --- | --- |
| `'top'` | `[...createdRows, ...data]` | **prepend** (`[row, ...current]`) — 최신이 0번 |
| `'bottom'` | `[...data, ...createdRows]` | **append** |

구현·검증:

- `useDataGridCrudController.addRow` prepend/append
- `thinShell.test.tsx` — bottom 순서 · top 연속 Add prepend · commit `created` 순서
- [Package Design § Created row position](../gen-datagrid-crud-package-design.md#created-row-position)

남은 2차:

- C: `addRow({ position? })` per-call — Focus 백로그와 동일 slice 권장
- D/E: arbitrary insert — blocked/deferred

Focus 연동 시 row index:

- `top` + prepend: `0`
- `bottom`: `data.length + createdRows.length - 1`

### 2. Package Surface Cleanup — complete (2026-07-12)

- `onStateChange` 발행 조건·ref 안전장치·소비자 권장: [Package Design § onStateChange](../gen-datagrid-crud-package-design.md#onstatechange-구독-가이드)
- Headless `useDataGridCrudController` + `DataGridCrudActionBar` + `GenDataGrid` 예시·Storybook `HeadlessControllerCustomActionBar`
- Excel 실파일 생성은 app/workflow 후속 (변경 없음)

### 3. App Integration Expansion — complete (2026-07-12)

- [workflow-patterns.md](../workflow-patterns.md) — readonly / export shell / mutation 패턴
- [app-integration-qa-guide.md](../app-integration-qa-guide.md) — demo 4화면 QA
- readonly 시 ActionBar 기본 `includeBuiltIns` = filter · columnReorder · excel (mutation 숨김)
- **demo D4 추가 admin 이식**(Lkup/Role/…)은 `apps/demo` plan follow-up — CRUD 패키지 actionable 밖

### Master-detail Config (`masterDetail` prop)

Status: **complete** (2026-07-10).

- Architecture: [../architecture/master-detail-config-architecture.md](../architecture/master-detail-config-architecture.md)
- Plan: [master-detail-config-plan.md](./master-detail-config-plan.md)

### Add Row — Focus First Editable Column (Edit Entry)

Status: **blocked** on gen-datagrid.

목표: Add 직후 첫 editable 사용자 컬럼으로 active + edit 진입.

선행: `GenDataGridHandle.focusCell(coord, { startEdit?: boolean })` 또는 동등 API.

제안: `focusFirstEditableOnAddRow?: boolean` 또는 `addRow(options?)`.

### Dirty State — Field Baseline Revert

Status: **resolved upstream** (gen-datagrid P0, 2026-07-09).

CRUD는 grid `dirtyState`만 소비. 추가 패치 없음.

### Editor 제공 (범위 외)

cell editor는 **gen-datagrid** 책임. CRUD는 `gridProps` / column `meta`로 위임.

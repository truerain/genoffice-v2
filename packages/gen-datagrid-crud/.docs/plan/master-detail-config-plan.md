<!-- packages/gen-datagrid-crud/.docs/plan/master-detail-config-plan.md
Executable plan for CRUD-level masterDetail config (gen-datagrid API unchanged).
-->

# GenDataGridCrud Master-detail Config Plan

Status: **complete** (2026-07-10).

Architecture: [../architecture/master-detail-config-architecture.md](../architecture/master-detail-config-architecture.md)

## 요약

`GenDataGridCrud`에 top-level **`masterDetail`** prop을 추가하고, 내부에서 gen-datagrid flat props로 normalize한다. **gen-datagrid 코드·public API 변경 없음.**

## 선행 조건

- gen-datagrid Gate 8.2 MasterDetail MVP ✅
- gen-datagrid P1 MasterDetail toggle API (`detailToggleColumnId`, …) ✅
- demo `UserPage`가 flat `gridProps`로 MasterDetail 사용 중 (마이그레이션 대상)

## 구현 slice

### Slice 1 — Types + resolver + CRUD wiring

**목표:** `masterDetail` prop 수용 및 grid 전달.

| 작업 | 산출 |
| --- | --- |
| `DataGridCrudMasterDetailConfig` · `DataGridCrudMasterDetailToggleConfig` | `GenDataGridCrud.types.ts` |
| `GridPropsOwnedByCrudMasterDetail` · `gridProps` Omit 확장 | `GenDataGridCrud.types.ts` |
| `resolveMasterDetailGridProps()` | `src/features/master-detail/resolveMasterDetailGridProps.ts` |
| `GenDataGridCrud.tsx` spread | `{...gridProps}{...resolveMasterDetailGridProps(masterDetail)}` |
| public re-export (types) | `src/index.ts` (필요 시) |

**Exit criteria:**

- `masterDetail`만 넘기면 grid에 `enableMasterDetail: true` 및 나머지 flat 키 전달
- `masterDetail` 없으면 기존 동작 동일
- TypeScript: `gridProps` + `masterDetail`에 동일 flat 키 중복 불가

### Slice 2 — Tests

| 작업 | 산출 |
| --- | --- |
| resolver unit test | normalize 매핑表 전 항목 |
| `GenDataGridCrud` render test | `renderDetailPanel` → detail row DOM |
| (선택) toggle columnId | `data-colid="_leading"`에 toggle marker |

**Exit criteria:** `pnpm -C packages/gen-datagrid-crud test` 통과

### Slice 3 — Demo migration

| 작업 | 산출 |
| --- | --- |
| `UserPage.tsx` | `gridProps`에서 MasterDetail flat 제거 → `masterDetail` prop |
| `userColumns` / `_leading` | 변경 없음 (toggle anchor는 `masterDetail.toggle.columnId`) |

**Exit criteria:** demo UserPage expand/collapse·detail panel 수동 QA

### Slice 4 — Docs + Storybook

Status: **complete** (2026-07-10).

| 작업 | 산출 |
| --- | --- |
| `GenDataGridCrud.stories.tsx` | `MasterDetailLeadingColumn`, `MasterDetailChevronToggle` |
| `GenDataGrid.baseline.stories.tsx` | `Gate82MasterDetailChevronToggle` |
| `@gen-office/gen-datagrid` | `renderDetailChevronToggle` helper |
| demo `UserPage` | chevron toggle on `_leading` |

## Deferred (2차 이후)

| 항목 | 설명 |
| --- | --- |
| `useDataGridCrudMasterDetail()` | state + `toggleRow` helper |
| CRUD uncontrolled expand | `masterDetail` 내부 default state (page `useState` 없이) |
| `GenDataGridCrud` top-level `onDetailPanel` 외 추가 sugar | 필요 시만 |

## 범위 외

- gen-datagrid nested `masterDetail` prop
- gen-datagrid handle expand API
- detail panel dynamic height · virtualization 조합 (gen-datagrid backlog)

## 파일 목록 (예상)

```text
packages/gen-datagrid-crud/
  src/
    GenDataGridCrud.types.ts          (modify)
    GenDataGridCrud.tsx               (modify)
    features/master-detail/
      resolveMasterDetailGridProps.ts (new)
  test/
    masterDetailConfig.test.ts        (new, 또는 thinShell 확장)
  .docs/
    architecture/master-detail-config-architecture.md
    plan/master-detail-config-plan.md
    gen-datagrid-crud-package-design.md (modify)
    plan/remaining-work-plan.md       (modify)
    implementation-log.md             (modify)
```

## 마이그레이션 가이드 (app)

**Before:**

```tsx
gridProps={{
  enableMasterDetail: true,
  expandedRows,
  onExpandedRowsChange: setExpandedRows,
  renderDetailPanel,
  detailToggleColumnId: '_leading',
  detailPanelHeight: 248,
}}
```

**After:**

```tsx
gridProps={{ /* column/edit 등 grid-only */ }}
masterDetail={{
  expandedRows,
  onExpandedRowsChange: setExpandedRows,
  renderDetailPanel,
  panelHeight: 248,
  toggle: { columnId: '_leading' },
}}
```

`useDataGridCrudController` + 직접 `GenDataGrid` 조합 화면은 **flat props 유지** (advanced).

## 검증 명령

```bash
pnpm -C packages/gen-datagrid-crud build
pnpm -C packages/gen-datagrid-crud test
pnpm -C apps/demo exec tsc --noEmit
```

## 우선순위

`remaining-work-plan.md` backlog 중 **Package Surface Cleanup** 직후·**App Integration**과 병행 가능. gen-datagrid 변경이 없어 **독립 slice**로 진행 가능.

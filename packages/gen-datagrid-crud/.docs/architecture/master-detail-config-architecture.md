<!-- packages/gen-datagrid-crud/.docs/architecture/master-detail-config-architecture.md
Defines CRUD-level master-detail configuration architecture (GenDataGrid flat props unchanged).
-->

# GenDataGridCrud Master-detail Config Architecture

## 목표

back-office CRUD 화면에서 MasterDetail 관련 `gridProps` flat 키가 많아지는 문제를 **`GenDataGridCrud` top-level `masterDetail` 객체 하나**로 묶는다.

- **`@gen-office/gen-datagrid` public API는 변경하지 않는다.** Gate 8.2 flat props(`enableMasterDetail`, `expandedRows`, …)가 정본이다.
- **`@gen-office/gen-datagrid-crud`가 화면 조합 레이어**로 nested config를 받아 grid flat props로 **normalize·전달**한다.
- `actionBar`와 동일한 패턴: **feature bundle은 CRUD props**, engine contract는 grid props.

## 비목표

- gen-datagrid에 `masterDetail?: …` nested prop 추가
- `GenDataGridHandle`에 `toggleRowExpand(rowId)` imperative API 추가
- detail panel layout framework · dynamic height · tree+masterDetail 조합 정책 (gen-datagrid backlog 유지)

## 배경

`apps/demo` `UserPage`는 `gridProps`에 column sizing/filter와 MasterDetail 설정 6~7개를 함께 넘긴다.

```tsx
gridProps={{
  enableColumnFilters: true,
  enableColumnSizing: true,
  enableMasterDetail: true,
  expandedRows,
  onExpandedRowsChange: setExpandedRows,
  renderDetailPanel,
  detailToggleColumnId: '_leading',
  detailPanelHeight: 248,
}}
```

gen-datagrid P1에서 toggle API(`detailToggleColumnId`, `renderDetailToggle`, `detailToggleProps`)까지 flat으로 늘어났고, CRUD 화면에서는 **MasterDetail만 한 덩어리**로 관리하는 편이 읽기·타입 안전·마이그레이션에 유리하다.

## 패키지 경계

```text
apps/demo
  └─ GenDataGridCrud
       masterDetail?: DataGridCrudMasterDetailConfig   ← CRUD 소유 (신규)
       gridProps?: Omit<..., MasterDetailFlatKeys>     ← grid 나머지 옵션
            │
            ▼ resolveMasterDetailGridProps()
       GenDataGrid
         enableMasterDetail, expandedRows, renderDetailPanel, …  ← flat (현행)
```

| 레이어 | MasterDetail 책임 |
| --- | --- |
| gen-datagrid | expand state, detail row DOM, toggle 렌더, panel slot |
| gen-datagrid-crud | **화면 설정 묶음**, grid flat props mapper, (선택) state hook |
| apps/demo | `renderDetailPanel` UI, `expandedRows` state, column anchor |

gen-datagrid 문서: [Gate 8.2 Master-detail Architecture](../../../gen-datagrid/.docs/architecture/gate-8-2-master-detail-architecture.md)

## Public API (CRUD)

### `DataGridCrudMasterDetailConfig<TData>`

```ts
type DataGridCrudMasterDetailToggleConfig<TData> = {
  columnId?: string;
  render?: (ctx: GenDataGridDetailToggleContext<TData>) => React.ReactNode;
  props?: GenDataGridDetailToggleProps;
};

type DataGridCrudMasterDetailConfig<TData> = {
  /** masterDetail prop 존재 시 기본 true. 명시 false면 grid에 enableMasterDetail: false */
  enabled?: boolean;

  expandedRows?: GenDataGridExpandedRowState;
  defaultExpandedRows?: GenDataGridExpandedRowState;
  onExpandedRowsChange?: (next: GenDataGridExpandedRowState) => void;

  getRowCanExpand?: (ctx: GenDataGridRowContext<TData>) => boolean;
  renderDetailPanel: (ctx: GenDataGridDetailPanelContext<TData>) => React.ReactNode;
  panelHeight?: number;

  toggle?: DataGridCrudMasterDetailToggleConfig<TData>;
};
```

### `GenDataGridCrudProps` 확장

```ts
type GenDataGridCrudProps<TData> = {
  // …기존 props
  masterDetail?: DataGridCrudMasterDetailConfig<TData>;
  gridProps?: Omit<
    GenDataGridProps<TData>,
    GridPropsOwnedByCrud | GridPropsOwnedByCrudMasterDetail
  >;
};
```

`GridPropsOwnedByCrudMasterDetail` — gen-datagrid flat 키 mirror (타입-only, grid 변경 없음):

- `enableMasterDetail`
- `expandedRows` · `defaultExpandedRows` · `onExpandedRowsChange`
- `getRowCanExpand`
- `renderDetailPanel`
- `detailPanelHeight`
- `detailToggleColumnId` · `renderDetailToggle` · `detailToggleProps`

TypeScript로 **`masterDetail`과 `gridProps`에 동일 flat 키 동시 전달을 금지**한다.

## Normalize contract

`resolveMasterDetailGridProps(config)` — `packages/gen-datagrid-crud/src/features/master-detail/resolveMasterDetailGridProps.ts` (구현 예정)

| CRUD config | GenDataGrid flat prop |
| --- | --- |
| `enabled ?? true` (prop 존재 시) | `enableMasterDetail` |
| `expandedRows` | `expandedRows` |
| `defaultExpandedRows` | `defaultExpandedRows` |
| `onExpandedRowsChange` | `onExpandedRowsChange` |
| `getRowCanExpand` | `getRowCanExpand` |
| `renderDetailPanel` | `renderDetailPanel` |
| `panelHeight` | `detailPanelHeight` |
| `toggle.columnId` | `detailToggleColumnId` |
| `toggle.render` | `renderDetailToggle` |
| `toggle.props` | `detailToggleProps` |

`config`가 `undefined`이면 `{}` 반환 (grid MasterDetail off).

### `GenDataGridCrud` spread 순서

```tsx
<GenDataGrid
  {...gridProps}
  {...resolveMasterDetailGridProps(masterDetail)}
  {...controller.gridStateProps}
  editPolicy={editPolicy}
  getCellValidation={getCellValidation}
  // CRUD owned: data, columns, getRowId, readOnly, ref
/>
```

**우선순위:** `controller.gridStateProps` > normalized masterDetail > `gridProps` (동일 키는 앞쪽 spread가 덮임 — masterDetail이 gridProps의 MasterDetail flat 키를 타입상 막으므로 런타임 충돌은 CRUD owned props만 주의).

## Controlled state

MasterDetail expand state **정본**은 gen-datagrid와 동일하게 `expandedRows` / `onExpandedRowsChange`다.

- CRUD는 state를 **소유하지 않는다** (1차). page가 `useState`로 관리하고 `masterDetail.expandedRows`로 넘긴다.
- app 셀 버튼으로 toggle: page에서 `setExpandedRows` 호출 — grid handle API 불필요 ([Gate 8.2](../../../gen-datagrid/.docs/architecture/gate-8-2-master-detail-architecture.md)와 동일).

## `actionBar`와의 대칭

| Feature | CRUD top-level | Grid/engine |
| --- | --- | --- |
| ActionBar | `actionBar?: DataGridCrudActionBarOptions` | (없음 — CRUD UI) |
| MasterDetail | `masterDetail?: DataGridCrudMasterDetailConfig` | flat props 10개 |

특수 layout은 `useDataGridCrudController` + 직접 `GenDataGrid` 조합 시 **기존 flat props**를 그대로 사용할 수 있다 (advanced path).

## 선택 후속: `useDataGridCrudMasterDetail` (2차)

CRUD 패키지 optional hook:

- `expandedRows` state + `toggleRow(rowId)` helper
- `config: DataGridCrudMasterDetailConfig` 반환 → `masterDetail={config}`

1차 slice에서는 **hook 없이** page controlled state만 지원한다.

## 소비 예 (목표)

```tsx
const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

<GenDataGridCrud
  data={rows}
  columns={columns}
  getRowId={(row) => row.userId}
  gridProps={{
    enableColumnFilters: true,
    enableColumnSizing: true,
  }}
  masterDetail={{
    expandedRows,
    onExpandedRowsChange: setExpandedRows,
    renderDetailPanel,
    panelHeight: 248,
    toggle: { columnId: '_leading' },
  }}
/>
```

## 테스트·검증

- `test/thinShell.test.tsx` 또는 전용 interaction: `masterDetail` → grid `data-expanded-row` / detail panel DOM
- `gridProps`에 MasterDetail flat 키 전달 시 **타입 오류** (compile-time)
- demo `UserPage` 마이그레이션 후 수동 QA: expand/collapse, detail panel, `_leading` toggle

## 관련 문서

- 구현 계획: [../plan/master-detail-config-plan.md](../plan/master-detail-config-plan.md)
- gen-datagrid Gate 8.2: [../../../gen-datagrid/.docs/architecture/gate-8-2-master-detail-architecture.md](../../../gen-datagrid/.docs/architecture/gate-8-2-master-detail-architecture.md)
- gen-datagrid toggle (P1): [../../../gen-datagrid/.docs/plan/remaining-work-plan.md](../../../gen-datagrid/.docs/plan/remaining-work-plan.md) — MasterDetail Expand Toggle Customization (complete)

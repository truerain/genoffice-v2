<!--
 @file packages/gen-datagrid/.docs/architecture/gate-8-8-row-hover-highlight-architecture.md
 @description GenDataGrid Gate 8.8 row hover highlight 설계 (AG Grid Row Hover Highlight 대응).

 @created 2026-07-09
-->
# GenDataGrid Gate 8.8 Row Hover Highlight Architecture

Gate 8.8은 포인터가 행 위에 있을 때 행 전체를 시각적으로 강조하는 **Row Hover Highlight**를 추가한다. AG Grid의 *Row Hover Highlight* / `rowHoverColor` / `ag-row-hover`에 대응하며, Gate 8.7-a **Current Row Highlight**와는 트리거·의미가 다르다.

## Status

Implemented. Default `enableRowHoverHighlight` is **true**. CSS `:hover` path (root `data-row-hover-highlight`).

## Relation To Adjacent Gates

| Gate | 기능 | 트리거 | 의미 |
| --- | --- | --- | --- |
| **8.7** | System columns | — | row number / selection / status |
| **8.7-a** | Current row highlight | active cell | Master/Detail 업무 컨텍스트 행 |
| **8.8** | Row hover highlight | pointer over row | 탐색용 시각 피드백 |

Gate 번호는 **8.7과 동급 피어**(8.8). 8.7-a의 하위가 아니다.

## Public API

```ts
type GenDataGridProps<TData> = {
  /**
   * When true, highlight the body row under the pointer.
   * Default: **true** (AG Grid Row Hover Highlight와 동일하게 기본 ON).
   * 끄려면 `enableRowHoverHighlight={false}`.
   */
  enableRowHoverHighlight?: boolean;
};
```

네이밍:

- **`enableRowHoverHighlight`** — AG Grid “Row Hover Highlight” + 기존 `enableCurrentRowHighlight` 어순 정렬.
- 비채택: `enableHoverRowHighlight` (Hover가 앞에 옴).
- AG Grid는 `suppressRowHoverHighlight`로 끄지만, GenDataGrid는 `enable*` + default `true`로 맞춘다.

Deferred:

- column hover highlight (`columnHoverHighlight` / `columnHoverColor` 대응)
- hover와 current/selection 충돌을 앱이 세밀 제어하는 정책 API

## State Policy

- Hover는 **transient UI state**다. controlled prop·callback·handle API를 두지 않는다(1차).
- `activeCell` / `currentRow` / `rowSelection` / range selection과 **독립**이다.
- Hover는 포인터가 행을 떠나거나 그리드 밖이면 해제된다.
- System column 셀 위에서도 해당 **행** hover는 유지한다(행 단위 강조).

## Render Contract

`enableRowHoverHighlight === true`일 때, 포인터 아래 body row에 마커를 둔다.

권장 1차 (DOM 단순):

```txt
.gen-datagrid[data-row-hover-highlight='true'] .gen-datagrid__row:hover .gen-datagrid__cell
```

- 루트에 `data-row-hover-highlight="true"` (prop 반영).
- 행 `:hover`로 셀 배경을 칠한다. GenDataGrid는 한 row DOM에 pinned 셀이 함께 있어 AG Grid처럼 클래스 주입이 **필수는 아닐 수 있다**.

대안 (pinned/가상화에서 `:hover`가 행 전체를 못 칠할 때):

```txt
data-row-hover="true" on the hovered .gen-datagrid__row
```

pointerenter/leave(또는 body pointermove + closest row)로 마커를 붙인다. AG Grid `ag-row-hover`와 동일 패턴.

구현 착수 시 1차로 CSS `:hover`를 시도하고, pinned·virtual 회귀에서 깨지면 마커 방식으로 승격한다.

## Style / Tokens

Feature 토큰 (Shell accent 파생):

```css
--gen-datagrid-row-hover-bg: color-mix(
  in srgb,
  var(--gen-datagrid-accent) 8%,
  var(--gen-datagrid-bg)
);
```

AG Grid 기본 `rowHoverColor: accentMix(0.08)`에 맞춤.

우선순위:

1. deleted / validation / dirty (기존 상태)
2. selection / active cell
3. **current row** (`data-current-row`)
4. **row hover** — CSS에서 current·selection·deleted에 `:not(...)`로 양보
5. body cell 기본 배경

구현은 hover 규칙에 `:not([data-current-row])` / `:not([data-selected-cell])` / `:not([data-deleted-row])`를 두어 cascade를 고정한다.

## Non-Goals (Gate 8.8)

- current row API 확장 (`currentRowId` 등) — Backlog / 8.7-a follow-up
- column hover
- hover 시 row number/스크롤 인디케이터 등 “위치 표시” UI (별도 요구 시)

## Storybook / Tests (구현 시)

- prop off: hover 시 배경 변화 없음
- prop on: body row hover 시 셀 배경이 `--gen-datagrid-row-hover-bg`
- pinned column이 있는 행에서도 행 전체(또는 동일 row의 pinned+scroll 셀) 강조
- `enableCurrentRowHighlight`와 동시: current 행은 current 스타일 유지, 다른 행 hover는 hover 스타일
- virtual body 경로에서도 동일

## Implementation Sketch

1. `GenDataGrid.types.ts` — `enableRowHoverHighlight?: boolean`
2. `DataGridRoot` — 루트 `data-row-hover-highlight` 전달
3. `styles/tokens.css` — `--gen-datagrid-row-hover-bg`
4. `index.css` — hover 규칙 + cascade
5. interaction / Storybook 회귀
6. `api-structure.md` · `api-comparison-with-gen-grid.md` 갱신

## Reference

- AG Grid: [Row Styles — Highlighting Rows and Columns](https://www.ag-grid.com/javascript-data-grid/row-styles/) (`suppressRowHoverHighlight`, `ag-row-hover`)
- AG Grid theme: `rowHoverColor`
- Sibling: [Gate 8.7-a Current Row Highlight](gate-8-7-a-current-row-highlight-architecture.md)
- Tokens: [design-tokens-architecture.md](design-tokens-architecture.md) Features

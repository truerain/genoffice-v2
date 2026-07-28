<!--
 @file packages/gen-datagrid-pivot/.docs/package-design.md
 @description Architecture and public API design for gen-datagrid-pivot.

 @created 2026-07-29

 @remark
 - 구현 시 이 문서의 모듈 경계·계약을 따른다
-->
# Package Design — gen-datagrid-pivot

## 1. 목표

선언형 `GenDataGridPivotConfig`와 원본 row 배열을 받아 **집계된 `data` + nested `columns`** 를 만들고, `GenDataGrid`로 읽기 전용 피벗 표를 렌더한다.

## 2. 의존

```text
@gen-office/gen-datagrid-pivot
  ├── @gen-office/gen-datagrid   (필수)
  ├── @gen-office/ui             (P3 Panel; P1은 최소)
  └── react / 동료 peer (crud와 동일 핀)
```

`gen-datagrid`는 이 패키지를 알지 못한다.

## 3. 런타임 흐름

```text
rawData + config (+ optional filter)
        │
        ▼
┌───────────────────┐
│  pivot engine     │  순수 함수 (React 없음)
│  - group keys     │
│  - expand columns │
│  - aggregate      │
│  - totals rows    │
│  - drill map      │
└─────────┬─────────┘
          │  { data, columns, meta }
          ▼
┌───────────────────┐
│ GenDataGridPivot  │  shell
│  - read-only      │
│  - gridProps passthrough (편집 관련은 strip/무시)
└─────────┬─────────┘
          ▼
     GenDataGrid
```

## 4. 모듈 레이아웃 (구현 시 생성)

```text
packages/gen-datagrid-pivot/
  package.json
  src/
    index.ts
    GenDataGridPivot.tsx
    GenDataGridPivot.types.ts
    engine/
      types.ts
      aggregate.ts          # sum/count/avg/min/max
      buildPivotResult.ts   # main entry
      columnIds.ts          # stable result column id
      totals.ts
      sortPivot.ts
      drillMap.ts           # cellKey -> source row ids/indices
    state/
      serializePivotState.ts
    panel/                  # P3
      PivotPanel.tsx
  test/
    engine/
      buildPivotResult.test.ts
  .docs/                    # 본 문서 트리
```

## 5. Public API (초안 — P1에서 확정)

### 5.1 Types

```ts
export type PivotAgg = 'sum' | 'count' | 'avg' | 'min' | 'max';

export type GenDataGridPivotValueDef<TData> = {
  field: keyof TData & string;
  agg: PivotAgg;
  label?: string;
};

export type GenDataGridPivotConfig<TData> = {
  enabled: boolean;
  rows: Array<keyof TData & string>;
  columns: Array<keyof TData & string>;
  values: GenDataGridPivotValueDef<TData>[];
  totals?: { row?: boolean; column?: boolean; grand?: boolean };
  limits?: { maxPivotColumns?: number };
};

export type GenDataGridPivotResultMeta = {
  generatedColumnCount: number;
  truncated: boolean; // maxPivotColumns 초과로 중단
  warnings?: string[];
};
```

### 5.2 Engine (headless export 권장)

```ts
export function buildPivotResult<TData extends object>(args: {
  data: TData[];
  config: GenDataGridPivotConfig<TData>;
}): {
  data: Record<string, unknown>[];
  columns: /* GenDataGrid ColumnDef compatible */ unknown[];
  meta: GenDataGridPivotResultMeta;
  getSourceRows?: (cellKey: string) => TData[]; // P2
};
```

### 5.3 Shell

```ts
export type GenDataGridPivotProps<TData extends object> = {
  data: TData[];
  config: GenDataGridPivotConfig<TData>;
  getRowId?: (row: TData) => string;
  /** GenDataGrid props 중 안전한 것만 통과 (enableTreeRows / editing 충돌 props 문서화) */
  gridProps?: Omit</* GenDataGridProps */ object, 'data' | 'columns'>;
  onPivotMetaChange?: (meta: GenDataGridPivotResultMeta) => void;
};
```

CRUD의 `gridProps` 패턴을 따른다. Pivot on일 때 shell이 `enableTreeRows`·cell editing을 끄거나 무시한다.

## 6. Result column id 규칙

안정적·결정적이어야 state restore·drill map이 깨지지 않는다.

권장 형식 (구현 시 문서에 고정):

```text
pv|{colAxis0}={v0}|{colAxis1}={v1}|...|val={field}:{agg}
```

- 값 구분자는 escape 규약 필요 (필드 값에 `|` `=` 포함 시)
- totals 열: `pv|__total__|val={field}:{agg}` 등 prefix 예약

## 7. Totals 전략

| 종류 | 권장 구현 |
| --- | --- |
| Row total | result **열**로 추가 (각 행의 measure 합) |
| Column total | result **행**으로 추가 (`__col_total__` row kind) 또는 `renderFooter` |
| Grand total | row+column total 교차 셀 |

MVP는 **data 행/열로 totals를 넣는 방식**을 우선 (footer API 의존 최소화). Footer 병행은 선택.

## 8. core 소비 표면 (변경 최소화)

이미 사용 가능:

- nested `ColumnDef` / header groups
- `data`, `columns`, `getRowId`
- virtual body (넓은 열은 `maxPivotColumns`로 완화)
- selection (drill P2에서 셀 식별용)

MVP에서 core에 **넣지 않음**: TanStack grouping public API, Pivot Panel.

## 9. 충돌 정책

| 조합 | 정책 |
| --- | --- |
| Tree + Pivot | **금지** |
| CRUD shell + Pivot | **금지** (별도 화면) |
| 집계 셀 편집 | **비활성** |
| 원본 필터 | 엔진 입력 전 적용 |
| Pivot result 위 필터 | P1 비목표 |

## 10. 테스트 전략

- 엔진: [fixtures/car_sales.sample.json](./fixtures/car_sales.sample.json) — REGION × COLOR, sum(TOTAL) 등 스냅샷
- shell: Storybook `GenDataGridPivot` Default / Totals / TruncatedColumns
- demo: 매출 축 시연 페이지 (P1b)

## 11. 패키지 분리 장단점 (요약)

| 장점 | 단점 |
| --- | --- |
| 번들·API 격리 | monorepo 유지비 |
| 책임·Gate 분리 | 경계 마찰 시 core PR |
| crud/chart 패턴 | 패키지 수 증가 |
| 역의존 방지 | 조기 추상화 위험(소비처 적을 때) |

전제·기각 대안: [decisions.md](./decisions.md).

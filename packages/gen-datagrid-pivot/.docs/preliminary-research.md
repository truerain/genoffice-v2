<!--
 @file packages/gen-datagrid-pivot/.docs/preliminary-research.md
 @description V2-retargeted product research for GenDataGrid Pivot (from V1 gen-grid-pivot).

 @created 2026-07-29

 @remark
 - V1: frontend/packages/gen-grid-pivot/.docs/preliminary-research.md (gen-grid 기반)
 - V2: 본 문서가 정본. 기반은 gen-datagrid
-->
# GenDataGrid Pivot 사전 조사 (V2)

## 목적

기업용 백오피스의 **제한된 업무 화면**에서 실사용 가능한 Pivot을 정의한다.  
상업용 Pivot Grid 전체(특히 Flexmonster급 BI)를 복제하지 않는다.

이 문서는 `@gen-office/gen-datagrid-pivot` → `@gen-office/gen-datagrid` 방향을 전제로 한다.

## 참조 제품 기준

### AG Grid Pivot

기존 데이터 그리드에 `rowGroup`, pivot column, value aggregation을 조합하는 **확장 기능**.

- `pivotMode` + row group + aggregation
- pivot 값 조합 → Pivot Result Column
- Pivot / Row / Grand Totals
- Server-Side Row Model에서는 서버가 pivot 수행
- `pivotMaxGeneratedColumns` 등 상한
- Tree Data와 Pivot 비동시 지원 등 명확한 제약

참조: [Pivoting](https://www.ag-grid.com/javascript-data-grid/pivoting/), [Result columns](https://www.ag-grid.com/javascript-data-grid/pivoting-result-columns/), [Totals](https://www.ag-grid.com/javascript-data-grid/pivoting-totals/), [SSRM](https://www.ag-grid.com/javascript-data-grid/server-side-model-pivoting/)

### Flexmonster Pivot

Pivot이 제품 중심인 **BI/Reporting** 컴포넌트 (Field List, compact/classic/flat, drill-through, calculated values, toolbar export, 내장 chart, 다양한 데이터 소스).

→ GenOffice 그리드 패키지 범위를 넘는다. **벤치마크만** 하고 복제 대상이 아니다.

## 비교 판단

| 항목 | AG Grid Pivot | Flexmonster | GenDataGrid Pivot |
| --- | --- | --- | --- |
| 성격 | Grid 확장 | BI 제품 | **Grid 확장 패키지** |
| 구성 | row / pivot / value | rows / columns / measures / filters | AG Grid식 |
| UI | Side Bar, Pivot Panel | Field List, Toolbar | **제한된 Pivot Panel (P3)** |
| 데이터 | 클라이언트 또는 서버 | 다양한 소스 직접 연결 | **클라이언트 우선**, 서버 계약 P4 |
| 차트 | Integrated Chart | 내장 Pivot Chart | `gen-chart` 연동 후보 (P5) |
| 보고서 | Grid state | save/open/share | **state 저장만 MVP** |

## 패키지 방향

`gen-datagrid` 본체에 넣지 않고 `packages/gen-datagrid-pivot`으로 분리한다.  
장단점·기각 대안: [decisions.md](./decisions.md) D-PIVOT-001.

```text
@gen-office/gen-datagrid-pivot -> @gen-office/gen-datagrid
```

## 책임 경계

### `gen-datagrid`

- 렌더, column/row model, sorting/filtering/selection, virtualization
- nested header groups, footer slot
- feature 패키지가 소비하는 public API만 제공 (Pivot 모름)

### `gen-datagrid-pivot`

- Pivot 설정 모델
- row / column axis, value measures
- aggregation engine
- Pivot Result Column 생성
- totals / subtotals / grand total
- drill-through mapping (P2)
- 제한된 Pivot Panel (P3)
- Pivot state 저장/복원

## 1차 MVP 범위 (P1a~P1c)

| 기능 | 포함 | 비고 |
| --- | --- | --- |
| 행 그룹 축 | ✅ | |
| 열 피벗 축 | ✅ | |
| 값 집계 | ✅ | `sum`, `count`, `avg`, `min`, `max` |
| Result columns | ✅ | column axis 조합 |
| 행/열/전체 합계 | ✅ | |
| 정렬 | ✅ | 그룹 라벨, 값 기준 |
| 필터 | ✅ | **원본** 필터 후 집계 |
| 상태 저장/복원 | ✅ | preset |
| `maxPivotColumns` | ✅ | |
| Drill-through | P2 | 필요 시 MVP 당김 가능 |
| Pivot Panel | P3 | 허용 필드만 |
| 서버 사이드 계약 | P4 | |
| 숫자 포맷 | P3+ | |

## 제외·후순위

| 기능 | 근거 |
| --- | --- |
| Excel급 자유 Field List | UI·상태·검증 비대 |
| 임의 계산식 편집기 | 파서·보안 |
| OLAP / SSAS / MDX | BI 영역 |
| DB·ES 등 소스 직접 연결 | Grid 책임 아님 |
| 보고서 파일·전체 Toolbar | Reporting |
| 내장 Pivot Chart | `gen-chart` 후속 |
| 무제한 result columns | 성능·사용성 |
| compact/classic/flat 전체 layout | Flexmonster 복제 |

## 업무 적용 예

| 영역 | 행 축 | 열 축 | 값 |
| --- | --- | --- | --- |
| 매출 | 조직, 담당자, 고객, 상품군 | 월, 분기, 지역, 채널 | 매출, 수량, 마진 |
| 재고 | 창고, 품목군, 공급사 | 월, 재고상태 | 입출고, 금액 |
| 회계 | 계정, 부서, 코스트센터 | 월, 법인 | 금액, 건수 |
| 인사 | 부서, 직급 | 월, 고용형태 | 인원, 시간 |
| CS | 유형, 팀 | 월, 채널, 상태 | 티켓, SLA |

## API 초안 (잠금 후보)

화면 개발자가 **허용 필드·집계**를 선언한다 (자유 구성 UI는 P3에서 허용 필드만).

```ts
type PivotAgg = 'sum' | 'count' | 'avg' | 'min' | 'max';

type GenDataGridPivotConfig<TData> = {
  enabled: boolean;
  rows: Array<keyof TData & string>;
  columns: Array<keyof TData & string>;
  values: Array<{
    field: keyof TData & string;
    agg: PivotAgg;
    label?: string;
  }>;
  totals?: {
    row?: boolean;
    column?: boolean;
    grand?: boolean;
  };
  limits?: {
    maxPivotColumns?: number; // default 권장: 100~200, 문서화
  };
};
```

공개 컴포넌트 초안: `GenDataGridPivot` — config + raw `data` → 내부 변환 → `GenDataGrid` (`gridProps`로 core props 전달, CRUD thin-shell과 유사).

## 구현 제약

- Result column 폭증 → 상한 필수
- Drill-through를 위해 집계 셀 ↔ 원본 row map 유지
- 대용량 → 클라이언트 한계 문서화 + P4 서버 계약
- core sorting/filtering/sizing과 충돌 방지: **변환 계층 분리**
- Pivot UI는 업무 화면이 허용한 필드만

## 결론

`@gen-office/gen-datagrid-pivot` 확장 방향이 적절하다.  
목표는 AG Grid식 업무 그리드 Pivot이며, 1차 출시 컷은 **P0(scaffold)·P1a·P1b·P1c**.

상세 설계·Gate: [package-design.md](./package-design.md), [implementation-plan.md](./implementation-plan.md).

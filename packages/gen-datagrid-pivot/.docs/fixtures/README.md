<!--
 @file packages/gen-datagrid-pivot/.docs/fixtures/README.md
 @description Fixture notes for pivot engine tests.

 @created 2026-07-29
-->
# Fixtures

| 파일 | 설명 |
| --- | --- |
| [car_sales.sample.json](./car_sales.sample.json) | V1 `car_sales.json` 앞 40행. P1a 단위 테스트용 |

전체 대형 셋이 필요하면 V1 `frontend/packages/gen-grid-pivot/.docs/car_sales.json`을 참조한다 (V2 저장소에 전체 복사하지 않음).

권장 스모크 config:

```ts
{
  enabled: true,
  rows: ['REGION'],
  columns: ['COLOR'],
  values: [{ field: 'TOTAL', agg: 'sum' }],
  totals: { row: true, column: true, grand: true },
  limits: { maxPivotColumns: 50 },
}
```

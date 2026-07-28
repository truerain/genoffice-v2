<!--
 @file packages/gen-datagrid-pivot/.docs/decisions.md
 @description Locked decisions for gen-datagrid-pivot (do not re-litigate at implement time).

 @created 2026-07-29

 @remark
 - 구현 Gate 진입 시 이 문서와 충돌하면 이 문서가 우선. 변경 시 새 항목으로 기록
-->
# Decisions — gen-datagrid-pivot

역시간순. 구현 착수 시 **재검토하지 않고** 따른다.

## 2026-07-29

### D-PIVOT-001 — 별도 패키지 `packages/gen-datagrid-pivot`

- **결정:** core(`gen-datagrid`) / CRUD에 넣지 않고 `@gen-office/gen-datagrid-pivot` 형제 feature로 분리한다.
- **이유:** 집계·result column·panel은 렌더 엔진과 다른 도메인; 미사용 앱 번들·API 격리; `gen-datagrid-crud` / `gen-datagrid-chart` 패턴과 정렬.
- **기각:** core `features/pivot`, CRUD 흡수, `@gen-office/utils`만, `gen-pivot` 단독명.
- **전제:** P0~P1c를 재사용 제품 API로 출시. 단발 화면만이면 앱 util이 맞으나, 본 패키지 문서는 제품 API 전제.

### D-PIVOT-002 — 기반은 GenDataGrid (V1 gen-grid 금지)

- **결정:** V1 `gen-grid` / `gen-grid-pivot` 구현을 이식하지 않는다. V2 public API는 `GenDataGrid`만 소비한다.
- **이유:** `AGENTS.md` — V1 grid 스택 복원 금지.

### D-PIVOT-003 — AG Grid식 확장, Flexmonster BI 제외

- **결정:** row/column/value + aggregation + result columns. Field List·OLAP·보고서 Toolbar·내장 Pivot Chart는 제외.
- **상세 범위:** [preliminary-research.md](./preliminary-research.md)

### D-PIVOT-004 — 엔진은 변환 계층 (TanStack grouping 미사용)

- **결정:** Pivot 엔진이 `data` + nested `columns`를 생성해 `GenDataGrid`에 넘긴다. MVP에서 core `enableGrouping` / `getGroupedRowModel`을 열지 않는다.
- **이유:** grouping은 tree/detail과 Extension으로 문서화됨; Pivot과 동시 공개 시 expansion 정책 충돌.

### D-PIVOT-005 — 의존 방향

```text
apps → gen-datagrid-pivot → gen-datagrid → ui → theme/utils
gen-datagrid-pivot → ui (Pivot Panel P3)
gen-datagrid ↛ gen-datagrid-pivot
```

### D-PIVOT-006 — CRUD·Tree와 상호배타

- Pivot 뷰는 **읽기 전용** 집계. `GenDataGridCrud`와 같은 인스턴스에 올리지 않는다.
- `enableTreeRows`와 Pivot 동시 사용 금지 (AG Grid와 동일).

### D-PIVOT-007 — 로드맵 위치

- Phase 4(`gen-datagrid-chart`·demo) **이후** 선택 backlog. MVP 블로커 아님.
- 문서 Gate(본 `.docs`)만 선행 완료. 소스 구현은 로드맵 슬롯 진입 시.

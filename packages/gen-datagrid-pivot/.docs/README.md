<!--
 @file packages/gen-datagrid-pivot/.docs/README.md
 @description Index for GenDataGrid Pivot package design docs (implementation-ready).

 @created 2026-07-29

 @remark
 - 구현 착수 전 정본. 추가 제품 검토 없이 Gate 순서대로 진행 가능
 - 소스 패키지 scaffold는 Gate P0에서 생성
-->
# GenDataGrid Pivot Docs

`@gen-office/gen-datagrid-pivot`은 `@gen-office/gen-datagrid` 위에 **AG Grid식 Pivot 확장**을 올리는 형제 feature 패키지다.  
Flexmonster식 BI/Reporting 제품 범위는 포함하지 않는다.

**상태 (2026-07-29):** 설계·Gate·결정 문서만 존재. 소스 scaffold·구현은 미착수.  
**착수 시점:** [`.docs/04-ROADMAP.md`](../../../.docs/04-ROADMAP.md) Phase 4(`gen-datagrid-chart`·demo) 이후 backlog.

## 구현 시 읽기 순서

1. [preliminary-research.md](./preliminary-research.md) — 제품 범위·비범위·참조 제품
2. [decisions.md](./decisions.md) — 잠긴 결정 (재검토 불필요)
3. [package-design.md](./package-design.md) — 아키텍처·API·책임 경계
4. [implementation-plan.md](./implementation-plan.md) — Gate P0~P5·파일 레이아웃·완료 기준
5. [fixtures/car_sales.sample.json](./fixtures/car_sales.sample.json) — 엔진 단위 테스트 픽스처

## 로그

- [implementation-log.md](./implementation-log.md)

## 선행 문서 (V2)

- [GenDataGrid README](../../gen-datagrid/.docs/README.md)
- [API comparison — grouping Extension](../../gen-datagrid/.docs/reference/api-comparison-with-gen-grid.md)
- [CRUD thin shell 패턴](../../gen-datagrid-crud/.docs/gen-datagrid-crud-package-design.md)
- [02-ARCHITECTURE.md](../../../.docs/02-ARCHITECTURE.md)

## V1 참조 (외부)

- `frontend/packages/gen-grid-pivot/.docs/preliminary-research.md` — 원조사 (기반은 `gen-grid`; V2는 gen-datagrid로 재타깃)
- `frontend/packages/gen-grid-pivot/.docs/car_sales.json` — 대형 원본 데이터셋 (샘플은 본 패키지 fixtures)

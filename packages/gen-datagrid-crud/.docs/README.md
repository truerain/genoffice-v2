<!-- packages/gen-datagrid-crud/.docs/README.md
Indexes planning documents for the GenDataGrid CRUD package.
-->

# GenDataGridCrud Docs

`@gen-office/gen-datagrid-crud`는 `@gen-office/gen-datagrid` 위에 얇은 CRUD workflow와 ActionBar UI를 얹는 패키지다.
`GenDataGrid`가 이미 제공하는 data/edit/dirty/delete/selection 기능을 재구현하지 않고, 저장/초기화/삭제/필터/컬럼 재정렬 같은 업무 흐름만 조합한다.

## Architecture

- [Design Tokens Architecture (gen-datagrid 정렬)](architecture/design-tokens-architecture.md)
- [Master-detail Config Architecture](architecture/master-detail-config-architecture.md) — CRUD `masterDetail` prop (grid flat API 유지)

## Plan

- [Remaining Work Plan](plan/remaining-work-plan.md) — Gate 12 이후 추가 개발·백로그
- [Master-detail Config Plan](plan/master-detail-config-plan.md) — `masterDetail` prop 구현 slice
- [Design Tokens Restructure Plan](plan/design-tokens-restructure-plan.md)
- [Gate 10 Thin Shell Plan](gate-10-thin-shell-plan.md)
- [Gate 11 CRUD Mutation Completion Plan](gate-11-crud-mutation-plan.md)
- [Gate 12 App Integration / Migration Plan](gate-12-app-integration-plan.md)

## 문서

- [GenDataGrid CRUD Readiness Audit](gen-datagrid-crud-readiness-audit.md)
- [GenDataGridCrud Package Design](gen-datagrid-crud-package-design.md)
- [GenGridCrud To GenDataGridCrud Migration Guide](gen-grid-crud-migration-guide.md)
- [App Integration QA Guide](app-integration-qa-guide.md)
- [Implementation Log](implementation-log.md)

## 선행 GenDataGrid 문서

- [GenDataGrid Design Tokens Architecture](../../gen-datagrid/.docs/architecture/design-tokens-architecture.md)
- [Controlled vs Uncontrolled App Guide](../../gen-datagrid/.docs/reference/controlled-uncontrolled-app-guide.md)
- [GenDataGrid Remaining Work Plan](../../gen-datagrid/.docs/plan/remaining-work-plan.md)
- [GenDataGridHandle Data Ownership Architecture](../../gen-datagrid/.docs/architecture/handle-data-ownership-architecture.md)

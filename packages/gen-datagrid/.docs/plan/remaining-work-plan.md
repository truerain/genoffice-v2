<!--
 @file packages/gen-datagrid/.docs/plan/remaining-work-plan.md
 @description Active backlog for GenDataGrid after P0/P1 completion (P2+ deferred).
 @updated 2026-07-12
-->

# GenDataGrid Remaining Work Plan

이 문서는 **아직 남은** GenDataGrid 작업을 실행 단위로 관리한다.

- 완료 이력: [`../log/implementation-log.md`](../log/implementation-log.md)
- 완료 계획 요약: [`../log/planning-history.md`](../log/planning-history.md)
- 설계 근거: [`../architecture/`](../architecture/)

## Current Status

**P0 · P1 완료** (2026-07-09 ~ 2026-07-12). 상세는 planning-history.

완료된 대표 표면:

- MVP Gates 1–8, Handle/CRUD 연동 준비
- P0 Dirty baseline revert · Row Status Context API
- P1 Row Status display context · Built-in Editor Meta 4.3-a~d · Edit Lookup · MasterDetail toggle API

**현재 active backlog는 P2(중장기)와 P1에서 이월된 Deferred다.**

---

## Active Backlog

### P2. 중장기 Follow-up

#### Documentation Consistency

- stale status text 정리
- 오래된 Korean 문서 mojibake 복구
- README link와 plan/log 구조 정합성 유지
- API reference implementation status 유지

#### Visual Row Merge Follow-up

- pinned column sticky merge labels
- non-virtual continuation value rendering
- `visualRowMerge.getValue`
- `visualRowMerge.compare`
- tree / detail / body col span 조합 정책

#### Header Group Follow-up

- pinned group header split / sticky behavior
- `groupVisibilityToggle`
- group header resize / reorder / filter affordance

#### Current Row Controlled API

- `currentRowId`
- `defaultCurrentRowId`
- controlled `activeCell`과 controlled `currentRowId` 충돌 정책
- active cell과 current row 독립 이동 정책

#### Virtualization Follow-up

- column virtualization
- browser-level visual regression
- Storybook interaction 또는 Playwright large-row scroll checks

#### Clipboard And Editing Follow-up

- paste-to-selection
- clipboard value formatter policy
- paste type coercion policy
- reserved `editOnActiveCell`, `keepEditingOnNavigate` 활성화 또는 제거 결정
- popup / custom editor navigation policy 보강
- `editMinLength` (validation 연동 권장)
- `editParse` / `editFormat` (표시값 ↔ 편집값, paste coercion 연계)
- IME 조합 중간 상태 · regex 거부 UX 세밀 정책

#### Filtering Follow-up

- structured filter operators
- typed filter editors
- multi-condition filters
- manual / server filtering examples

#### Tree Follow-up

- async / lazy child loading API
- flat parentId adapter
- tree + master-detail combination policy
- tree drag / drop reorder
- `treeToggleColumnId`
- `treeCollapseBehavior`
- server-side tree filtering semantics

#### Public API Surface Cleanup

- implemented handle reference와 Gate 9 계획 정합성 유지
- deferred data mutation handle 정책 정리
- row / cell className · style **grid prop** callback API (`getCellClassName` / `getCellStyle`)
- `meta.cellStyle` 외 `backgroundColor` / `color` sugar meta
- empty state and toolbar slot API
- public surface 안정화 후 API reference split
- `@gen-office/datagrid-editors` 분리 패키지 검토

#### Edit Lookup Follow-up

- `mode: 'popover'`
- `fetchItems` declarative API
- CRUD sugar

#### MasterDetail / Toggle Follow-up

- row별 동적 anchor (함수형 `detailToggleColumnId`)
- tree toggle과 master-detail toggle의 개별 pinning zone 정책
- 디자인시스템 아이콘 패키지 강결합 (기본 API는 headless 유지)

---

## Reference (완료 계획 위치)

| 영역 | 이력 |
| --- | --- |
| P0 Dirty / Row Status Context | [`planning-history.md`](../log/planning-history.md) §2026-07-09 |
| P1 Row Status Display · Editor 4.3 · Lookup · MasterDetail toggle | [`planning-history.md`](../log/planning-history.md) §2026-07-12 |
| Gates 1–13 요약 | [`planning-history.md`](../log/planning-history.md) §완료된 Gate 요약 |
| Edit Lookup 설계 | [`edit-lookup-plan.md`](edit-lookup-plan.md), [`../architecture/edit-lookup-architecture.md`](../architecture/edit-lookup-architecture.md) |
| Editor 계약 | [`../reference/cell-edit-api.md`](../reference/cell-edit-api.md), [`../reference/editor-implementation-contract.md`](../reference/editor-implementation-contract.md) |

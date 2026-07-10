<!-- packages/gen-datagrid-crud/.docs/plan/remaining-work-plan.md
Tracks remaining GenDataGridCrud work after Gate 10–12 completion.
-->

# GenDataGridCrud Remaining Work Plan

이 문서는 Gate 10~12 완료 이후 `@gen-office/gen-datagrid-crud`의 **추가 개발·백로그**를 관리한다.
완료된 Gate 계획은 `../gate-10-thin-shell-plan.md`, `../gate-11-crud-mutation-plan.md`,
`../gate-12-app-integration-plan.md`에 있으며, 구현 이력은 `../implementation-log.md`에 기록한다.

선행 그리드 엔진 백로그: [`../../gen-datagrid/.docs/plan/remaining-work-plan.md`](../../gen-datagrid/.docs/plan/remaining-work-plan.md)

## Current Status

GenDataGridCrud는 thin shell + mutation + demo 연동(Gate 12)까지 완료된 상태다.

- `GenDataGridCrud` wrapper · `useDataGridCrudController` · `DataGridCrudActionBar`
- created row store · dirty overlay 표시 · commit/validation pipeline
- `rowStatusResolver`(created/dirty/deleted) · ActionBar add/save/reset/delete
- `apps/demo` UserManagement 등 reference 화면 연동

남은 작업은 **업무 UX 보완**(행 추가 후 편집 진입 등)과 app 연동 확대, 패키지 surface 정리로 나눈다.

## Backlog

### Master-detail Config (`masterDetail` prop)

Status: **complete** (2026-07-10).

배경: CRUD `gridProps`에 MasterDetail flat 키 6~10개가 column sizing/filter와 섞여 가독성이 떨어진다. gen-datagrid API는 Gate 8.2 flat contract **현행 유지**.

목표: `GenDataGridCrud` top-level **`masterDetail?: DataGridCrudMasterDetailConfig`** 추가. 내부 `resolveMasterDetailGridProps()`로 grid flat props 전달. `gridProps`에서는 MasterDetail flat 키 **TypeScript Omit**.

문서:

- Architecture: [../architecture/master-detail-config-architecture.md](../architecture/master-detail-config-architecture.md)
- Plan: [master-detail-config-plan.md](./master-detail-config-plan.md)

구현:

- `DataGridCrudMasterDetailConfig` · `resolveMasterDetailGridProps`
- `GenDataGridCrud` `masterDetail` prop · demo `UserPage` 마이그레이션
- `test/masterDetailConfig.test.tsx`

Exit criteria:

- `masterDetail={{ renderDetailPanel, expandedRows, … }}`만으로 demo UserPage 동작 ✅
- gen-datagrid 패키지 **코드 변경 없음** ✅
- `gridProps` + MasterDetail flat 중복 시 compile error ✅

### Add Row — Focus First Editable Column (Edit Entry)

Status: planned.

배경 (2026-07-09, `apps/demo` UserPage):

- ActionBar **Add** → `addRow()`는 `createRow` 결과를 `createdRows`에만追加한다. **active cell 이동·편집 모드 진입은 없다.**
- 테스트(`test/thinShell.test.tsx`)도 행 추가 후 **더블클릭**으로 편집을 시작한다.
- 첫 **데이터** 컬럼이 `editable: false`(예: `userId`)이면, 그리드 기본 active cell이 편집 불가 셀에 머물 수 있다.
- `GenDataGridHandle`에 public `startEditing` / `focusAndEditCell` API가 없고, `editOnActiveCell`은 gen-datagrid 측 **reserved·미구현**이다.

목표: 행 추가 직후 **첫 editable 사용자 컬럼**으로 active cell을 옮기고, 필요 시 **편집 모드까지 자동 진입**한다.

의존 (gen-datagrid, 병행 또는 선행):

- `GenDataGridHandle.focusCell(coord, { startEdit?: boolean })` 또는 동등 API
- (선택) controlled `activeCell`만으로는 edit 진입 불가 — handle/imperative 경로 필요

제안 API (architecture에서 확정):

1. **CRUD 옵션 (권장 1차)**  
   `GenDataGridCrud` / `useDataGridCrudController`:
   - `focusFirstEditableOnAddRow?: boolean` (default `false` — breaking 방지)
   - 또는 `addRow(options?: { focus?: 'none' | 'firstEditable' | 'firstData'; startEdit?: boolean })`

2. **첫 editable 컬럼 해석**  
   - visible leaf columns 순회, system column(`__gen_*`) 제외
   - `meta.editable`이 `false`가 아닌 첫 컬럼 (함수형 editable는 해당 **신규 행** 컨텍스트로 평가)
   - Row Status Context API([gen-datagrid backlog](../../gen-datagrid/.docs/plan/remaining-work-plan.md)) 완료 시 `rowStatus === 'created'`와 조합

3. **구현 위치**  
   - `useDataGridCrudController.addRow` — 행 append 후 `requestAnimationFrame`(또는 grid data 반영 tick)에서 focus/edit 호출
   - virtualization 케이스: `scrollToCell` + edit start 순서 고정 (gen-datagrid interaction 테스트와 정합)

Scope:

- `GenDataGridCrud.types.ts` — props/options 타입
- `useDataGridCrudController.tsx` — `addRow` 확장, 첫 editable column resolver 헬퍼
- `test/thinShell.test.tsx` — add 후 `loginId`(또는 첫 editable) `data-editing-cell` / editor focus
- `../gen-datagrid-crud-package-design.md` — workflow 절 갱신
- 소비처: `apps/demo` `UserPage` — `gridProps` 우회 없이 CRUD 기본 동작으로 데모

Deferred:

- Add 후 **특정 columnId** 지정 (`focusColumnId`) — 2차
- 키보드만 포커스·편집 없음 모드와 편집 진입 모드 분리 정책 문서화

Exit criteria:

- `focusFirstEditableOnAddRow: true` 시 Add 클릭 후 신규 행의 첫 editable 셀이 **edit 모드**이고 editor에 포커스가 있다.
- `userId` 등 non-editable 선행 컬럼이 있어도 **건너뛰고** 다음 editable로 진입한다.
- virtualized CRUD 그리드에서 동일 동작 (기존 click-continue 테스트와 충돌 없음).
- gen-datagrid handle API 없이는 구현하지 않음 — 선행 slice가 없으면 gen-datagrid backlog에 blocker로 명시.

참고 소비처:

- `apps/demo/src/pages/admin/user/UserPage.tsx` — `userColumns` (`userId` non-editable, `loginId` 첫 editable)

### Dirty State — Field Baseline Revert (gen-datagrid 선행)

Status: **blocked on gen-datagrid** (planned).

- **증상:** 셀 값을 변경 후 **원래 값으로 되돌려도** dirty 마커·`rowStatus: updated`·CRUD Save 가능 상태가 남는다 (`apps/demo` `useYn` toggle `Y`→`N`→`Y` 등).
- **소유:** `@gen-office/gen-datagrid` — `handleCellValueChange`가 baseline 대비 `value` 동일 시 dirty entry를 제거하지 않음.
- **CRUD 영향:** `useDataGridCrudController`는 grid `dirtyState`에만 의존(overlay·`rowStatusResolver`). 코어 수정 없이 crud 패키지에서 우회 불가.
- **계획:** [gen-datagrid — Dirty State Baseline Revert](../../gen-datagrid/.docs/plan/remaining-work-plan.md#dirty-state-baseline-revert-field-level-clean)

### Add Row — Insert Position (삽입 위치)

Status: **부분 구현** (Gate 11). 문서·테스트·미세 UX 보완은 backlog.

#### 이미 제공되는 API (Gate 11)

`GenDataGridCrudProps.createdRowPosition?: 'top' | 'bottom'` (default `'top'`).

```ts
// packages/gen-datagrid-crud/src/GenDataGridCrud.types.ts
export type DataGridCrudCreatedRowPosition = 'top' | 'bottom';
```

`gridData` 합성 (`useDataGridCrudController.tsx`):

| 값 | 표시 순서 | 용도 |
| --- | --- | --- |
| `'top'` (기본) | `[...createdRows, ...data]` | 신규 행이 목록 **상단** 블록 |
| `'bottom'` | `[...data, ...createdRows]` | 신규 행이 목록 **하단** 블록 |

- commit 시 `changeSet.created`는 `createdRows` **배열 순서**대로 전달된다.
- `apps/demo` `UserPage`는 prop을 넘기지 않아 **기본 top**이 적용된다. 하단 삽입이 필요하면 `createdRowPosition="bottom"`만 설정하면 된다 (코드 변경 불필요).

#### 현재 `addRow` 동작

```ts
setCreatedRows((current) => [...current, row]); // createdRows 끝에만追加
```

- `bottom`: 연속 Add 시 **맨 아래에 쌓임** — 의도와 일치.
- `top`: 연속 Add 시 **첫 Add가 0번 행을 유지**하고 이후 Add는 그 아래에 쌓임 (예: A 추가 → `[A, …data]`, B 추가 → `[A, B, …data]`). “매 Add마다 항상 0번 행” UX가 필요하면 prepend가 맞다.

#### 옵션화 범위 정리

| 수준 | 내용 | 상태 | 권장 |
| --- | --- | --- | --- |
| A | 화면 단위 `top` / `bottom` | **구현됨** | admin CRUD 기본. prop만 설정 |
| B | `top` + 연속 Add 시 prepend (항상 0번 행) | **미구현** | 소규모 수정. `top`일 때 `[row, ...current]` |
| C | `addRow({ position?: 'top' \| 'bottom' })` per-call | **미구현** | custom ActionBar용 2차 |
| D | 현재 행 / 선택 행 아래 삽입 | **구조 한계** | 1차 범위 밖 |
| E | 임의 `atIndex` 삽입 | **deferred** | gen-datagrid `insertRows` + data ownership 선행 |

#### 구조적 한계 (D, E)

created row는 `data`와 **별도 store**이며, 표시는 두 블록 병합만 지원한다.

```text
gridData = merge(createdRows 블록, data 블록)   // 중간 끼워넣기 불가
```

`afterCurrent` / `afterSelection` / `atIndex`는 단일 리스트 모델 전환 또는 gen-datagrid [`insertRows`](../../gen-datagrid/.docs/plan/remaining-work-plan.md) + [data ownership](../../gen-datagrid/.docs/architecture/handle-data-ownership-architecture.md) 결정 후에 검토한다. CRUD thin shell은 orchestration만 담당하므로 **1차로 arbitrary insert를 넣지 않는다.**

#### Backlog (문서·테스트·보완)

1. **문서** — `gen-datagrid-crud-package-design.md`·README에 `createdRowPosition` 사용 예시 보강 (이미 type에는 존재).
2. **테스트** — `createdRowPosition="bottom"` 시 신규 행이 `data` 뒤에 렌더되는지 `thinShell.test.tsx` 추가 (현재 테스트 없음).
3. **선택 구현 (B)** — `top`일 때 `addRow` prepend. breaking 여부: 연속 Add UX만 변경, commit `created` 순서는 “최신이 앞”으로 바뀜 → release note 필요.
4. **2차 (C)** — `addRow(options?)`와 focus 백로그(위 항목)를 같은 slice에서 row index 계산 공유.
5. **보류 (D, E)** — gen-datagrid backlog blocker로만 추적.

#### Focus 백로그와의 연동

Add 후 첫 editable 포커스 구현 시 신규 행 **row index**는 position에 의존한다.

- `top` + append(현재): `createdRows.length - 1`
- `top` + prepend(보완 후): `0`
- `bottom`: `data.length + createdRows.length - 1`

virtualized 그리드에서는 `scrollToCell` + edit start 순서를 position별로 고정한다.

### App Integration Expansion

- admin 화면 추가 연동 (demo D4 잔여)
- readonly/export 화면과 mutation 화면 workflow 차이 문서 보강

### Package Surface Cleanup

- `onStateChange` 발행 빈도·구독 가이드
- custom ActionBar + `useDataGridCrudController` 조합 예시 (Storybook)
- export Excel 실파일 생성은 app/workflow 후속

### Editor 제공 (범위 외)

cell editor·입력 format 정규화는 **gen-datagrid** 책임이다. CRUD는 editing runtime을 재구현하지 않는다.

- 구현·백로그: [`gen-datagrid` Built-in Editor Column Meta Extensions](../../gen-datagrid/.docs/plan/remaining-work-plan.md#built-in-editor-column-meta-extensions)
- app 연동: `GenDataGridCrud` `gridProps` / column `meta`로 위임. demo `userColumnEditors.tsx`는 Gate 4.3 완료 후 meta 전환 예정

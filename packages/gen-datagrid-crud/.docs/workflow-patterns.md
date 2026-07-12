<!--
 @file packages/gen-datagrid-crud/.docs/workflow-patterns.md
 @description Readonly / export / mutation workflow patterns for GenDataGridCrud app integration.
 @created 2026-07-12
-->

# GenDataGridCrud Workflow Patterns

app 화면을 `GenDataGridCrud`에 붙일 때 **조회(readonly)**, **export shell**, **mutation CRUD**를 구분한다.
공통 설계는 [gen-datagrid-crud-package-design.md](./gen-datagrid-crud-package-design.md), QA는 [app-integration-qa-guide.md](./app-integration-qa-guide.md).

## 패턴 요약

| 패턴 | `readonly` | `createRow` / `onCommit` | `onExport` | ActionBar 기본 |
| --- | --- | --- | --- | --- |
| **A. 조회** | `true` | 없음 | 없음 | filter · columns · (excel disabled) |
| **B. 조회 + export shell** | `true` | 없음 | 있음 | filter · columns · excel |
| **C. Mutation CRUD** | `false` | 둘 다 권장 | 선택 | add · delete · save · reset · filter · columns · excel |

`readonly`이고 `actionBar.includeBuiltIns`를 **생략**하면 mutation 버튼(add/delete/save/reset)은 **숨긴다** (disabled로 남기지 않음). 명시적으로 `includeBuiltIns`를 주면 그 목록을 따른다.

---

## A. Readonly 조회

용도: 실적·리포트·참조 목록. 편집/저장 없음.

```tsx
<GenDataGridCrud
  title="Actuals"
  readonly
  data={rows}
  columns={columns}
  getRowId={(row) => row.rowId}
  dataVersion={dataVersion}
  // createRow / onCommit 생략
  actionBar={{
    // 기본값과 동일하면 생략 가능
    includeBuiltIns: ['filter', 'columnReorder'],
    customActions: [
      { key: 'search', label: 'Search', side: 'left', order: 1, onClick: onSearch },
    ],
  }}
  gridProps={{ enableVirtualization: true, style: { height: '100%' } }}
/>
```

demo: `apps/demo/src/pages/co/actuals/ActualsPage.tsx` (export 포함 → 패턴 B에 가깝다).

---

## B. Readonly + export shell

용도: 조회 + Excel 버튼. **실파일 생성은 app `onExport` 책임** (CRUD는 source만 전달).

```tsx
<GenDataGridCrud
  readonly
  data={rows}
  columns={columns}
  getRowId={(row) => row.id}
  onExport={({ data, sourceData, state }) => {
    // app: CSV/XLSX 생성 또는 서버 download URL
    console.log(data.length, sourceData.length, state.filterEnabled);
  }}
/>
```

`onExport`가 없으면 Excel은 disabled. `canExport`는 boolean으로 state에 노출된다.

---

## C. Mutation CRUD

용도: 관리 화면. created / dirty / deleted → `onCommit(changeSet)`.

```tsx
<GenDataGridCrud
  data={rows}
  columns={columns}
  getRowId={(row) => row.id}
  createRow={() => newEmptyRow()}
  createdRowPosition="top" // 연속 Add = prepend
  validateCommit={validate}
  onCommit={async ({ changeSet }) => {
    await api.save(changeSet);
    return { ok: true };
  }}
  onCommitSuccess={() => queryClient.invalidateQueries(...)}
  gridProps={{ enableRowSelection: true }}
/>
```

권장:

- 조회는 react-query 등 외부, `data`는 controlled
- `validateCommit` 실패 시 `onCommit` 미호출 · fieldErrors → cell marker
- Save는 dirty 여부와 무관하게(readonly/committing만) 활성 — flushEditing으로 최신 draft 반영

demo:

- `apps/demo/src/pages/admin/user/UserPage.tsx` — reference mutation + masterDetail
- `apps/demo/src/pages/admin/menu/MenuPage.tsx` — tree + mutation
- `apps/demo/src/pages/customer/customer-info/CustomerInfoPage.tsx` — editor 회귀

---

## 선택 가이드

```text
편집이 필요한가?
  no  → readonly
         export 버튼 필요? → onExport (B) / 아니면 (A)
  yes → createRow + onCommit (C)
         master-detail / tree / lookup 은 gen-datagrid column meta·gridProps·masterDetail
```

V1 `GenGridCrud`에서 옮길 때: [gen-grid-crud-migration-guide.md](./gen-grid-crud-migration-guide.md).

## demo D4 연동 현황 (2026-07-12)

| 화면 | 패턴 | 상태 |
| --- | --- | --- |
| UserManagement | C | ✅ |
| MenuManagement | C (tree) | ✅ |
| Actuals | B | ✅ |
| CustomerInfo | C | ✅ (편집 회귀) |
| Lkup / Role / Notice / Message / UserRole | — | ⏸ demo D4 follow-up |

CRUD 패키지 #3은 **workflow 문서 + 현재 demo 기준 QA 갱신 + readonly ActionBar 기본값**까지 포함한다. 추가 admin 페이지 이식은 `apps/demo` D4 잔여로 추적한다.

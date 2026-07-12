<!-- packages/gen-datagrid-crud/.docs/app-integration-qa-guide.md
Defines app-level QA checks for GenDataGridCrud integrations.
-->

# GenDataGridCrud App Integration QA Guide

## 대상

`GenDataGridCrud`를 app 화면에 연결한 뒤 확인할 QA 항목이다.

워크플로 패턴(조회 / export / mutation): [workflow-patterns.md](./workflow-patterns.md)

### demo 기준 화면 (2026-07-12)

| 화면 | 경로 | 패턴 |
| --- | --- | --- |
| UserManagement | `apps/demo/.../admin/user/UserPage.tsx` | mutation |
| MenuManagement | `apps/demo/.../admin/menu/MenuPage.tsx` | mutation + tree |
| Actuals | `apps/demo/.../co/actuals/ActualsPage.tsx` | readonly + export shell |
| CustomerInfo | `apps/demo/.../customer-info/CustomerInfoPage.tsx` | mutation (editor 회귀) |

## 공통 확인

- 화면이 렌더링된다.
- ActionBar가 한 줄로 유지된다.
- row count가 화면 데이터 수와 맞는다.
- filter toggle이 grid filter 표시를 바꾼다.
- Excel은 `onExport`가 있을 때 활성화된다.
- custom action이 동작한다.
- **readonly**이고 `includeBuiltIns`를 생략하면 add/delete/save/reset이 **표시되지 않는다**.

## Grid 확인

- row height가 의도한 값이다.
- virtualization 화면에서 스크롤이 끊기지 않는다.
- current row highlight가 클릭/키보드 이동 시 갱신된다.
- pinned column이 있으면 horizontal scroll 시 유지된다.
- column resize가 동작한다.
- `dataVersion` 변경 시 dirty/delete marker가 초기화된다.

## Mutation CRUD 확인

- active editor 상태에서 Save해도 최신 값이 payload에 포함된다.
- created row는 Save 전까지 `created`로 표시된다.
- `createdRowPosition="top"`이면 연속 Add 시 최신 행이 0번이다.
- validation 실패 시 `onCommit`이 호출되지 않는다.
- 서버 field error는 cell marker로 표시된다.
- 저장 실패 시 created/dirty가 유지되고, 성공 시 정리된다.

## Readonly / export 확인

- 편집 진입이 되지 않는다 (`readonly`).
- ActionBar에 mutation 버튼이 없다(기본값) 또는 `includeBuiltIns`로만 제어한다.
- Search / Refresh 등 custom action이 조회를 갱신한다.
- Excel은 shell만이면 alert/log로도 충분하고, 실파일은 app `onExport` 구현 후에 확인한다.

## 화면별 체크

### UserPage

- FilterBar 검색 → refetch
- Add / 편집 / Save / Reset 한 사이클
- MasterDetail expand · org lookup · useYn Switch

### MenuPage

- tree expand/collapse
- Add / Save mock commit

### ActualsPage

- Fiscal Month / Org / Account filter + Search
- Settings dialog · Refresh
- Excel export shell

### CustomerInfoPage

- text/select/date editor · click continuation
- MDI에서 다른 탭을 열 때 로딩이 멈추지 않음 ([customer-info-loading-loop.md](./customer-info-loading-loop.md))

## Known Gaps

- chart context menu / range chart (D5 · gen-datagrid-chart)
- real Excel file generation (app workflow)
- V1 admin 잔여: Lkup / Role / Notice / Message / UserRole (demo D4 follow-up)
- GenGridCrud action bar style 옵션

## Verification Commands

```bash
pnpm -C packages/gen-datagrid-crud test
pnpm -C packages/gen-datagrid-crud build
pnpm -C apps/demo exec tsc --noEmit
```

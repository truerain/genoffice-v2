<!-- packages/gen-datagrid/.docs/plan/edit-lookup-plan.md
Executable plan for editType lookup + editLookup meta built-in editor.
-->

# Edit Lookup Plan

Status: **complete** (2026-07-10).

Architecture: [../architecture/edit-lookup-architecture.md](../architecture/edit-lookup-architecture.md)

## 요약

`meta.editType: 'lookup'` 및/또는 `meta.editLookup`으로 **built-in lookup editor**를 제공한다. Grid가 셀 shell + modal lifecycle을 소유하고, app은 `editLookup.renderModal`만 구현한다.

## 선행 조건

- Gate 4.1-d blur / modal editor surface ✅
- Storybook `ModalLookupEditor`, demo `orgLookupEditor` (참조 구현) ✅
- Built-in Editor Meta 4.3-a (text preset 파이프라인) ✅ — lookup과 **분리** 유지

## 구현 slice

### Slice 1 — Types + lookup 판정

**목표:** public 타입·column meta·editor 분기 진입점.

| 작업 | 산출 |
| --- | --- |
| `GenDataGridBuiltinEditType` += `'lookup'` | `GenDataGrid.types.ts` |
| `GenDataGridEditLookupConfig`, `GenDataGridLookupModalContext` | `GenDataGrid.types.ts` |
| `meta.editLookup?` | `GenDataGridColumnMeta` |
| `isLookupColumn(meta)`, `resolveEditLookupConfig(meta)` | `features/editing/resolveEditLookup.ts` |
| dev: `editType==='lookup'` && !`editLookup` → console warn | resolver |

**Exit criteria:**

- TypeScript: `editLookup.renderModal` 필수
- `editLookup`만으로 lookup column 타입 가능

### Slice 2 — LookupCellEditor + renderEditor 파이프라인

**목표:** built-in lookup shell + editor 우선순위 연결.

| 작업 | 산출 |
| --- | --- |
| `LookupCellEditor` | `features/editing/LookupCellEditor.tsx` |
| `renderEditor.tsx` — lookup 분기 (`isLookupColumn` && !custom renderEditor) | |
| default `blurOwnership: 'modal'` for lookup | `editorContext.ts` / resolver |
| `allowCellEdit` false → readOnly input + trigger | LookupCellEditor |
| `allowCellEdit` true → editable input + trigger + keyword in modal ctx | |
| `getDisplayValue` 적용 | |

**Exit criteria:**

- `renderEditor` 없이 `editLookup`만으로 편집 진입·modal open
- 기존 `DefaultCellEditor` / custom `renderEditor` 회귀 없음

### Slice 3 — Tests + Storybook

| 작업 | 산출 |
| --- | --- |
| unit: `isLookupColumn`, config resolve | `test/resolveEditLookup.test.ts` |
| interaction: modal open, select → commit, Escape, blur, `allowCellEdit` | `test/interaction.test.tsx` 또는 전용 파일 |
| Storybook: `Gate41LookupEditor` (mock `renderModal`) | `GenDataGrid.baseline.stories.tsx` |

**Exit criteria:** `pnpm -C packages/gen-datagrid test` 통과

### Slice 4 — Demo migration

| 작업 | 산출 |
| --- | --- |
| `orgName` 컬럼 → `editType: 'lookup'` + `editLookup` | `userColumns.ts` |
| `OrgPickerModal` (또는 기존 modal 본문 분리) | `orgLookupModal.tsx` 등 |
| `orgLookupEditor.tsx` 삭제 또는 deprecated wrapper | |
| `editBlurOwnership: 'modal'` 중복 제거 가능 여부 검토 | meta default |

**Exit criteria:** demo UserPage 부서 lookup 수동 QA — 기존과 동일 commit/dirty

### Slice 5 — Reference docs

| 작업 | 산출 |
| --- | --- |
| `cell-edit-api.md` — `editLookup`, `editType: lookup` | |
| `api-structure.md`, `editor-implementation-contract.md` — lookup 절 | |
| `remaining-work-plan.md` — 항목 status 갱신 | |

## Deferred (2차)

| 항목 | 설명 |
| --- | --- |
| `editLookup.mode: 'popover'` | Gate 4.1-d popover lookup; anchor positioning |
| `editLookup.fetchItems` + grid 내장 목록 UI | `ui/ModalInput` 어댑터는 **demo/shared helper** 우선 |
| `editLookup` + display/value **듀얼 필드** helper | `valueColumnId` / `onSelect(patch)` — demo mapper |
| display-only lookup (`renderCell` 버튼, 비편집) | `emitCellValueChange` 패턴 문서화만 |
| CRUD-level `editLookup` sugar | 필요 시 이후; 1차는 column meta only |

## 범위 외

- `GenDataGridEditTypePreset` 변경
- gen-datagrid → `@gen-office/ui` 의존성 추가
- gen-datagrid-crud API 변경

## 파일 목록 (예상)

```text
packages/gen-datagrid/
  src/
    GenDataGrid.types.ts
    features/editing/
      resolveEditLookup.ts
      LookupCellEditor.tsx
      renderEditor.tsx
      editorContext.ts
    index.ts                    (type export)
  test/
    resolveEditLookup.test.ts
    interaction.test.tsx        (lookup cases)
  src/stories/
    GenDataGrid.baseline.stories.tsx
  .docs/
    architecture/edit-lookup-architecture.md
    plan/edit-lookup-plan.md

apps/demo/
  src/pages/admin/user/
    userColumns.ts
    orgLookupModal.tsx          (신규 또는 분리)
    orgLookupEditor.tsx         (삭제 목표)
```

## 검증

```bash
pnpm -C packages/gen-datagrid build
pnpm -C packages/gen-datagrid test
pnpm -C apps/demo exec tsc --noEmit
```

수동 QA:

- F2 / double-click → lookup editor
- trigger / focus → modal
- 행 선택 → commit / dirty
- Escape / backdrop / 타 셀 클릭 → Gate 4.1-d
- `allowCellEdit: true/false` 각각

## 마이그레이션 (app)

**Before** (`renderEditor` 전체):

```ts
meta: {
  editable: true,
  editBlurOwnership: 'modal',
  renderEditor: createOrgLookupEditor(orgs),
}
```

**After**:

```ts
meta: {
  editable: true,
  editType: 'lookup',
  editLookup: {
    allowCellEdit: false,
    getDisplayValue: (_, { row }) => row.orgName ?? '',
    renderModal: (ctx) => <OrgPickerModal ctx={ctx} orgs={orgs} />,
  },
}
```

`renderEditor`는 **완전 커스텀**이 필요할 때만 유지.

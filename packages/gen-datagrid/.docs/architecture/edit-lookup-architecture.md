<!-- packages/gen-datagrid/.docs/architecture/edit-lookup-architecture.md
Defines built-in lookup editor architecture (editType lookup + editLookup meta).
-->

# Edit Lookup Architecture

Status: **complete** (2026-07-10).

Plan: [../plan/edit-lookup-plan.md](../plan/edit-lookup-plan.md)

## 목표

modal/popover **lookup** 컬럼에서 app이 **셀 input shell·blur·keyboard·portal 생명주기를 재구현하지 않도록** 한다.

- **Grid:** lookup 셀 editor shell (표시값 input, trigger 버튼, modal open/close, Gate 4.1-d blur)
- **App:** `editLookup.renderModal` — 조회 UI·API만 정의

배경: `apps/demo` `orgLookupEditor.tsx`는 `renderEditor`로 input + portal + blur handler를 매번 복제한다. [remaining-work-plan](../plan/remaining-work-plan.md) 4.3-a 범위 밖으로 **modal lookup**을 명시했으나, 선언형 meta로 승격할 시점이다.

## 비목표

- `GenDataGridEditTypePreset`에 `modal` / `lookup` 추가 (preset은 **text normalize sugar** 전용)
- `@gen-office/ui` `ModalInput`을 gen-datagrid 패키지 의존성으로 **강결합**
- 도메인 API·React Query를 grid가 소유
- display-only 셀 버튼 (`renderCell` + `emitCellValueChange`) — 별도 패턴; lookup은 **편집 모드 editor** 기준

## 패키지 경계

```text
apps/demo
  editLookup.renderModal(ctx)     ← 도메인 modal / 조회 API
       │
       ▼
@gen-office/gen-datagrid
  LookupCellEditor (built-in shell)
  Gate 4.1-d blur / registerEditorSurface
       │
       ▼ (선택) demo에서 ui ModalInput 조합 — grid 패키지 밖
@gen-office/ui
  ModalInput (fetchItems, list UI)
```

| 레이어 | 책임 |
| --- | --- |
| gen-datagrid | lookup 활성 판정, editor shell, modal portal mount, `GenDataGridLookupModalContext` |
| apps/demo | `renderModal`, 도메인 fetch, 표시값 resolve (`getDisplayValue`) |
| gen-datagrid-crud | **변경 없음** — column meta를 grid에 그대로 전달 |

## Lookup 활성 조건

컬럼이 lookup editor로 동작하는 조건 (**OR**):

1. `meta.editType === 'lookup'`
2. `meta.editLookup` 정의됨

```ts
function isLookupColumn(meta): boolean {
  return meta.editType === 'lookup' || meta.editLookup != null;
}
```

| 설정 | 동작 |
| --- | --- |
| `editLookup` + `editType: 'lookup'` | lookup (권장, 명시적) |
| `editLookup`만 | lookup (`editType` 생략 가능) |
| `editType: 'lookup'`만, `editLookup` 없음 | **구성 오류** — dev 경고 + 편집 불가 fallback |
| `editType: 'text'` + `editLookup` | **lookup 우선** (`text` built-in 무시) |
| `renderEditor` + `editLookup` | **`renderEditor` 최우선** (현행 contract 유지) |

## `editType: 'lookup'` vs `editLookup`

- **`editType: 'lookup'`** — `GenDataGridBuiltinEditType`에 추가. **에디터 종류 라벨** (preset 아님).
- **`editLookup`** — lookup 동작에 필요한 **설정 객체**. `renderModal` 등 실제 contract.

`resolveInputEditType('lookup')`는 **text 계열 shell**을 쓰지 않고, lookup 전용 renderer로 분기한다 (preset 파이프라인과 무관).

## Editor 렌더 우선순위

```text
1. column.meta.renderEditor
2. grid.editorFactory (column renderEditor 없을 때)
3. editLookup / editType lookup  →  LookupCellEditor
4. built-in DefaultCellEditor (editType text, select, …)
```

## Public API

### `GenDataGridBuiltinEditType` 확장

```ts
export type GenDataGridBuiltinEditType =
  | 'text'
  | 'number'
  | 'date'
  | 'select'
  | 'textarea'
  | 'checkbox'
  | 'lookup';
```

### `GenDataGridColumnMeta.editLookup`

```ts
type GenDataGridEditLookupMode = 'modal' | 'popover';

type GenDataGridEditLookupConfig<TData> = {
  /** 기본 'modal'. popover는 2차 slice */
  mode?: GenDataGridEditLookupMode;

  /**
   * 셀 안 input 직접 타이핑 허용.
   * - false (기본): readOnly 표시 + trigger로만 modal
   * - true: input 편집 가능 + trigger로 modal (검색어 초기값으로 draft 전달 가능)
   */
  allowCellEdit?: boolean;

  /** 저장값 → 셀 표시 문자열. 미지정 시 String(value) */
  getDisplayValue?: (value: unknown, ctx: GenDataGridEditableContext<TData>) => string;

  /** modal/popover 본문. grid가 portal·surface·open state 소유 */
  renderModal: (ctx: GenDataGridLookupModalContext<TData>) => React.ReactNode;

  /** trigger 버튼 aria-label. 미지정 시 columnId 기반 */
  triggerAriaLabel?: string;
};
```

`editLookup`는 **`renderModal` 필수**. `fetchItems`만으로 동작하는 declarative API는 **2차** — `@gen-office/ui` `ModalInput` 어댑터는 demo/shared 또는 optional helper로 분리.

### `GenDataGridLookupModalContext`

`GenDataGridEditorContext`를 확장한다.

```ts
type GenDataGridLookupModalContext<TData> = GenDataGridEditorContext<TData> & {
  /** meta.editLookup.allowCellEdit resolved */
  allowCellEdit: boolean;
  /** 셀 표시용 문자열 (getDisplayValue 적용) */
  displayValue: string;
  /** modal을 연 시점의 인라인 검색어 힌트 (allowCellEdit true일 때 draft 기반) */
  keyword?: string;
  closeModal: () => void;
};
```

`renderModal`에서 `ctx.applyValue(id)`를 호출하면 값은 dirty/commit 경로로 반영하되,
**현재 lookup 편집 상태는 유지**한다. 이후 `ctx.closeModal()`로 input focus로 복귀한다.
`GenDataGridLookupModalContext`의 `ctx.commit()`도 같은 유지 경로를 사용하며,
`ctx.cancel()`은 modal만 닫는다. 취소·backdrop·Escape도 editor를 종료하지 않는다.

### Blur / keyboard (Gate 4.1-d)

| 항목 | lookup 기본값 |
| --- | --- |
| `meta.editBlurOwnership` | 미지정 시 **`'modal'`** (lookup column resolver가 주입) |
| `registerEditorSurface` | modal portal root에 **필수** |
| Escape (modal 열림/닫힘) | modal만 닫기, 편집 유지 |
| 다른 셀 activate | modal-owned 정책 ([editor-implementation-contract.md](../reference/editor-implementation-contract.md)) |

`allowCellEdit: false`일 때 input은 `readOnly`. **modal은 trigger 버튼 클릭(또는 trigger 포커스 후 Enter/Space)으로만** 연다. 편집 진입·input focus만으로는 modal을 열지 않는다.

`allowCellEdit: true`일 때 `editMaxLength`·`editNormalize` 등 text meta는 **allowCellEdit true인 lookup에만** 기존 파이프라인 적용 (선택 slice 2).

## Built-in shell (LookupCellEditor + LookupDisplayCell)

**표시 모드 (`LookupDisplayCell`):** 편집 중이 아닐 때 `getDisplayValue` 텍스트 + **조회 trigger 버튼**(돋보기 아이콘). 버튼 클릭 → 편집 진입 + `openLookupModal: true`로 modal open.

**편집 모드 (`LookupCellEditor`):**

```text
[ readOnly or text input — displayValue / draft ]
[ trigger button — opens modal ]
{ open && createPortal(renderModal(ctx), document.body) }
```

`meta.renderCell`이 있으면 표시 모드 shell은 **사용하지 않는다** (app이 표시·버튼을 직접 구현). `columnDef.cell`만 있고 `editLookup`이 있으면 **lookup display shell이 우선**한다.

- className: `gen-datagrid__editor`, `gen-datagrid__lookup-trigger` (CSS 토큰화)
- `data-gen-datagrid-editor-surface="true"` on modal root
- Storybook `ModalLookupEditor` / demo `orgLookupEditor`와 **동일 blur 계약**, shell만 grid 소유

## 타입 안전 (권장)

`editType: 'lookup'`이면 `editLookup` 필수 — TypeScript helper type 또는 column meta discriminated union (구현 slice 1에서 확정).

`editLookup`만 있을 때 `editType` 생략 허용.

## 소비 예 (demo `orgName` 목표)

```ts
{
  accessorKey: 'orgName',
  meta: {
    editable: true,
    editType: 'lookup',
    editBlurOwnership: 'modal',
    editLookup: {
      allowCellEdit: false,
      getDisplayValue: (_v, { row }) => row.orgName ?? '',
      renderModal: (ctx) => (
        <OrgPickerModal
          keyword={ctx.keyword}
          onSelect={(org) => {
            ctx.applyValue(org.orgId);
            ctx.closeModal();
          }}
          onCancel={ctx.closeModal}
        />
      ),
    },
  },
}
```

실제 commit은 grid dirty 경로 — orgId는 **별도 컬럼** 또는 `applyValue` + display 컬럼 패턴은 demo에서 `orgId` 필드와 연동 (기존과 동일: editor가 `orgId`를 commit, `orgName`은 lookup 표시 컬럼).

## 참고

- Gate 4.1: [gate-4-1-editing-policy-architecture.md](./gate-4-1-editing-policy-architecture.md)
- Editor contract: [../reference/editor-implementation-contract.md](../reference/editor-implementation-contract.md)
- demo 현행: `apps/demo/src/pages/admin/user/orgLookupEditor.tsx`
- ui: `packages/ui` `ModalInput` (grid 패키지 직접 import 금지)

## Exit criteria (architecture)

- lookup 활성 조건·우선순위·`allowCellEdit`·modal context가 문서화됨
- preset `modal`과 역할 분리가 명확함
- gen-datagrid-crud / gen-datagrid 패키지 경계 유지

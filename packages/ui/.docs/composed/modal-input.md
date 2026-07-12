<!--
 @file packages/ui/.docs/composed/modal-input.md
 @description Architecture and Gate plan for ModalInput (C8).

 @created 2026-06-25

 @remark
 - V1 이관: packages/ui/src/composed/modalInput/
 - PopupInput 제외 — C8은 ModalInput 단독
-->
# ModalInput

코드·마스터 lookup용 **검색 모달 피커** composed입니다.  
core **Input** (trigger) + **Dialog** (검색·목록·확인/취소) 패턴이며, V1 이관본을 **C8 Gate**에서 V2 관례에 맞게 정리합니다.

---

## 1. Wave 순서

```text
C7  TreeCombobox
C8  ModalInput                        ← 본 문서
C9  TreeView (`composed/treeView`)
```

> **PopupInput 제외:** flat 옵션은 Combobox/TreeCombobox, 커스텀 팝오버 슬롯은 V2 범위 밖. lookup은 ModalInput으로 통일.

---

## 2. 컴포넌트

| 모드 | value | UX |
| --- | --- | --- |
| `single` | `selectedItem` | 검색 → draft 선택 → 확인/취소 |
| `multi` | `selectedItems[]` | 다중 draft, "선택만 보기", `first +N` 표시 |

Combobox와 구분: **모달 Dialog**, 목록이 넓거나 **컬럼 테이블**, **원격 검색** (`fetchItems`), **확인 전 draft** 탐색.

---

## 3. 레이어·의존

```text
core/Input, Button    ← trigger field, modal search, footer actions
core/Dialog           ← modal shell, draggable header
composed/ModalInput   ← localFilter, fetchItems, list/table, draft commit
```

| 책임 | 위치 |
| --- | --- |
| trigger Input·clear·suffix | ModalInput |
| modal open/close | core Dialog |
| 검색·필터·목록·draft | ModalInput |
| 확정 (`onCommit`) | ModalInput |

`data-gen-grid-editor-overlay` — 그리드 인라인 에디터 연동용 attribute 유지.

### 모달 크기·스크롤

| 영역 | 결정 방식 |
| --- | --- |
| **가로** | CSS `min(42rem, 100vw - 2rem)`; `modalWidth`로 override |
| **모달 전체 세로** | `modalHeight` 지정 시 Dialog에 **고정 height** (`min(prop, 85vh)`). 미지정 시 내용만큼 커지고 `max-height: 85vh` |
| **본문** | header/footer 사이 flex fill; 목록만 스크롤 |
| **목록 스크롤** | `.listWrap`만 `overflow: auto` |

### grid lookup (`hideTrigger`)

GenDataGrid `editLookup.renderModal`처럼 **셀 shell은 grid가 소유**할 때:

| Prop | 용도 |
| --- | --- |
| `hideTrigger` | 필드 Input/trigger 숨김, Dialog만 렌더 |
| `open` / `onOpenChange` | portal 생명주기와 동기화 |
| `defaultSearchValue` | 셀 draft keyword → 모달 검색 초기값 |
| `commitOnItemClick` | single에서 행 클릭 즉시 commit (Confirm 숨김) |
| `dialogContentRef` | `registerEditorSurface`용 DialogContent |
| `draggable={false}` | lookup 모달에서 드래그 비활성(선택) |

`DialogContent`에 `data-gen-datagrid-editor-surface`를 설정한다. demo 예: `apps/demo/.../orgLookupModal.tsx`.

### multi `selectedTooltip`


| Prop | 기본 | 설명 |
| --- | --- | --- |
| `selectedTooltip` | `'auto'` | `'auto'`: 2개 이상 선택 시 tooltip · `true`/`false` 강제 |
| `formatSelectedTooltip` | label join | tooltip content 커스터마이즈 |

modal이 열린 동안 tooltip은 비활성화됩니다. tooltip은 input **위쪽**(`side="top"`)에 표시됩니다.

---

## 4. C8 작업 (이관본 → Gate)

| 항목 | 이관본 | C8 목표 |
| --- | --- | --- |
| 파일 헤더 | 없음 | Gate 필수 |
| default export | 있음 | named export only |
| `clsx` | 사용 중 | 유지 |
| Input | `autoSelect={false}` | 유지 |
| FilterBar | 없음 | `custom` render로 연동 (전용 type 없음) |
| tests · stories | 없음 | Gate 필수 |
| PopupInput | V1 이관본 | **삭제** |

---

## 5. FilterBar 연동

모달 UX 특성상 FilterBar **전용 field type은 두지 않음**.  
lookup이 필요한 필터는 `type: 'custom'` + `ModalInput` render prop으로 조합.

```tsx
{
  key: 'vendorId',
  label: 'Vendor',
  type: 'custom',
  render: (value, onChange) => (
    <ModalInput
      mode="single"
      items={vendorItems}
      selectedItem={findByValue(vendorItems, value)}
      onCommit={(item) => onChange(item?.value ?? '')}
      placeholder="Select vendor"
      fullWidth
    />
  ),
}
```

---

## 6. Gate 체크리스트 (C8) — 완료

- [x] 파일 헤더, `clsx`, `@remark`
- [x] ModalInput — named export only, Input `autoSelect={false}`
- [x] PopupInput 소스·문서 참조 제거
- [x] Vitest composed tests (10건)
- [x] Storybook `UI/Composed/ModalInput`
- [x] Storybook 수동 — search, single/multi, table columns, confirm/cancel, clear, tooltip, light/dark
- [x] `implementation-log.md`
- [x] `filter-bar.md` C8 항목

---

## 7. Storybook (목표)

- **Single:** Default, WithTableColumns, Controlled, RemoteSearch
- **Multi:** Default, MultiSelectedTooltip
- **States:** Disabled, RemoteSearch, Controlled

관련: [migration-plan.md](../migration-plan.md), [filter-bar.md](./filter-bar.md)

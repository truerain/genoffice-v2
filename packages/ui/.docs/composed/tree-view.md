<!--
 @file packages/ui/.docs/composed/tree-view.md
 @description Architecture and Gate plan for TreeView (C9).

 @created 2026-06-25

 @remark
 - V1 이관: packages/ui/src/composed/treeView/
 - core Tree 패널 chrome; SplitLayout 좌측 pane 용도
-->
# TreeView

core **Tree**를 감싼 **탐색 패널** composed입니다.  
제목·전체 펼치기/접기·스크롤 body를 제공하며, 메뉴/조직 관리 화면의 **SplitLayout 좌측**에 둡니다.

---

## 1. Wave 순서

```text
C8  ModalInput
C9  TreeView                         ← 본 문서
```

---

## 2. TreeCombobox와 구분

| | TreeView | TreeCombobox |
| --- | --- | --- |
| **역할** | 영역 탐색 패널 | dropdown 선택 필드 |
| **위치** | `composed/treeView` | `composed/treeCombobox` |
| **셸** | title + expand/collapse all + Tree | Input + Popover + tree |
| **데이터** | core `Tree` flat `id` / `parent_id` | flat `id` / `parentId` options |

---

## 3. 레이어·의존

```text
core/Button, Tree     ← expand/collapse all + tree body
composed/TreeView     ← panel chrome, expanded state bridge
```

| 책임 | 위치 |
| --- | --- |
| tree render·node UX | core `Tree` |
| panel border·header·scroll | TreeView |
| 부모 높이 | 호출자 (`height: 100%`, `min-height: 0`) |

---

## 4. C9 작업 (이관본 → Gate)

| 항목 | 이관본 | C9 목표 |
| --- | --- | --- |
| 파일 헤더 | 없음 | Gate 필수 |
| `TreeView.types` import | `core/Tree` | `core/tree` |
| expand/collapse all | icon only | `aria-label` |
| tests · stories | 없음 | Gate 필수 |
| FilterBar | 없음 | 연동 없음 (패널 위젯) |

---

## 5. 레이아웃 계약

```text
SplitLayout (composed/splitLayout)
  ├── left: TreeView (height 100%)
  └── right: detail / GenDataGrid
```

---

## 6. Gate 체크리스트 (C9) — 완료

- [x] 파일 헤더, `clsx`, `@remark`
- [x] TreeView — `core/tree` import, header `aria-label`
- [x] Vitest composed tests (5건)
- [x] Storybook `UI/Composed/TreeView`
- [x] Storybook 수동 — expand/collapse all, selection, SplitLayout 조합, light/dark
- [x] `implementation-log.md`

---

## 7. Storybook (목표)

- **TreeView:** Default, ControlledSelection, WithoutControls, WithSplitLayout

관련: [migration-plan.md](../migration-plan.md), [core/tree.md](../core/tree.md), [split-layout.md](./split-layout.md)

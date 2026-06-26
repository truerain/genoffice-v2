<!--
 @file packages/ui/.docs/composed/tree-combobox.md
 @description Architecture and Gate plan for TreeCombobox (C7).

 @created 2026-06-25

 @remark
 - V1 이관: packages/ui/src/composed/treeCombobox/
 - FilterBar tree-combo 연동 (C7)
-->
# TreeCombobox

계층 옵션을 **flat `id` / `parentId` list**로 받아 tree dropdown을 렌더하는 composed입니다.  
Combobox(C6)와 동일하게 core **Input** + **Popover** 위에 tree expand·filter·keyboard를 올립니다.

---

## 1. Wave 순서

```text
C6  Combobox / MultiCombobox
C7  TreeCombobox                    ← 본 문서
```

---

## 2. 옵션 모델

| 필드 | 설명 |
| --- | --- |
| `id` | 노드 고유 id (`string \| number`) |
| `parentId` | 부모 id; root는 `null` / omit |
| `value` | 선택 값 (leaf; `selectLeafOnly={false}` 시 branch도 가능) |
| `label` | 표시 텍스트 |

filter 시 매칭 노드 + ancestor + descendant를 flat list로 펼칩니다.

첫 open 시 (uncontrolled, filter 없음):

- **`expandRootsOnOpen`** (default `true`) — root 노드 자동 expand
- 선택 값이 있으면 해당 노드까지 ancestor path도 expand
- popover **min-height** 6행 — 한 줄짜리 얇은 패널 방지

| Prop | 기본 | 설명 |
| --- | --- | --- |
| `selectLeafOnly` | `true` | branch는 expand/collapse만; leaf만 value 선택 |
| `expandRootsOnOpen` | `true` | 첫 open 시 root expand |

---

## 3. 레이어·의존

```text
core/Input, Popover     ← anchor + trigger
composed/TreeCombobox   ← buildTree, visible nodes, tree keyboard
```

core `Tree` primitive와 별개 — dropdown 전용 flat-tree 빌더를 composed 내부에 둡니다.

---

## 4. C7 작업 (이관본 → Gate)

| 항목 | 이관본 | C7 목표 |
| --- | --- | --- |
| Popover anchor | Radix 직접 | `PopoverAnchor` |
| Input | `autoSelect` 미설정 | `autoSelect={false}` |
| 파일 헤더 | 없음 | Gate 필수 |
| default export | 있음 | named only |
| FilterBar | 없음 | `tree-combo` |
| tests · stories | 없음 | Gate 필수 |

---

## 5. FilterBar 연동

| FilterField `type` | 위젯 | `TFilters[key]` |
| --- | --- | --- |
| `tree-combo` | `TreeCombobox` | `string` |

필드 옵션: `treeOptions: TreeComboboxOption[]` (flat id/parentId)

---

## 6. Gate 체크리스트 (C7)

- [x] 파일 헤더, `clsx`, `@remark`
- [x] TreeCombobox — Input `autoSelect={false}`, PopoverAnchor
- [x] Vitest composed tests
- [x] Storybook `UI/Composed/TreeCombobox`
- [x] StandardFilterBar `tree-combo`
- [ ] Storybook 수동 — expand, filter, keyboard, clear, light/dark
- [x] `implementation-log.md`

---

## 7. Storybook (목표)

- **TreeCombobox:** Default, Expanded, Filter, Clearable, Disabled
- **StandardFilterBar:** `WithTreeComboField`

관련: [combobox.md](./combobox.md), [filter-bar.md](./filter-bar.md)

<!--
 @file packages/ui/.docs/core/tree.md
 @description Architecture and usage notes for Tree core component.

 @created 2026-06-24
-->
# Tree (`core/tree`)

평면 배열 데이터로 계층 목록을 렌더하는 **트리** UI입니다. V1 custom 구현을 이식했으며 **Radix primitive가 아닙니다**.

| 특성 | 설명 |
| --- | --- |
| 데이터 | flat `data[]` + `getId` / `getParentId` / `getLabel` |
| 확장 | controlled `expandedIds` 또는 `defaultExpandedIds` |
| 선택 | `selectedId` + `onSelect(item)` |
| Composed | Wave 5 `TreeView`, `TreeCombobox`가 이 primitive 조합 |

## 파일

```text
packages/ui/src/core/tree/
├── Tree.tsx
├── Tree.types.ts
├── Tree.module.css
├── Tree.stories.tsx
└── index.ts
```

Public export: `Tree`, `TreeProps`, `TreeId`

## API

| Prop | 타입 | 기본 | 설명 |
| --- | --- | --- | --- |
| `data` | `readonly TItem[]` | — | 노드 목록 |
| `getId` | `(item) => TreeId` | `item.id` | 노드 ID |
| `getParentId` | `(item) => TreeId \| null` | `item.parent_id` | 부모 ID |
| `getLabel` | `(item) => ReactNode` | `item.label` | 표시 라벨 |
| `expandedIds` | `TreeId[]` | — | controlled 확장 |
| `defaultExpandedIds` | `TreeId[]` | — | uncontrolled 초기 확장 |
| `onExpandedIdsChange` | `(ids) => void` | — | 확장 변경 |
| `selectedId` | `TreeId` | — | 선택 ID |
| `onSelect` | `(item) => void` | — | 노드 선택 |
| `indent` | `number` | `16` | depth 들여쓰기(px) |

```tsx
<Tree
  data={nodes}
  defaultExpandedIds={['org']}
  selectedId={selectedId}
  onSelect={(node) => setSelectedId(node.id)}
/>
```

## 스타일·토큰

| 영역 | 토큰 |
| --- | --- |
| text | `--color-fg-primary` |
| hover / selected bg | `--color-bg-secondary`, `--color-bg-tertiary` |
| toggle / label `:focus-visible` | `--button-focus-ring` |

## Storybook

- **Tree:** `UI/Core4-navigation/Tree` — Default, ControlledSelection, ControlledExpand, CustomIndent

## Gate 체크리스트 (Wave 4-18)

- [x] 파일 헤더, `clsx`, theme 토큰, `role="tree"` / `treeitem`
- [x] `Tree.test.tsx`, `Tree.stories.tsx`, `src/index.ts` export
- [ ] Storybook 수동: expand/select · indent · light/dark

관련: [migration-plan.md](../migration-plan.md) C9, [tree-view.md](../composed/tree-view.md)

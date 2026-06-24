<!--
 @file packages/ui/.docs/core/dropdown-menu.md
 @description Architecture and usage notes for DropdownMenu core components.

 @created 2026-06-24
-->
# DropdownMenu (`core/dropdown-menu`)

컨텍스트 **액션 메뉴** Radix compound primitive입니다.

## 파일

```text
packages/ui/src/core/dropdown-menu/
├── DropdownMenu.tsx
├── DropdownMenu.types.ts
├── DropdownMenu.module.css
├── DropdownMenu.stories.tsx
└── index.ts
```

Public export: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, …

## API highlights

| Part | 설명 |
| --- | --- |
| `DropdownMenuItem` | `icon` prop — leading icon slot |
| `DropdownMenuCheckboxItem` / `RadioItem` | 선택 상태 메뉴 |
| `DropdownMenuSub` | 중첩 서브메뉴 |
| `DropdownMenuShortcut` | 단축키 텍스트 helper |

## 스타일·토큰

| CSS | 토큰 |
| --- | --- |
| `.content` | `--color-bg-primary`, `--color-border-default` |
| `.item` hover | `--color-bg-secondary` |

## Storybook

- `UI/Core3-overlays/DropdownMenu`

## Gate 체크리스트 (Wave 3-14)

- [x] 파일 헤더, `clsx`, theme 토큰
- [x] `DropdownMenu.test.tsx`
- [x] `src/index.ts` export
- [ ] Storybook 수동: keyboard · Escape · light/dark

관련: [migration-plan.md](../migration-plan.md)

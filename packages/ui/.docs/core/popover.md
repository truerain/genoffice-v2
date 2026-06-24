<!--
 @file packages/ui/.docs/core/popover.md
 @description Architecture and usage notes for Popover core components.

 @created 2026-06-24
-->
# Popover (`core/popover`)

앵커 요소 기준 **플로팅 패널** Radix compound primitive입니다.

## 파일

```text
packages/ui/src/core/popover/
├── Popover.tsx
├── Popover.types.ts
├── Popover.module.css
├── Popover.stories.tsx
└── index.ts
```

Public export: `Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverAnchor`, `PopoverPortal`

## API

Radix `@radix-ui/react-popover` 래퍼. `PopoverContent`는 Portal + `sideOffset` 기본 `6`.

## 스타일·토큰

| CSS | 토큰 |
| --- | --- |
| `.content` bg/border | `--color-bg-primary`, `--color-border-default` |
| `:focus-visible` | `--button-focus-ring` |

## Storybook

- `UI/Core3-overlays/Popover`

## Gate 체크리스트 (Wave 3-13)

- [x] 파일 헤더, `clsx`, theme 토큰
- [x] `Popover.test.tsx`
- [x] `src/index.ts` export
- [ ] Storybook 수동: open/close · light/dark · positioning

관련: [migration-plan.md](../migration-plan.md)

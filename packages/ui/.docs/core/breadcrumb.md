<!--
 @file packages/ui/.docs/core/breadcrumb.md
 @description Architecture and usage notes for Breadcrumb core component.

 @created 2026-06-24
-->
# Breadcrumb (`core/breadcrumb`)

현재 위치를 나타내는 **경로 탐색** UI입니다. V1 custom 구현을 이식했으며 **Radix primitive가 아닙니다**.

| 특성 | 설명 |
| --- | --- |
| 마크업 | `<nav aria-label="Breadcrumb">` + ordered list |
| 마지막 항목 | 링크/버튼 없이 `current` 스타일 |
| 축약 | `maxItems` 초과 시 `...` 삽입 |

## 파일

```text
packages/ui/src/core/breadcrumb/
├── Breadcrumb.tsx
├── Breadcrumb.types.ts
├── Breadcrumb.module.css
├── Breadcrumb.stories.tsx
└── index.ts
```

Public export: `Breadcrumb`, `BreadcrumbProps`, `BreadcrumbItem`

## API

| Prop | 타입 | 기본 | 설명 |
| --- | --- | --- | --- |
| `items` | `BreadcrumbItem[]` | — | 경로 항목 |
| `separator` | `ReactNode` | `ChevronRight` | 구분자 |
| `maxItems` | `number` | — | 최대 표시 수 (초과 시 축약) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 텍스트 크기 |
| `className` | `string` | — | root class |

`BreadcrumbItem`: `label`, `href?`, `onClick?`, `icon?`, `disabled?`

## 스타일·토큰

| 영역 | 토큰 |
| --- | --- |
| link / button text | `--color-fg-secondary` → hover `--color-fg-primary` |
| current | `--color-fg-primary`, `--font-weight-semibold` |
| separator | `--color-fg-tertiary` |
| `:focus-visible` | `--button-focus-ring` |

## Storybook

- **Breadcrumb:** `UI/Core4-navigation/Breadcrumb` — Basic, WithIcons, MaxItems, Sizes, LongPath

## Gate 체크리스트 (Wave 4-17)

- [x] 파일 헤더, `clsx`, theme 토큰, `:focus-visible`
- [x] `Breadcrumb.test.tsx`, `src/index.ts` export
- [ ] Storybook 수동: sizes · maxItems · light/dark

관련: [migration-plan.md](../migration-plan.md)

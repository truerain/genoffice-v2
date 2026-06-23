<!--
 @file packages/ui/.docs/core/badge.md
 @description Architecture and usage notes for the Badge core component.

 @created 2026-06-23
-->
# Badge (`core/badge`)

상태·역할·카운트 등을 표시하는 **칩(chip)** 컴포넌트입니다.  
Radix 없이 `<span>` + CSS Modules로 구현합니다 (migration-plan: CSS only).

## 파일

```text
packages/ui/src/core/badge/
├── Badge.tsx
├── Badge.types.ts
├── Badge.module.css
├── Badge.stories.tsx
└── index.ts
```

Public export: `@gen-office/ui` → `Badge`, `BadgeProps`, `BadgeVariant`, `BadgeSize`

## API

| Prop | 타입 | 기본 | 설명 |
| --- | --- | --- | --- |
| `variant` | `BadgeVariant` | `'default'` | 배경·테두리 스타일 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 높이·패딩·글자 크기 |
| `dot` | `boolean` | `false` | 앞쪽 원형 인디케이터 |
| `className` | `string` | — | 추가 클래스 (`cn` 병합) |
| … | — | — | `HTMLAttributes<HTMLSpanElement>` |

### `BadgeVariant`

| variant | 토큰 |
| --- | --- |
| `default` | `--color-bg-tertiary`, `--color-fg-primary`, `--color-border-default` |
| `primary` | `--color-primary`, `--color-fg-inverse` |
| `secondary` | `--color-bg-secondary`, `--color-fg-secondary` |
| `success` / `warning` / `error` / `info` | `--color-status-*`, `--color-fg-inverse` |
| `outline` | transparent, `--color-border-strong` |

## a11y

- 장식용 dot은 `aria-hidden` 처리.
- 의미 전달이 필요하면 주변 텍스트·`aria-label`로 보완합니다 (Badge 자체는 generic `span`).

## Storybook

- **title:** `UI/Core/Badge`

## Gate 체크리스트 (Wave 1-4)

- [x] `forwardRef` → `HTMLSpanElement`
- [x] theme semantic 변수만 사용 (`white` 하드코드 제거 → `--color-fg-inverse`)
- [x] `index.ts` barrel export
- [x] `pnpm -C packages/ui build`
- [x] `Badge.test.tsx` (Vitest)
- [ ] Storybook 수동: variant·size·dot

## V1 대비

| V1 | V2 |
| --- | --- |
| `cn` from utils | 동일 (추후 `clsx` 전환 예정) |
| Story `Primitives/Badge` | `UI/Core/Badge` |

관련: [architecture.md](../architecture.md), [migration-plan.md](../migration-plan.md)

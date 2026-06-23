<!--
 @file packages/ui/.docs/core/slider.md
 @description Architecture and usage notes for the Slider core component.

 @created 2026-06-23
-->
# Slider (`core/slider`)

값·범위 선택을 위한 **슬라이더** primitive입니다.  
`@radix-ui/react-slider` Root + Track + Range + Thumb를 래핑합니다.

## 파일

```text
packages/ui/src/core/slider/
├── Slider.tsx
├── Slider.types.ts
├── Slider.module.css
├── Slider.stories.tsx
└── index.ts
```

Public export: `@gen-office/ui` → `Slider`, `SliderProps`, `SliderSize`

## API

| Prop | 타입 | 기본 | 설명 |
| --- | --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | track/thumb 크기 |
| `error` | `boolean` | `false` | range·thumb border error 색 |
| `value` / `defaultValue` | `number[]` | — | 단일 `[n]` 또는 범위 `[min, max]` |
| `min` / `max` / `step` | `number` | — | Radix 슬라이더 범위 |
| `className` | `string` | — | `clsx` 병합 |
| … | — | — | Radix `Slider.Root` 나머지 props |

Thumb 개수는 `value` / `defaultValue` 배열 길이에 따릅니다.

## 스타일·토큰

| CSS Module / 변수 | 토큰 |
| --- | --- |
| `--slider-range-color` | `--color-primary` (V2; `--color-brand-secondary` 미사용) |
| `--slider-focus-ring` | `--button-focus-ring` |
| `--slider-track-color` | `--color-border-default` |
| `.error` | `--color-status-error` |

## Radix·a11y

- `role="slider"`, `aria-valuenow` / `aria-valuemin` / `aria-valuemax`
- 키보드: 화살표로 값 변경
- 스토리·테스트에서 `aria-label` 제공 권장

## Storybook

- **title:** `UI/Core/Slider`
- Default, Range, Steps, Sizes, Disabled, Error, AllStates

## Gate 체크리스트 (Wave 2-10)

- [x] `clsx`, 파일 헤더, V2 theme 토큰
- [x] `Slider.test.tsx`
- [x] `src/index.ts` export
- [ ] Storybook 수동: keyboard · range · light/dark

관련: [architecture.md](../architecture.md), [migration-plan.md](../migration-plan.md)

<!--
 @file packages/ui/.docs/core/radio.md
 @description Architecture and usage notes for Radio core components.

 @created 2026-06-23
-->
# Radio (`core/radio`)

폼에서 단일 선택을 위한 **라디오** primitive와 options API 래퍼입니다.

## 파일

```text
packages/ui/src/core/radio/
├── Radio.tsx
├── Radio.types.ts
├── Radio.module.css
├── Radio.stories.tsx
├── SimpleRadioGroup.tsx
├── SimpleRadioGroup.stories.tsx
└── index.ts
```

Public export: `Radio`, `RadioGroup`, `SimpleRadioGroup`, 관련 props/types

## API

### RadioGroup / Radio

| Prop | 컴포넌트 | 설명 |
| --- | --- | --- |
| `error` | Radio | border·indicator `--color-status-error` |
| `error` | RadioGroup | composed 폼 hook (시각 스타일은 Radio.error로 적용) |
| `value` / `defaultValue` | RadioGroup | Radix controlled / uncontrolled |
| … | — | Radix `RadioGroup.Root` / `Item` 나머지 props |

### SimpleRadioGroup

| Prop | 타입 | 기본 | 설명 |
| --- | --- | --- | --- |
| `options` | `RadioOption[]` | — | `{ value, label, disabled? }` |
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | 배치 방향 |
| `error` | `boolean` | — | 각 Radio + Label error 상태 |

라벨은 `SimpleRadioGroup`이 core `Label`로 연결합니다. primitive `Radio`는 라벨을 포함하지 않습니다.

## 스타일·토큰

| CSS Module | 토큰 |
| --- | --- |
| `.item` | `--color-border-default`, `--color-bg-primary` |
| `.item:focus-visible` | `--button-focus-ring` |
| `.item[data-state='checked']` | `--color-primary`, hover `--color-primary-dark` |
| `.error` | `--color-status-error` |
| `.icon` | `--color-primary` / error 시 `--color-status-error` |

## Storybook

- **Radio:** `UI/Core/Radio`
- **SimpleRadioGroup:** `UI/Core/SimpleRadioGroup`

## Gate 체크리스트 (Wave 2-9)

- [x] `clsx`, 파일 헤더, theme 토큰 (V1 hex 제거)
- [x] `Radio.test.tsx`, `SimpleRadioGroup.test.tsx`
- [x] `src/index.ts` export
- [ ] Storybook 수동: keyboard · aria · light/dark

관련: [label.md](./label.md), [migration-plan.md](../migration-plan.md)

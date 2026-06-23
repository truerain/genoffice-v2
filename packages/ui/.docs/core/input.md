<!--
 @file packages/ui/.docs/core/input.md
 @description Architecture and usage notes for the Input core component.

 @created 2026-06-23
-->
# Input (`core/input`)

단일 행 **native `<input>`** 필드입니다. 라벨·도움말·prefix/suffix·clear를 옵션으로 포함합니다.

## 파일

```text
packages/ui/src/core/input/
├── Input.tsx
├── Input.types.ts
├── Input.module.css
├── Input.stories.tsx
└── index.ts
```

Public export: `@gen-office/ui` → `Input`, `InputProps`

## API (요약)

| Prop | 설명 |
| --- | --- |
| `label` | 있으면 Radix `Label.Root` 렌더 (별도 `Label` 컴포넌트와 중복 사용 지양) |
| `helperText` | 하단 설명·에러 문구 (`aria-describedby`) |
| `error` | `aria-invalid`, 에러 스타일 |
| `fullWidth` | wrapper 100% |
| `clearable` / `onClear` / `clearLabel` | 값이 있을 때 clear 버튼 |
| `prefixContent` / `suffix` | 앞·뒤 슬롯 |
| `autoSelect` | focus 시 전체 선택 (**default: true**) |

## 토큰

`--color-border-*`, `--color-bg-*`, `--color-fg-*`, focus ring `--button-focus-ring`, error `color-mix` + `--color-status-error`

## Label 컴포넌트와 함께 쓸 때

폼에서 **분리된 `Label` + `Input`** 패턴: `Label htmlFor`와 `Input id`를 맞추고, `Input`의 `label` prop은 쓰지 않습니다.

## Gate

- [x] build, `Input.test.tsx`
- [ ] Storybook 수동 Gate

관련: [label.md](./label.md), [migration-plan.md](../migration-plan.md)

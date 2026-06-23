<!--
 @file packages/ui/.docs/core/switch.md
 @description Architecture and usage notes for the Switch core component.

 @created 2026-06-23
-->
# Switch (`core/switch`)

설정·폼 UI에서 사용하는 **토글 스위치** primitive입니다.  
`@radix-ui/react-switch` Root + Thumb를 래핑합니다.

## 파일

```text
packages/ui/src/core/switch/
├── Switch.tsx
├── Switch.types.ts
├── Switch.module.css
├── Switch.stories.tsx
└── index.ts
```

Public export: `@gen-office/ui` → `Switch`, `SwitchProps`

## API

| Prop | 타입 | 기본 | 설명 |
| --- | --- | --- | --- |
| `error` | `boolean` | `false` | track 배경을 `--color-status-error`로 표시 |
| `checked` / `defaultChecked` | `boolean` | — | Radix controlled / uncontrolled |
| `disabled` | `boolean` | — | 비활성 (opacity 0.5, pointer-events none) |
| `required` | `boolean` | — | Radix `required` |
| `className` | `string` | — | 추가 클래스 (`clsx` 병합) |
| … | — | — | Radix `Switch.Root` 나머지 props |

라벨은 별도 `Label` 컴포넌트로 연결합니다. Switch 자체는 라벨을 포함하지 않습니다.

## 스타일·토큰

| CSS Module | 토큰 |
| --- | --- |
| `.root` (off) | `--color-border-default`, hover `--color-border-strong` |
| `.root:focus-visible` | `--button-focus-ring` |
| `.root[data-state='checked']` | `--color-primary`, hover `--color-primary-dark` |
| `.error` | `--color-status-error` |
| `.thumb` | `--color-fg-inverse` |

선택적 크기 오버라이드: `--switch-width`, `--switch-height`, `--switch-thumb-size`, `--switch-thumb-x`, `--switch-thumb-checked-x`

## Radix·a11y

- Radix Root는 `role="switch"`와 `aria-checked`를 관리합니다.
- 키보드: Space로 토글, Tab으로 포커스 이동.
- 라벨 연결: `id` + `<Label htmlFor>` 또는 `aria-label` / `aria-labelledby`.

## Storybook

- **title:** `UI/Core/Switch`
- 스토리: Default, Checked, Disabled, Error, ErrorChecked, WithLabel, WithRequiredLabel, Examples, AllStates, FormExample

## Gate 체크리스트 (Wave 2-8)

- [x] `clsx` (utils `cn` 미사용)
- [x] `forwardRef` → Radix `Switch.Root`
- [x] 파일 헤더
- [x] theme CSS 변수 (V1 hex 제거)
- [x] `Switch.test.tsx`
- [x] `src/index.ts` export
- [ ] Storybook 수동: light/dark · focus · keyboard · addon-a11y

## V1 대비

| V1 | V2 |
| --- | --- |
| Story `Primitives/Switch` | `UI/Core/Switch` |
| 마젠타 focus/hover hex | `--button-focus-ring`, `--color-primary-dark` |

관련: [architecture.md](../architecture.md), [migration-plan.md](../migration-plan.md), [label.md](./label.md)

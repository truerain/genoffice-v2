<!--
 @file packages/ui/.docs/core/checkbox.md
 @description Architecture and usage notes for the Checkbox core component.

 @created 2026-06-23
-->
# Checkbox (`core/checkbox`)

폼·설정 UI에서 사용하는 **체크박스** primitive입니다.  
`@radix-ui/react-checkbox` Root를 래핑하고, lucide-react `Check` 아이콘으로 checked 표시를 합니다.

## 파일

```text
packages/ui/src/core/checkbox/
├── Checkbox.tsx
├── Checkbox.types.ts
├── Checkbox.module.css
├── Checkbox.stories.tsx
└── index.ts
```

Public export: `@gen-office/ui` → `Checkbox`, `CheckboxProps`

## API

| Prop | 타입 | 기본 | 설명 |
| --- | --- | --- | --- |
| `error` | `boolean` | `false` | border·checked 배경을 `--color-status-error`로 표시 |
| `checked` / `defaultChecked` | `boolean` | — | Radix controlled / uncontrolled |
| `disabled` | `boolean` | — | 비활성 (opacity 0.5, pointer-events none) |
| `required` | `boolean` | — | Radix `required` (폼 제출 시 검증) |
| `className` | `string` | — | 추가 클래스 (`clsx` 병합) |
| … | — | — | Radix `Checkbox.Root` 나머지 props |

라벨은 별도 `Label` 컴포넌트 또는 native `<label htmlFor>`로 연결합니다. Checkbox 자체는 라벨을 포함하지 않습니다.

## 스타일·토큰

| CSS Module | 토큰 |
| --- | --- |
| `.root` | `--color-border-default`, `--color-bg-primary` |
| `.root:hover` | `--color-primary`, `--color-bg-secondary` |
| `.root:focus-visible` | `--button-focus-ring` |
| `.root[data-state='checked']` | `--color-primary` |
| `.root[data-state='checked']:hover` | `--color-primary-dark` |
| `.error` | `--color-status-error` |
| `.indicator` | `--color-fg-inverse` |

V1 마젠타 hex(`#8A002A`, `rgba(165,0,52,…)`)는 V2 theme semantic 토큰으로 대체했습니다.

## Radix·a11y

- Radix Root는 `role="checkbox"`와 `aria-checked`를 관리합니다.
- 키보드: Space로 토글, Tab으로 포커스 이동.
- 라벨 연결: `id` + `<label htmlFor>` 또는 `aria-label` / `aria-labelledby`.
- `error`는 **시각 상태**만 바꿉니다. `aria-invalid`는 폼 레이어에서 필요 시 추가합니다.

## Storybook

- **title:** `UI/Core/Checkbox`
- 스토리: Default, Checked, Disabled, Error, ErrorChecked, WithLabel, WithRequiredLabel, MultipleCheckboxes, AllStates, FormExample

## Gate 체크리스트 (Wave 2-7)

- [x] `cn` → `clsx` (utils import 제거)
- [x] `forwardRef` → Radix `Checkbox.Root`
- [x] 파일 헤더 (`@file`, `@description`, `@remark`)
- [x] theme CSS 변수만 사용 (V1 hex 제거)
- [x] `Checkbox.test.tsx` (render + click toggle + disabled + error)
- [x] `src/index.ts` export
- [ ] Storybook 수동: light/dark · focus · keyboard · addon-a11y

## V1 대비

| V1 | V2 |
| --- | --- |
| `cn` from utils | `clsx` 직접 import |
| Story `Primitives/Checkbox` | `UI/Core/Checkbox` |
| 마젠타 focus/hover hex | `--button-focus-ring`, `--color-primary-dark` |

관련: [architecture.md](../architecture.md), [migration-plan.md](../migration-plan.md), [label.md](./label.md)

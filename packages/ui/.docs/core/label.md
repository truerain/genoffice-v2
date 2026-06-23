<!--
 @file packages/ui/.docs/core/label.md
 @description Architecture and usage notes for the Label core component.

 @created 2026-06-23
-->
# Label (`core/label`)

폼 필드·체크박스 등에 붙는 **접근 가능한 라벨** primitive입니다.  
`@radix-ui/react-label` Root를 래핑하고, GenOffice theme semantic 토큰으로 표시 스타일을 맞춥니다.

## 파일

```text
packages/ui/src/core/label/
├── Label.tsx
├── Label.types.ts
├── Label.module.css
├── Label.stories.tsx
└── index.ts
```

Public export: `@gen-office/ui` → `Label`, `LabelProps`

## API

| Prop | 타입 | 기본 | 설명 |
| --- | --- | --- | --- |
| `required` | `boolean` | `false` | 라벨 텍스트 뒤 빨간 `*` 표시 (`--color-status-error`) |
| `error` | `boolean` | `false` | 라벨 텍스트를 error 색으로 표시 |
| `htmlFor` | `string` | — | 연결할 control의 `id` (Radix/native label 동작) |
| `className` | `string` | — | 추가 클래스 (`cn` 병합) |
| … | — | — | Radix `Label.Root` 나머지 props |

`required` prop은 HTML `required` 속성과 별개입니다. 필드 검증은 Input·폼 레이어에서 처리합니다.

## 스타일·토큰

| CSS Module | 토큰 |
| --- | --- |
| `.root` | `--color-fg-primary`, `--font-family-primary` |
| `.requiredMark`, `.error` | `--color-status-error` |
| `:disabled` | opacity 0.5 |

component 전용 theme 토큰(`--label-*`)은 없습니다. semantic 색만 사용합니다.

## Radix·a11y

- `Label.Root`는 클릭 시 `htmlFor` 대상 control에 포커스를 줍니다.
- 체크박스·라디오는 `htmlFor` + control `id` 쌍으로 연결합니다.
- `error`는 **시각 상태**만 바꿉니다. `aria-invalid`는 연결된 Input에서 설정합니다 (Input Gate 이후 composed 예제에서 정리).

## Storybook

- **title:** `UI/Core/Label`
- Input·Checkbox 미이식 구간: 스토리에서 native `<input>` / `StoryInput` 헬퍼 사용
- Input·Checkbox Gate 완료 후 `WithInput` 등을 core 컴포넌트로 교체

## Gate 체크리스트 (Wave 1-2)

- [x] `forwardRef` → `HTMLLabelElement` (Button과 동일 DOM 타입 규칙)
- [x] theme CSS 변수만 사용 (hex 하드코드 없음)
- [x] `pnpm -C packages/ui build`
- [ ] `Label.test.tsx` (Vitest — Wave 0 스캐폴드 후)
- [ ] Storybook 수동: required / error / htmlFor 포커스

## V1 대비

| V1 | V2 |
| --- | --- |
| `cn` from utils | 동일 (추후 `clsx` 전환 예정) |
| Story `Primitives/Label` | `UI/Core/Label` |
| Input/Checkbox 스토리 import | native control까지, core 이식 후 교체 |

관련: [architecture.md](../architecture.md), [migration-plan.md](../migration-plan.md)

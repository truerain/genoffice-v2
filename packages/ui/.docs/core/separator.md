<!--
 @file packages/ui/.docs/core/separator.md
 @description Architecture and usage notes for the Separator core component.

 @created 2026-06-23
-->
# Separator (`core/separator`)

섹션·툴바·메뉴 등을 나누는 **시각적 구분선** primitive입니다.  
`@radix-ui/react-separator` Root를 래핑하고, theme border semantic 토큰으로 두께·색을 맞춥니다.

## 파일

```text
packages/ui/src/core/separator/
├── Separator.tsx
├── Separator.types.ts
├── Separator.module.css
├── Separator.stories.tsx
└── index.ts
```

Public export: `@gen-office/ui` → `Separator`, `SeparatorProps`, `SeparatorVariant`

## API

| Prop | 타입 | 기본 | 설명 |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Radix — 구분선 방향 |
| `decorative` | `boolean` | `true` | `true`: 장식용(role presentation), `false`: 접근성 구분자 |
| `variant` | `'subtle' \| 'default' \| 'strong'` | `'default'` | border 강조 단계 |
| `className` | `string` | — | 추가 클래스 (`cn` 병합) |
| … | — | — | Radix `Separator.Root` 나머지 props |

레이아웃에서 flex 자식으로 쓸 때 부모에 `display: flex`와 (세로 구분선일 때) 명시적 `height`가 필요할 수 있습니다.

## 스타일·토큰

| variant | CSS Module | 토큰 |
| --- | --- | --- |
| `subtle` | `.subtle` | `--color-border-subtle` |
| `default` | `.default` | `--color-border-default` |
| `strong` | `.strong` | `--color-border-strong` |

가로: `height: 1px`, `width: 100%`  
세로: `width: 1px`, `height: 100%`

component 전용 `--separator-*` 토큰은 없습니다.

## Radix·a11y

- `decorative={true}`(기본): 스크린 리더가 구조적 구분자로 읽지 않음 — 단순 시각 구분에 적합.
- 의미 있는 섹션 경계가 필요하면 `decorative={false}`로 설정합니다.

## Storybook

- **title:** `UI/Core/Separator`
- Horizontal / Vertical / Variants 스토리

## Gate 체크리스트 (Wave 1-3)

- [x] `forwardRef` → `HTMLDivElement` (Button·Label과 동일 DOM 타입 규칙)
- [x] theme border semantic 변수만 사용
- [x] `pnpm -C packages/ui build`
- [x] `Separator.test.tsx` (Vitest)
- [ ] Storybook 수동: horizontal·vertical·variant

## V1 대비

| V1 | V2 |
| --- | --- |
| `cn` from utils | 동일 (추후 `clsx` 전환 예정) |
| Story `Primitives/Separator` | `UI/Core/Separator` |

관련: [architecture.md](../architecture.md), [migration-plan.md](../migration-plan.md)

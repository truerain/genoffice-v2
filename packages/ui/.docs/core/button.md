<!--
 @file packages/ui/.docs/core/button.md
 @description Architecture and usage notes for the Button core component.

 @created 2026-06-23
-->
# Button (`core/button`)

액션·제출·내비게이션 트리거용 **버튼** primitive입니다.  
Wave 1 **템플릿** 컴포넌트로, variant·size·loading·`asChild` 패턴을 이후 core 이관의 기준으로 삼습니다.

`@radix-ui/react-slot`으로 `asChild`를 지원하고, 기본 렌더는 native `<button>`입니다.

## 파일

```text
packages/ui/src/core/button/
├── Button.tsx
├── Button.types.ts
├── Button.module.css
├── Button.stories.tsx
└── index.ts
```

Public export: `@gen-office/ui` → `Button`, `ButtonProps`, `ButtonVariant`, `ButtonSize`

## API

| Prop | 타입 | 기본 | 설명 |
| --- | --- | --- | --- |
| `variant` | `ButtonVariant` | `'primary'` | 배경·테두리·텍스트 스타일 |
| `size` | `ButtonSize` | `'md'` | 높이·패딩·글자 크기 |
| `fullWidth` | `boolean` | `false` | wrapper 100% 너비 |
| `loading` | `boolean` | `false` | 스피너 표시, 클릭 비활성 (`disabled`와 동일 처리) |
| `disabled` | `boolean` | — | native `disabled` |
| `leftIcon` / `rightIcon` | `ReactNode` | — | 텍스트 앞·뒤 아이콘 (`loading` 중에는 숨김) |
| `asChild` | `boolean` | `false` | 자식을 Slot으로 merge (아래 참고) |
| `className` | `string` | — | 추가 클래스 (`clsx` 병합) |
| … | — | — | `ButtonHTMLAttributes<HTMLButtonElement>` |

### `ButtonVariant`

| variant | 용도 | theme 토큰 (요약) |
| --- | --- | --- |
| `default` | 중립 filled | `--button-default-*` |
| `primary` | 주요 CTA | `--button-primary-*` |
| `secondary` | 보조 액션 | `--button-secondary-*` |
| `outline` | 테두리 강조 | `--button-outline-*` |
| `ghost` | 최소 시각 무게 | `--button-ghost-*` |
| `danger` | 파괴적 filled | `--button-danger-*` |
| `destructive` | 파괴적 outline | `--button-destructive-*` |
| `link` | 텍스트 링크형 | `--button-link-*` |

> V2에서는 V1 `brand` variant와 `--button-brand-*` 토큰을 **이식하지 않습니다**. primary variant만 사용합니다.

### `ButtonSize`

| size | 설명 |
| --- | --- |
| `sm` / `md` / `lg` | 표준 높이·패딩 (CSS module `.sm` / `.md` / `.lg`) |
| `icon` | 정사각 아이콘 전용 (`1.875rem`) |

## `asChild` (Radix Slot)

`asChild={true}`이면 `<button>` 대신 `Slot`이 자식 요소에 className·ref·props를 merge합니다.

- `disabled` / `loading` 시 `aria-disabled={true}` 설정 (`Slot` 경로).
- `leftIcon` / `rightIcon`은 **렌더하지 않음** — 자식이 단일 요소(예: `<a>`)일 때 Slot 패턴에 맞춥니다.
- 링크처럼 보이는 CTA: `<Button asChild variant="link"><a href="…">…</a></Button>`.

## loading

- `loading`이면 `disabled`와 동일하게 상호작용 차단.
- 텍스트는 `color: transparent`, `::after` pseudo-element로 variant별 스피너 색상 적용.
- 아이콘 슬롯은 loading 중 숨김.

## 스타일·토큰

스타일은 `Button.module.css` + `@gen-office/theme`의 `--button-*` 변수입니다.

| 영역 | 토큰 |
| --- | --- |
| focus ring | `--button-focus-ring` (`:focus-visible`) |
| variant별 bg/text/border/shadow | `--button-{variant}-*` (theme `button.css`) |
| link loading ring | `--button-link-loading-ring` |

disabled 공통: `opacity: 0.4`, `pointer-events: none`.

## a11y

- 기본: native `<button>` — `type="button"`은 호출 측에서 폼 컨텍스트에 맞게 지정.
- `loading` / `disabled`: 포커스 가능한 버튼은 `disabled` attribute; `asChild`는 `aria-disabled`.
- 아이콘만 있는 버튼: `aria-label` 또는 visually hidden 텍스트 필수 (`size="icon"`).
- focus: `:focus-visible` + `--button-focus-ring` (마우스 클릭만으로는 outline 없음).

## Storybook

- **title:** `UI/Core/Button`
- 스토리: Primary, Secondary, Outline, Ghost, Danger, Destructive, Link, Small/Medium/Large, Loading, Disabled, FullWidth, WithLeftIcon, WithRightIcon, IconExamples, AllVariants, AllSizes, WithIcons, LoadingStates

## Gate 체크리스트 (Wave 1-1)

- [x] `@radix-ui/react-slot` `asChild` 패턴
- [x] `forwardRef` → `HTMLButtonElement`
- [x] `clsx` className 병합 (utils `cn` 미사용)
- [x] theme `--button-*` 토큰만 사용 (`brand` variant 제거)
- [x] `Button.test.tsx` (render + click + disabled)
- [x] `src/index.ts` export
- [ ] Storybook 수동: variant·size·loading·asChild·light/dark · addon-a11y

## V1 대비

| V1 | V2 |
| --- | --- |
| `cn` from utils | `clsx` 직접 import |
| `variant="brand"` + `--button-brand-*` | **삭제** — `primary` 사용 |
| Story `Primitives/Button` | `UI/Core/Button` |

관련: [architecture.md](../architecture.md), [migration-plan.md](../migration-plan.md), [08-DESIGN-TOKENS-GUIDE.md](../../../.docs/08-DESIGN-TOKENS-GUIDE.md) (button 토큰)

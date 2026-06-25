<!--
 @file packages/ui/.docs/composed/split-layout.md
 @description Architecture and usage notes for SplitLayout composed component.

 @created 2026-06-25
-->
# SplitLayout (`composed/splitLayout`)

**좌/우(또는 상/하) 2분할 레이아웃**입니다. V1 이식이며 마스터-디테일·관리 화면에서 트리/그리드와 상세 패널을 나눌 때 사용합니다. **`MasterDetailLayout`(C4)의 기반**입니다.

| 특성 | 설명 |
| --- | --- |
| 마크업 | flex 2 pane + optional resize handle |
| 방향 | `horizontal` (기본) · `vertical` |
| 크기 | `leftWidth` — `number` (px) · `"280px"` · `"40%"` |
| 리사이즈 | `resizable` + pointer capture; `onResize(px)` |

## 파일

```text
packages/ui/src/composed/splitLayout/
├── SplitLayout.tsx
├── SplitLayout.types.ts
├── SplitLayout.module.css
├── SplitLayout.stories.tsx
└── index.ts
```

Public export: `SplitLayout`, `SplitLayoutProps`

## API (요약)

| Prop | 타입 | 기본 | 설명 |
| --- | --- | --- | --- |
| `left` / `right` | `ReactNode` | — | 패널 내용 |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | 분할 방향 |
| `leftWidth` | `number \| string` | `280` | 첫 패널 크기 |
| `minLeftWidth` | `number \| string` | `220` | 첫 패널 최소 |
| `maxLeftWidth` | `number \| string` | — | 첫 패널 최대 (미지정 시 우측 min 반영) |
| `minRightWidth` | `number \| string` | `0` | 두 번째 패널 최소 |
| `gap` | `number` | `16` | 패널 간격 (`--split-gap`) |
| `resizable` | `boolean` | `false` | 드래그 리사이즈 |
| `showResizeLine` | `boolean` | `true` | 핸들 시각선 |
| `onResize` | `(nextLeftWidth: number) => void` | — | 드래그 중 px 콜백 |
| `className` / `leftClassName` / `rightClassName` | `string` | — | 영역 class |

## 레이아웃 계약

부모가 **명시적 높이**를 제공해야 합니다 (`height: 100%` + flex chain `min-height: 0`).

```text
.page (flex column, min-height: 0)
  └── .content (flex: 1, min-height: 0)
        └── SplitLayout (height: 100%)
```

V1 demo 참고: `RoleManagementPage`, `MenuManagementPage` — `leftWidth="60%"`, `resizable`.

## 스타일·토큰

| 영역 | 토큰 / 변수 |
| --- | --- |
| gap | `--split-gap` (inline from `gap` prop) |
| pane size | `--split-left-width`, `--split-left-min`, `--split-right-min` |
| resizer line | `--color-border-default` → hover/active `--color-primary` |

## Storybook

- **SplitLayout:** `UI/Composed/SplitLayout` — Default, Resizable, PercentWidth, Vertical, ResizableVertical, HiddenResizeLine

## Gate 체크리스트 (Wave 5 — C3)

- [x] 파일 헤더, `clsx`, theme 토큰, `@remark`
- [x] `SplitLayout.test.tsx`, `src/index.ts` export
- [x] Storybook 수동: horizontal/vertical resize · % width · light/dark

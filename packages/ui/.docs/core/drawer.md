<!--
 @file packages/ui/.docs/core/drawer.md
 @description Architecture and usage notes for Drawer core component.

 @created 2026-06-24
-->
# Drawer (`core/drawer`)

화면 가장자리에서 슬라이드되는 **패널** UI입니다. V1 custom 구현을 이식했으며 **Radix primitive가 아닙니다**.

| 특성 | 설명 |
| --- | --- |
| 제어 | `open` / `onOpenChange` (controlled) |
| Portal | 없음 — `position: fixed` (V1 parity) |
| Focus trap | 없음 — ESC·overlay·close 버튼으로 닫기 |

## 파일

```text
packages/ui/src/core/drawer/
├── Drawer.tsx
├── Drawer.types.ts
├── Drawer.module.css
├── Drawer.stories.tsx
└── index.ts
```

Public export: `Drawer`, `DrawerProps`, `DrawerSide`, `DrawerSize`

## API

| Prop | 타입 | 기본 | 설명 |
| --- | --- | --- | --- |
| `open` | `boolean` | — | 표시 여부 |
| `onOpenChange` | `(open: boolean) => void` | — | 상태 변경 |
| `title` | `string \| ReactNode` | — | 헤더 제목 (있을 때만 헤더·X 표시) |
| `description` | `string \| ReactNode` | — | 헤더 설명 |
| `children` | `ReactNode` | — | body |
| `side` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | 진입 방향 |
| `size` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | 가로/세로 크기 preset |
| `closeOnOverlayClick` | `boolean` | `true` | overlay 클릭 닫기 |
| `closeOnEsc` | `boolean` | `true` | Escape 닫기 |
| `footer` | `ReactNode` | — | 하단 고정 슬롯 |

```tsx
<Drawer
  open={open}
  onOpenChange={setOpen}
  title="Filters"
  side="right"
  size="md"
  footer={<Button onClick={() => setOpen(false)}>Apply</Button>}
>
  {filterForm}
</Drawer>
```

## 스타일·토큰

| 영역 | 토큰 |
| --- | --- |
| panel bg | `--color-bg-secondary` |
| shadow | `--shadow-xl` |
| header/footer border | `--color-border-default` |
| title / description | `--color-fg-primary`, `--color-fg-secondary` |
| close `:focus-visible` | `--button-focus-ring` |

## Storybook

- **Drawer:** `UI/Core3-overlays/Drawer` — Default, WithFooter, sides, sizes, NoOverlayClose

## Gate 체크리스트 (Wave 3-12)

- [x] 파일 헤더, `clsx`, theme 토큰, close `:focus-visible`
- [x] `Drawer.test.tsx` (open/closed, Escape, overlay, close button)
- [x] `src/index.ts` export
- [x] Storybook 수동: side/size · light/dark · 모바일 breakpoint

관련: [dialog.md](./dialog.md), [migration-plan.md](../migration-plan.md)

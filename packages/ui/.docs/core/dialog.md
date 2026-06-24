<!--
 @file packages/ui/.docs/core/dialog.md
 @description Architecture and usage notes for Dialog and StandardDialog.

 @created 2026-06-24
-->
# Dialog (`core/dialog`)

모달 UI는 **두 층**으로 나뉩니다.

| API | 대상 | 용도 |
| --- | --- | --- |
| **`Dialog*`** | primitive 조립 | AlertDialog·커스텀 레이아웃·`DialogTrigger` |
| **`StandardDialog`** | 앱 화면 기본 | `title` / `footer` / `size` / drag·resize |

## 파일

```text
packages/ui/src/core/dialog/
├── Dialog.tsx
├── Dialog.types.ts
├── Dialog.module.css
├── Dialog.stories.tsx
├── StandardDialog.tsx
├── StandardDialog.types.ts
├── StandardDialog.stories.tsx
└── index.ts
```

Public export: `Dialog`, `DialogContent`, … `StandardDialog`, `StandardDialogProps`, `StandardDialogSize`

## Dialog (compound primitive)

Radix `@radix-ui/react-dialog` + theme `--dialog-*` CSS.

| Part | 설명 |
| --- | --- |
| `Dialog` | Root |
| `DialogTrigger` / `DialogClose` | 열기·닫기 |
| `DialogContent` | Portal + Overlay + content (`showClose` 기본 true) |
| `DialogHeader` / `DialogBody` / `DialogFooter` | 레이아웃 슬롯 |
| `DialogTitle` / `DialogDescription` | a11y 제목·설명 |

## StandardDialog (앱 기본)

`Dialog` primitive 위에 다음을 제공합니다.

| Prop | 기본 | 설명 |
| --- | --- | --- |
| `title` | — | 헤더 제목 |
| `footer` | — | 고정 footer 슬롯 |
| `size` | `'md'` | `sm` \| `md` \| `lg` \| `xl` \| `full` |
| `draggable` | `true` | 헤더 드래그 이동 |
| `resizable` | `false` | 우하단 핸들 + maximize |
| `bodyScrollable` | `true` | body overflow |
| `bodyRef` | — | body DOM ref (차트 측정 등) |
| `initialWidth` / `initialHeight` | — | 리사이즈 전 크기 |
| `open` / `onOpenChange` | — | controlled (Trigger 없음) |

```tsx
<StandardDialog
  open={open}
  onOpenChange={setOpen}
  title="Settings"
  footer={<Button onClick={() => setOpen(false)}>Close</Button>}
>
  {children}
</StandardDialog>
```

## 스타일·토큰

`Dialog.module.css` → `--dialog-bg`, `--dialog-border`, `--dialog-header-bg`, `--button-focus-ring` (close focus)

## Storybook

| title | 내용 |
| --- | --- |
| `UI/Core/Dialog` | primitive compound 스토리 |
| `UI/Core/StandardDialog` | Default, WithFooter, Resizable, Sizes |

## Gate 체크리스트 (Wave 3-11)

- [x] `clsx`, 파일 헤더, theme 토큰 (close `:focus-visible`)
- [x] `Dialog.test.tsx` (open + Escape)
- [x] `StandardDialog.test.tsx` (open/closed + title)
- [x] `SimpleDialog` → `StandardDialog` rename
- [x] `src/index.ts` export
- [ ] Storybook 수동: focus trap · light/dark · StandardDialog resize

관련: [architecture.md](../architecture.md), [migration-plan.md](../migration-plan.md)

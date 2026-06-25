<!--
 @file packages/ui/.docs/composed/alert-dialog.md
 @description Architecture and usage notes for AlertDialog composed component.

 @created 2026-06-25
-->
# AlertDialog (`composed/alertDialog`)

확인·경고·오류·성공 등 **알림형 모달**입니다. V1 이식이며 **`@radix-ui/react-alert-dialog`가 아닌** `core/dialog` compound 위에 구성됩니다.

| 특성 | 설명 |
| --- | --- |
| 기반 | `Dialog`, `DialogContent`, `Button` |
| variant | `info` · `warning` · `error` · `success` — 좌측 accent + 아이콘 |
| 비동기 | `onConfirm`이 `Promise`면 완료 후 닫힘; reject 시 유지 |
| 3버튼 | `thirdText` + `onThird` (Yes/No/Cancel 패턴) |

## 파일

```text
packages/ui/src/composed/alertDialog/
├── AlertDialog.tsx
├── AlertDialog.types.ts
├── AlertDialog.module.css
├── AlertDialog.stories.tsx
└── index.ts
```

Public export: `AlertDialog`, `AlertDialogProps`, `AlertDialogVariant`

## API (요약)

| Prop | 타입 | 기본 | 설명 |
| --- | --- | --- | --- |
| `open` | `boolean` | — | 열림 상태 |
| `onOpenChange` | `(open: boolean) => void` | — | 상태 변경 |
| `title` | `string \| ReactNode` | — | 제목 |
| `message` | `string \| ReactNode` | — | 본문 (없으면 아이콘 행 생략) |
| `confirmText` | `string` | `'확인'` | 확인 버튼 |
| `cancelText` | `string` | `'취소'` | 취소 버튼 |
| `onConfirm` | `() => void \| Promise<void>` | — | 확인 핸들러 |
| `onCancel` | `() => void` | — | 취소 핸들러 |
| `variant` | `AlertDialogVariant` | `'info'` | 시각 variant |
| `hideCancelButton` | `boolean` | `false` | 취소 숨김 |
| `thirdText` / `onThird` | — | — | 세 번째 버튼 |
| `isLoading` | `boolean` | `false` | 확인 버튼 로딩 |

`error` variant 확인 버튼은 `destructive`입니다.

## 스타일·토큰

| 영역 | 토큰 |
| --- | --- |
| variant border | `--color-warning`, `--color-error`, `--color-success` |
| icon chip | `--color-*-light`, `--color-*` |
| body text | `--color-fg-secondary`, `--font-family-primary` |
| header close `:focus-visible` | `--button-focus-ring` |

## Storybook

- **AlertDialog:** `UI/Composed/AlertDialog` — Info, Warning, Error, Success, DeleteConfirmation, AsyncConfirm 등

## Gate 체크리스트 (Wave 5 — C1)

- [x] 파일 헤더, `clsx`, theme 토큰, close `:focus-visible`
- [x] `AlertDialog.test.tsx`, `src/index.ts` export
- [x] Storybook 수동: variant · async · light/dark

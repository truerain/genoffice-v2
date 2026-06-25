<!--
 @file packages/ui/.docs/composed/confirm-dialog.md
 @description Architecture and usage notes for ConfirmDialog composed component.

 @created 2026-06-25
-->
# ConfirmDialog (`composed/confirmDialog`)

**확인/취소** 용도의 얇은 래퍼입니다. `AlertDialog`를 그대로 사용하며 기본 `variant`는 `warning`입니다.

| 특성 | 설명 |
| --- | --- |
| 구현 | `AlertDialog` delegate |
| 기본 variant | `warning` |
| 미지원 | `thirdText`, `hideCancelButton` (필요 시 `AlertDialog` 직접 사용) |

## 파일

```text
packages/ui/src/composed/confirmDialog/
├── ConfirmDialog.tsx
├── ConfirmDialog.types.ts
├── ConfirmDialog.stories.tsx
└── index.ts
```

Public export: `ConfirmDialog`, `ConfirmDialogProps`

## API (요약)

`AlertDialog`와 동일한 open/title/message/confirm/cancel/onConfirm/onCancel/isLoading/variant. 기본 문구·variant만 다릅니다.

## Storybook

- **ConfirmDialog:** `UI/Composed/ConfirmDialog` — Default, Delete, AsyncConfirm

## Gate 체크리스트 (Wave 5 — C2)

- [x] 파일 헤더, `AlertDialog` 위임, stories/test/docs/export
- [x] Storybook 수동: delete flow · light/dark

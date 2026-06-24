<!--
 @file packages/ui/.docs/core/toast.md
 @description Architecture and usage notes for Toast compound primitives.

 @created 2026-06-24
-->
# Toast (`core/toast`)

일시적 알림 UI입니다. **`@radix-ui/react-toast`** compound primitive wrapper입니다.

| API | 설명 |
| --- | --- |
| `ToastProvider` | duration·swipe 설정 |
| `ToastViewport` | 고정 위치 목록 (앱에 1개) |
| `Toast` | 개별 알림 (`variant`) |
| `ToastTitle` / `ToastDescription` | 본문 |
| `ToastAction` / `ToastClose` | 액션·닫기 |

## 사용

```tsx
<ToastProvider>
  <Button onClick={() => setOpen(true)}>Notify</Button>
  <Toast open={open} onOpenChange={setOpen} variant="success">
    <ToastTitle>Saved</ToastTitle>
    <ToastDescription>Changes applied.</ToastDescription>
    <ToastClose />
  </Toast>
  <ToastViewport />
</ToastProvider>
```

`ToastAction`은 Radix 요구대로 **`altText`** 필수.

## variant

`default` · `success` · `warning` · `error` — 좌측 accent border (`--color-primary`, `--color-status-*`).

## Storybook

- `UI/Core5-feedback/Toast`

## Gate (Wave 5-ext)

- [x] Radix wrapper, variant, test, export
- [ ] Storybook 수동: swipe · action · dark

> composed에서 toast queue/helper hook은 Wave 5 이후 검토 가능.

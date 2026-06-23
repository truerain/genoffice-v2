<!--
 @file packages/ui/.docs/core/textarea.md
 @description Architecture and usage notes for the Textarea core component.

 @created 2026-06-23
-->
# Textarea (`core/textarea`)

여러 행 **native `<textarea>`** 필드입니다. Input과 동일하게 라벨·도움말·error 패턴을 공유합니다.

## 파일

```text
packages/ui/src/core/textarea/
├── Textarea.tsx
├── Textarea.types.ts
├── Textarea.module.css
├── Textarea.stories.tsx
└── index.ts
```

Public export: `@gen-office/ui` → `Textarea`, `TextareaProps`, `TextareaResize`

## API (요약)

| Prop | 기본 | 설명 |
| --- | --- | --- |
| `resize` | `'vertical'` | `none` \| `vertical` \| `horizontal` \| `both` |
| `label` / `helperText` / `error` / `fullWidth` | — | Input과 동일 의미 |

## 토큰

Input과 동일 border·focus·status 토큰.

## Gate

- [x] build, `Textarea.test.tsx`
- [ ] Storybook 수동 Gate

관련: [input.md](./input.md), [migration-plan.md](../migration-plan.md)

<!--
 @file packages/ui/.docs/core/select.md
 @description Architecture and usage notes for Select and StandardSelect.

 @created 2026-06-24
-->
# Select (`core/select`)

드롭다운 **단일 선택** UI입니다.

| API | 대상 | 용도 |
| --- | --- | --- |
| **`Select*`** | primitive 조립 | 커스텀 트리거·그룹·폼 레이아웃 |
| **`StandardSelect`** | 앱 화면 기본 | `options` / `groups` API — **단일 value** |

> **다중 필드 통합 Select** (`GroupedSelect`)는 composed·Deferred — [composed/grouped-select.md](../composed/grouped-select.md) (D-002). `groups` prop과 혼동하지 않음.

## 파일

```text
packages/ui/src/core/select/
├── Select.tsx
├── Select.types.ts
├── Select.module.css
├── Select.stories.tsx
├── StandardSelect.tsx
├── StandardSelect.stories.tsx
└── index.ts
```

## StandardSelect

| Prop | 설명 |
| --- | --- |
| `options` | `{ value, label, disabled? }[]` |
| `groups` | `{ label, options }[]` |
| `placeholder` | 미선택 placeholder |
| `error` / `fullWidth` / `fitCell` | 트리거 상태·레이아웃 |

## 스타일·토큰

| CSS | 토큰 |
| --- | --- |
| `.trigger` | `--color-border-default`, `--color-bg-primary` |
| `.trigger:focus-visible` | `--button-focus-ring` |
| `.triggerError` | `--color-status-error` |

## Storybook

- `UI/Core3-overlays/Select`
- `UI/Core3-overlays/StandardSelect`

## Gate 체크리스트 (Wave 3-15)

- [x] `clsx`, 파일 헤더, theme 토큰
- [x] `Select.test.tsx`, `StandardSelect.test.tsx`
- [x] `StandardSelect` rename (구 SimpleSelect)
- [x] `src/index.ts` export
- [ ] Storybook 수동: keyboard · portal · light/dark

관련: [label.md](./label.md), [composed/grouped-select.md](../composed/grouped-select.md), [migration-plan.md](../migration-plan.md)

<!--
 @file packages/ui/.docs/core/progress.md
 @description Architecture and usage notes for Progress component.

 @created 2026-06-24
-->
# Progress (`core/progress`)

작업 진행률 표시 바입니다. **`@radix-ui/react-progress`** Root + Indicator wrapper입니다.

| Prop | 타입 | 기본 | 설명 |
| --- | --- | --- | --- |
| `value` | `number \| null` | — | `null`이면 indeterminate |
| `max` | `number` | `100` | 최대값 |
| `variant` | `default \| success \| warning \| error` | `default` | indicator 색 |
| `size` | `sm \| md \| lg` | `md` | 트랙 높이 |

```tsx
<Progress value={65} aria-label="Upload progress" />
<Progress value={null} aria-label="Loading" />
```

## 스타일·토큰

| 영역 | 토큰 |
| --- | --- |
| track | `--color-bg-secondary` |
| indicator | `--color-primary`, `--color-status-*` |

## Storybook

- `UI/Core5-feedback/Progress`

## Gate (Wave 5-ext)

- [x] Radix wrapper, variant/size, test, export
- [ ] Storybook 수동: indeterminate · variants · dark

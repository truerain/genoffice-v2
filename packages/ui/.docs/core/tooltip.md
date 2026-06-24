<!--
 @file packages/ui/.docs/core/tooltip.md
 @description Architecture and usage notes for Tooltip compound primitives.

 @created 2026-06-24
-->
# Tooltip (`core/tooltip`)

호버·포커스 시 짧은 설명을 보여주는 UI입니다. **`@radix-ui/react-tooltip`** compound primitive wrapper입니다.

| API | 설명 |
| --- | --- |
| `TooltipProvider` | 앱/섹션 루트에 배치 (`delayDuration` 등) |
| `Tooltip` | Root |
| `TooltipTrigger` | 트리거 (`asChild` 지원) |
| `TooltipContent` | 본문 (Portal) |
| `TooltipArrow` | 선택 화살표 |

## 사용

```tsx
<TooltipProvider delayDuration={300}>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Save</Button>
    </TooltipTrigger>
    <TooltipContent>Save current draft</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## 스타일·토큰

| 영역 | 토큰 |
| --- | --- |
| surface | `--color-fg-primary` bg, `--color-fg-inverse` text |
| `:focus-visible` | `--button-focus-ring` |

## Storybook

- `UI/Core5-feedback/Tooltip`

## Gate (Wave 5-ext)

- [x] Radix wrapper, theme, test, export
- [ ] Storybook 수동: sides · dark · keyboard focus

관련: [deferred.md](../deferred.md) D-001 (Slider bubble은 별도)

<!--
 @file packages/ui/.docs/core/tabs.md
 @description Architecture and usage notes for Tabs compound primitives.

 @created 2026-06-24
-->
# Tabs (`core/tabs`)

탭 전환 UI입니다. **`@radix-ui/react-tabs`** compound primitive wrapper입니다.

| API | 설명 |
| --- | --- |
| `Tabs` | Root (`value` / `defaultValue`, `onValueChange`) |
| `TabsList` | 트리거 목록 (`variant`: pills · underline · boxed) |
| `TabsTrigger` | 개별 탭 버튼 |
| `TabsContent` | 패널 (`forceMount` 기본 `true` — V1 parity) |

## 파일

```text
packages/ui/src/core/tabs/
├── Tabs.tsx
├── Tabs.types.ts
├── Tabs.module.css
├── Tabs.stories.tsx
└── index.ts
```

## API

```tsx
<Tabs defaultValue="account">
  <TabsList variant="pills">
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">…</TabsContent>
  <TabsContent value="password">…</TabsContent>
</Tabs>
```

## 스타일·토큰

| 영역 | 토큰 |
| --- | --- |
| list bg (pills) | `--color-bg-secondary`, `--color-border-subtle` |
| trigger text | `--color-fg-secondary` / active `--color-fg-primary` |
| underline active | `--color-primary` |
| `:focus-visible` | `--button-focus-ring` |

## Storybook

- **Tabs:** `UI/Core4-navigation/Tabs` — Default, DisabledTrigger, Variants

## Gate 체크리스트 (Wave 4-16)

- [x] 파일 헤더, `clsx`, semantic fg 토큰, `:focus-visible`
- [x] `Tabs.test.tsx`, `src/index.ts` export
- [ ] Storybook 수동: variants · disabled · light/dark

관련: [migration-plan.md](../migration-plan.md)

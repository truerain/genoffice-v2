<!--
 @file packages/ui/.docs/core/calendar.md
 @description Architecture and usage notes for Calendar core component.

 @created 2026-06-24
-->
# Calendar (`core/calendar`)

월력 UI입니다. [`@daypicker/react`](https://daypicker.dev) v10 (`DayPicker`) thin wrapper이며 **Radix primitive가 아닙니다**.

| 특성 | 설명 |
| --- | --- |
| 엔진 | `@daypicker/react` ^10 (`react-day-picker` 10 transitive) |
| 날짜 포맷 | `date-fns` ^4.1.0 (직접 의존 + DayPicker peer) |
| 캡션 | `format(month, 'yyyy.M')` (V1 parity) |
| Composed | Wave 5 `DatePicker` 등은 Calendar + Popover + Input 조합 |

## 파일

```text
packages/ui/src/core/calendar/
├── Calendar.tsx
├── Calendar.types.ts
├── Calendar.module.css
├── Calendar.stories.tsx
└── index.ts
```

Public export: `Calendar`, `CalendarProps`

## 의존성·버전

| 패키지 | 범위 | 비고 |
| --- | --- | --- |
| `@daypicker/react` | ^10.0.1 | V2 권장 import 경로 (`@daypicker/react/style.css`) |
| `date-fns` | ^4.1.0 | DayPicker v10이 `date-fns ^4.1.0` 사용 — lock 4.4.0 호환 |

v9 → v10 `classNames` 키 예: `table`→`month_grid`, `day_selected`→`selected`, `day_button` 신설.

## API

`CalendarProps` = `DayPickerProps` passthrough. 주요 prop:

| Prop | 설명 |
| --- | --- |
| `mode` | `'single' \| 'multiple' \| 'range'` |
| `selected` / `onSelect` | 선택 제어 |
| `showOutsideDays` | 기본 `true` |
| `className` / `classNames` | root·요소별 CSS module 확장 |

```tsx
<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
/>
```

## 스타일·토큰

| 영역 | 토큰 / 변수 |
| --- | --- |
| accent / selected | `--rdp-accent-color` → `--color-primary` |
| today | `--rdp-today-color` → `--color-fg-primary` |
| range middle | `--rdp-range_middle-background-color` → `--color-bg-secondary` |
| day focus | `--button-focus-ring` (`:focus-visible`) |

기본 스타일: `@daypicker/react/style.css` + `Calendar.module.css` (`.rdp-root` 변수 오버라이드).

## Storybook

- **Calendar:** `UI/Core4-navigation/Calendar` — Default, SingleSelect, RangeSelect, WithoutOutsideDays

## Gate 체크리스트 (Wave 4-19)

- [x] `@daypicker/react` v10, v10 `classNames` 키, theme 토큰
- [x] `Calendar.test.tsx`, `src/index.ts` export
- [ ] Storybook 수동: single/range · light/dark · 모바일 breakpoint

관련: [migration-plan.md](../migration-plan.md) Wave 4, Wave 5 DatePicker

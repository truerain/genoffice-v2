<!--
 @file packages/ui/.docs/composed/date-picker.md
 @description Architecture and Gate plan for DatePicker composed family (C5b).

 @created 2026-06-25

 @remark
 - 선행 Gate: core MaskedInput (C5a) — [masked-input.md](../core/masked-input.md)
 - V1 이관 소스: packages/ui/src/composed/datePicker/ (리팩터 대상)
-->
# DatePicker · RangeDatePicker · MonthPicker · RangeMonthPicker

Calendar / Popover / **MaskedInput** 조합 composed입니다.  
V1 이관본이 `packages/ui/src/composed/datePicker/`에 있으나, **C5b Gate**에서 MaskedInput 기반으로 정리합니다.

---

## 1. Wave 순서

```text
C5a  core MaskedInput (+ utils/format/mask)   ← 선행
C5b  composed datePicker/*                    ← 본 문서
```

V1 raw `<input>` + `DatePicker.module.css` `.field` split chrome은 **C5b에서 제거** — [masked-input.md §7](../core/masked-input.md).

---

## 2. 컴포넌트

| 컴포넌트 | value | MaskedInput (1차) | Popover 내용 |
| --- | --- | --- | --- |
| **DatePicker** | `Date?` | `ymd` | `Calendar` mode=single |
| **RangeDatePicker** | `DateRange?` | readOnly label (mask 후속) | `Calendar` mode=range + confirm |
| **MonthPicker** | `Date?` (day=1) | `ym` | month grid |
| **RangeMonthPicker** | `MonthRange?` | readOnly label (mask 후속) | month range grid + confirm |

타입: `@daypicker/react`의 `DateRange` 등 — V2 Calendar와 동일 패키지 ([calendar.md](../core/calendar.md)).

---

## 3. 책임 분리

| 레이어 | 담당 |
| --- | --- |
| **MaskedInput** | display string, caret, clear, suffix(trigger) |
| **utils** | `parseDateString`, `formatDateString`, mask digits |
| **DatePicker** | `Date` state, open/close, calendar select, `format`/`parse` override |
| **theme** | Input·Popover·Calendar 토큰 (datePicker 전용 CSS 최소화) |

---

## 4. C5b 완료 내역

| 항목 | 결과 |
| --- | --- |
| 텍스트 필드 | `MaskedInput` (Date/Month) · `Input` readOnly (Range) |
| 타입 import | `react-day-picker` 제거; `DateRange`는 composed 로컬 타입 |
| `clearable` | DatePicker · MonthPicker → MaskedInput 연결 |
| split `.field` CSS | 제거; `CalendarTrigger` suffix + popover/month grid CSS만 유지 |
| `editorOverlay` | MonthPicker `data-gen-grid-editor-overlay` 유지 |
| tests · stories | `DatePicker.test.tsx` 7건, `DatePicker.stories.tsx` |

**C5b Gate:** 2026-06-25 수동 Storybook·V1 UX 확인 완료.

---

## 5. Gate 체크리스트 (C5b)

- [x] C5a MaskedInput Gate 완료
- [x] 4컴포넌트 MaskedInput + Popover + Calendar 정합
- [x] `@daypicker/react` / CalendarProps 정리 (`react-day-picker` import 제거)
- [x] Vitest composed tests
- [x] Storybook `UI/Composed/DatePicker` 등
- [x] Storybook 수동 — single/range/month, light/dark, keyboard
- [x] `implementation-log.md`
- [x] V1 대비 UX 회귀 없음 (수동)

---

## 6. Storybook (목표)

- **DatePicker:** Default, WithLocale, Clearable, Disabled
- **RangeDatePicker:** Default, ConfirmClear
- **MonthPicker:** Default, FromToMonth, EditorOverlay
- **RangeMonthPicker:** Default

관련: [migration-plan.md](../migration-plan.md), [masked-input.md](../core/masked-input.md)

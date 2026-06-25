<!--
 @file packages/ui/.docs/core/masked-input.md
 @description Architecture for MaskedInput — masked text entry on core Input (C5a Gate).

 @created 2026-06-25

 @remark
 - 선행: Input Gate
 - 후행: composed DatePicker / MonthPicker (C5b)
 - mask 엔진 순수 함수: @gen-office/utils format/mask (Gate C5a와 함께)
-->
# MaskedInput (`core/maskedInput`)

고정 패턴(자리수·구분자)으로 **입력 중 표시 문자열**을 제어하는 core 컴포넌트입니다.  
V1에 없었으나 V2에서 **DatePicker·MonthPicker·FilterBar·일반 폼**의 공통 기반으로 추가합니다.

**C5a Gate** — composed DatePicker(C5b) **선행 필수**.  
**구조는 DatePicker와 분리** — C5a는 date preset만 *첫 consumer*로 구현; core·utils mask 엔진은 도메인 중립.

---

## 0. 독립성 원칙 (DatePicker와 분리)

| | MaskedInput / mask 엔진 | DatePicker (C5b) |
| --- | --- | --- |
| **패키지** | `core/maskedInput`, `utils/format/mask` | `composed/datePicker` |
| **value** | display `string` + `MaskState` | `Date` / `DateRange` / … |
| **알아야 할 것** | slot·digit·caret·`MaskDefinition` | Calendar, Popover, `parseDateString` |
| **import 금지** | `@daypicker/*`, Calendar, Popover, `date.ts` parse | MaskedInput을 **조합**만 |

```text
utils/format/mask.ts          ← 도메인 중립 엔진 (slot pattern)
utils/format/maskPresets/     ← 선택: preset 데이터 (date는 그중 하나)
         ↓
core/MaskedInput              ← mask prop만; Date 타입·캘린더 모름
         ↓
composed/DatePicker           ← mask={{ preset: 'ymd' }} + parseDateString on commit
composed/ (미래) FilterBar     ← 다른 preset (D-003)
```

- **C5a Gate 범위** = 엔진 + MaskedInput + **date preset 2종** (`ymd`, `ym`) — *구현 분량*일 뿐, API는 date 전용이 아님.
- `parseDateString` / `formatDateString` 연동은 **DatePicker commit 시** composed가 담당; mask 엔진은 separator 문자열만 알면 됨.

---

## 1. 목표·비목표

| 목표 (1차 Gate) | 비목표 (deferred) |
| --- | --- |
| `yyyy-MM-dd` · `yyyy-MM` **고정 mask** | IMask / `@react-input/mask` 등 범용 엔진 |
| core **Input** 위 wrapper — theme·clear·suffix 재사용 | DatePicker 전용 raw `<input>` + duplicate CSS |
| controlled **display string** + `complete` 메타 | wire `Date` 변환 (composed·utils 담당) |
| caret·Backspace·Delete·숫자 입력 UX | 전화·사업자번호 mask (D-003) |
| RTL test + Storybook | FilterBar `mask` prop (C5b 이후 enhancement) |

---

## 2. 레이어·의존

```text
@gen-office/utils/format/mask.ts     ← 순수: slot 적용·digits 추출·complete 판정
         ↓
core/maskedInput/useMaskInput.ts     ← React: caret·keydown·composition
         ↓
core/maskedInput/MaskedInput.tsx     ← Input wrapper (forwardRef → native input)
         ↓
composed/datePicker/*                ← Date ↔ string, Calendar, Popover, suffix trigger
```

| 패키지 | 책임 |
| --- | --- |
| **utils** | **도메인 중립** `MaskDefinition`, digit slot 엔진, `extractDigits`, `isMaskComplete` — React 없음 |
| **utils (preset)** | `ymd`·`ym` 등 **데이터/팩토리** — date 전용 로직은 preset 이름 수준, 엔진에 `Date` 없음 |
| **ui core** | 입력 UX, `Input` props 위임, a11y — **Calendar·Popover import 없음** |
| **ui composed** | `Date` value, parse/format, Popover — MaskedInput **소비** |

date preset의 separator는 [date.ts](../../../../utils/src/format/date.ts) `DateYmdSeparator`와 **값만 맞춤** (mask 모듈이 date.ts를 import하지 않음 — 순환·결합 방지).

---

## 3. value 모델

```text
MaskedInput     value: string          "2026-06-25" (display / edit)
DatePicker      value: Date | undefined   composed가 parse/format 담당
Filter draft    string 또는 Date         화면별 — DatePicker 사용 시 Date
```

- **MaskedInput은 `Date`를 모릅니다.** string만 다룹니다.
- **Incomplete** 입력(예: `2026-06-`)은 허용 — `onChange`마다 `complete: false`.
- **commit** 시점(blur / Enter) — **소비자(composed)** 가 domain parse 수행 (DatePicker → `parseDateString`).

---

## 4. Mask 정의 (utils — 도메인 중립)

```ts
/** @gen-office/utils — format/mask.ts (C5a) */

/** 한 칸 = digit 하나; literal = 구분자 (자동 삽입) */
export type MaskToken = { kind: 'digit' } | { kind: 'literal'; char: string };

export type MaskDefinition = {
  tokens: MaskToken[];
  /** digits만 이어 붙인 길이가 complete */
  maxDigits: number;
};

export type MaskState = {
  display: string;
  digits: string;
  complete: boolean;
};

/** C5a preset id — 엔진과 분리된 registry */
export type MaskPresetId = 'ymd' | 'ym';

export type MaskPresetOptions = {
  preset: MaskPresetId;
  /** ymd: default '-' — DatePicker commit 시 parseDateString separator와 맞출 것 */
  separator?: '-' | '/' | '.';
};
```

### Preset registry (C5a: date 2종만 등록)

| preset id | tokens (separator `-` 예) | maxDigits |
| --- | --- | --- |
| `ymd` | `YYYY-MM-DD` | 8 |
| `ym` | `YYYY-MM` | 6 |

파일 분리 (권장):

```text
utils/src/format/mask.ts              ← applyDigitMask, applyBackspaceMask, …
utils/src/format/maskPresets/date.ts  ← ymdMask(separator), ymMask(separator)
```

D-003에서 `phone`, `biz` preset 파일만 추가 — **엔진·MaskedInput API 변경 최소화**.

순수 함수 (Vitest는 utils + ui 양쪽):

- `createEmptyMask(options)` → 초기 display (placeholder slots 또는 `''`)
- `applyDigitMask(prev, digit, caret, options)` → `{ display, digits, caret, complete }`
- `applyBackspaceMask(...)` · `applyPasteMask(...)`
- `isMaskComplete(display, options)`

구분자는 **입력 시 자동 삽입**; 사용자가 `-` / `/` 를 직접 칠 필요 없음.

---

## 5. core API (초안)

```ts
/** MaskedInput.types.ts */
export type MaskedInputProps = Omit<InputProps, 'type' | 'value' | 'defaultValue' | 'onChange'> & {
  /** preset id + options 또는 raw MaskDefinition (고급) */
  mask: MaskPresetId | MaskPresetOptions | MaskDefinition;
  value?: string;
  defaultValue?: string;
  onChange?: (display: string, state: MaskState) => void;
  /** 모든 slot이 유효하게 채워졌을 때 */
  onComplete?: (display: string, state: MaskState) => void;
  /** mask 필드는 default false — Input default true와 다름 */
  autoSelect?: boolean;
};
```

### Input 위임

- `label`, `helperText`, `error`, `fullWidth`, `clearable`, `clearLabel`, `suffix`, `prefixContent`, `disabled` → **Input 그대로**
- clear 시 `display=''`, `digits=''`, `complete=false`
- **`suffix`**: 임의 ReactNode (캘린더 버튼 등) — DatePicker **소비 패턴**일 뿐, MaskedInput API에 Popover 개념 없음

### Hook

`useMaskInput({ mask, value, onChange, onComplete, inputRef })`

- `onKeyDown` / `onChange` / `onPaste` / `compositionstart|end` (IME 조합 중 mask 일시 중지)
- controlled `value` sync
- caret position 복원 (`requestAnimationFrame` 또는 sync where safe)

---

## 6. 파일 구조 (목표)

```text
packages/utils/src/format/
├── mask.ts                      ← 도메인 중립 엔진 (C5a)
├── maskPresets/
│   └── date.ts                  ← ymd · ym 팩토리 (C5a)
└── index.ts
```

packages/ui/src/core/maskedInput/
├── MaskedInput.tsx
├── MaskedInput.types.ts
├── useMaskInput.ts
├── MaskedInput.stories.tsx
└── index.ts

packages/ui/test/core/MaskedInput.test.tsx
```

Public export: `MaskedInput`, `MaskedInputProps`, `MaskPreset` (re-export from utils types if needed)

Story title: `UI/Core/maskedInput/MaskedInput`

---

## 7. DatePicker 연동 (C5b — **소비 예**, MaskedInput 소속 아님)

상세: [date-picker.md](../composed/date-picker.md). MaskedInput Gate(C5a)는 **아래 패턴 없이** 독립 story·test로 완료 가능.

V1 이관본(`raw input` + `DatePicker.module.css` `.field`)은 **참고만** 하고 C5b에서 교체합니다.

```tsx
<Popover>
  <PopoverAnchor asChild>
    <MaskedInput
      mask={{ preset: 'ymd', separator: '-' }}
      value={display}
      onChange={(next, state) => { /* draft */ }}
      onBlur={() => commit(parseDateString(display, 'ymd', '-'))}
      autoSelect={false}
      clearable={clearable}
      suffix={
        <PopoverTrigger asChild>
          <button type="button" aria-label="Open calendar">…</button>
        </PopoverTrigger>
      }
    />
  </PopoverAnchor>
  <PopoverContent>…<Calendar /></PopoverContent>
</Popover>
```

| 컴포넌트 | MaskedInput | 비고 |
| --- | --- | --- |
| **DatePicker** | `ymd` | typed + calendar |
| **MonthPicker** | `ym` | typed + month grid |
| **RangeDatePicker** | — (1차) | readOnly summary + range Calendar; mask는 후속 |
| **RangeMonthPicker** | — (1차) | 동일 |

Range 계열 typed input은 D-003 또는 C5b enhancement로 분리 가능.

---

## 8. Gate 체크리스트 (C5a)

- [x] `utils/format/mask.ts` + unit tests
- [x] `MaskedInput` — forwardRef, `clsx`, 파일 헤더, `@remark`
- [x] `useMaskInput` — digit, backspace, paste, clear, IME skip
- [x] `MaskedInput.test.tsx` — ymd/ym, complete, clearable, suffix slot
- [x] Storybook — Default, YmdSeparator, Disabled, WithSuffix, Clearable
- [x] Storybook 수동 — focus, dark, a11y
- [x] `src/index.ts` export
- [ ] [input.md](./input.md) · [calendar.md](./calendar.md) cross-link
- [x] `implementation-log.md` 항목

---

## 9. 테스트 포인트

| # | 시나리오 |
| --- | --- |
| 1 | `20260625` 순차 입력 → `2026-06-25`, `complete: true` |
| 2 | Backspace가 구분자 건너뛰기 |
| 3 | paste `2026/06/25` → normalize |
| 4 | incomplete blur — display 유지, `complete: false` |
| 5 | `clearable` — digits 초기화 |
| 6 | `compositionstart` 중 mask 미적용 |
| 7 | `suffix` + focus ring — Input wrapper 하나 |

---

## 10. 향후 (deferred D-003)

범용·도메인 mask는 C5a 완료 후:

- 전화·사업자번호·금액
- FilterField `mask` prop
- Range picker typed mask
- 필요 시 IMask 도입 검토 — **별 package boundary** (무거우면 `@gen-office/ui` devDep + adapter)

관련: [migration-plan.md](../migration-plan.md) §5c·C5b, [deferred.md](../deferred.md) D-003, [date-picker.md](../composed/date-picker.md)

<!--
 @file packages/ui/.docs/composed/combobox.md
 @description Architecture and Gate plan for Combobox composed family (C6).

 @created 2026-06-25

 @remark
 - V1 이관: packages/ui/src/composed/combobox/
 - FilterBar combo / multi-combo 연동 (C6)
-->
# Combobox · MultiCombobox

검색 가능한 **단일·다중 선택** dropdown composed입니다.  
core **Input** + **Popover** + listbox 패턴이며, V1 이관본을 **C6 Gate**에서 V2 관례에 맞게 정리합니다.

---

## 1. Wave 순서

```text
C4  FilterBar (combo placeholder)
C6  Combobox / MultiCombobox        ← 본 문서
C7  TreeCombobox                    ← Tree + Combobox
```

---

## 2. 컴포넌트

| 컴포넌트 | value | UX |
| --- | --- | --- |
| **Combobox** | `string` (option value) | 입력 필터 + 단일 선택 |
| **MultiCombobox** | `string[]` | 입력 필터 + 다중 토글, summary display + selected tooltip |

`StandardSelect`와 구분: 옵션 많을 때 **typeahead·키보드 listbox** ([grouped-select.md](./grouped-select.md)).

---

## 3. 레이어·의존

```text
core/Input          ← label, clear, suffix (chevron trigger)
core/Popover        ← dropdown anchor + content
composed/Combobox   ← filter, listbox, a11y (combobox role)
```

| 책임 | 위치 |
| --- | --- |
| 입력·clear·suffix | core Input |
| popover open/close | core Popover |
| option filter·select·keyboard | Combobox / MultiCombobox |
| option `group` | list UI separator (Select groups와 별개) |

---

## 4. C6 작업 (이관본 → Gate)

| 항목 | 이관본 | C6 목표 |
| --- | --- | --- |
| Input | core Input 사용 | `autoSelect={false}` |
| Popover anchor | `@radix-ui/react-popover` 직접 | `PopoverAnchor` from core |
| 파일 헤더 | 없음 | Gate 필수 |
| default export | 있음 | named export only |
| FilterBar | placeholder | `combo` / `multi-combo` 연동 |
| tests · stories | 없음 | Gate 필수 |

---

## 5. FilterBar 연동

| FilterField `type` | 위젯 | `TFilters[key]` |
| --- | --- | --- |
| `combo` | `Combobox` | `string` |
| `multi-combo` | `MultiCombobox` | `string[]` |

공통: `options`, `placeholder`, `clearable`, `clearLabel`, `fullWidth`

MultiCombobox 추가:

| Prop | 기본 | 설명 |
| --- | --- | --- |
| `selectedTooltip` | `'auto'` | `'auto'`: 2개 이상 선택 시 tooltip · `true`/`false` 강제 |
| `formatSelectedTooltip` | label join | tooltip content 커스터마이즈 |

popover가 열린 동안 tooltip은 비활성화됩니다. tooltip은 input **위쪽**(`side="top"`)에 표시됩니다.

---

## 6. Gate 체크리스트 (C6) — 완료

- [x] 파일 헤더, `clsx`, `@remark`
- [x] Combobox / MultiCombobox — Input `autoSelect={false}`, PopoverAnchor
- [x] Vitest composed tests
- [x] Storybook `UI/Composed/Combobox`
- [x] StandardFilterBar `combo` / `multi-combo`
- [x] Storybook 수동 — filter, keyboard, clear, grouped, light/dark
- [x] `implementation-log.md`
- [x] `filter-bar.md` C6 항목

---

## 7. Storybook (목표)

- **Combobox:** Default, Grouped, Clearable, Disabled, Controlled
- **MultiCombobox:** Default, Clearable, Disabled
- **StandardFilterBar:** `WithComboFields`

관련: [migration-plan.md](../migration-plan.md), [filter-bar.md](./filter-bar.md)

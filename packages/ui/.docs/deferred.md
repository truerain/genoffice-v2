<!--
 @file packages/ui/.docs/deferred.md
 @description Enhancements deferred until V1→V2 UI migration (Wave 1–5) is complete.

 @created 2026-06-23
-->
# Deferred — UI 이관 완료 후 진행

V1 → V2 **core·composed 이관**( [migration-plan.md](./migration-plan.md) Wave 1–5 )을 모두 마친 뒤에 진행할 항목 목록입니다.

이관 Gate 범위에 넣지 않고, 제품 요구·디자인 확정 후 별도 작업으로 처리합니다.

## 진행 조건

- [ ] Wave 1–4 core 이관·Gate 완료
- [ ] Wave 5 composed 이관·Gate 완료
- [ ] `pnpm -C packages/ui build` / `test` green 유지

---

## 목록

| ID | 컴포넌트 | 항목 | 배경 | 예상 API·방향 |
| --- | --- | --- | --- | --- |
| D-001 | **Slider** | Thumb **값 tooltip / value bubble** | V1에도 없음. Radix Slider 내장 기능 아님. 드래그·키보드 조작 시 현재 값을 thumb 위에 표시하는 UX enhancement | `showValueTooltip?: boolean`, `formatValue?: (value, index) => ReactNode`, `valueTooltipVisibility?: 'drag' \| 'focus' \| 'always'`. `@radix-ui/react-tooltip` 없이 **Thumb 자식 span + CSS module** 권장. a11y: bubble은 `aria-hidden`, `aria-valuenow`가 주 정보 |
| D-002 | **GroupedSelect** | **다중 Select 필드를 하나의 UI로 통합** | 메인 화면에 `StandardSelect` 여러 개가 나란히 있어 밀도·정렬이 나쁨. `StandardSelect.groups`(옵션 섹션)와 무관 — **필드별 단일 value**를 한 덩어리로 | composed · `Popover` + `StandardSelect` × N. `fields[]`, `value: Record<string, string>`, `formatSummary`, optional `applyOnConfirm`. 상세: [composed/grouped-select.md](./composed/grouped-select.md) |

### D-001 상세 (Slider value bubble)

**하지 않는 이유 (지금):**

- Wave 2 Slider Gate(Storybook 수동·keyboard) 미완
- V1 parity 이관 범위 밖
- Wave 3 overlay/menu 이관이 우선

**구현 시 체크:**

- 단일 thumb `[n]` · range `[min, max]` 각 thumb별 값
- controlled / uncontrolled (`value` / `defaultValue`) 모두
- Storybook 스토리 + RTL test (drag/focus 표시, `formatValue`)
- [slider.md](./core/slider.md) API·Gate 갱신

### D-002 상세 (GroupedSelect)

**하지 않는 이유 (지금):**

- Wave 3 Select·Popover Gate 직후 — composed 착수 전
- FilterBar(C5)와 적용/초기화 UX를 함께 정하는 편이 낫음
- V1 parity·Wave 1–5 이관 범위 밖 (신규 composed)

**구현 시 체크:**

- `StandardSelect.groups`(단일 value)와 API·문서 혼동 방지
- Popover 패널 vs inline segmented layout
- cascading `dependsOn` 및 하위 value reset
- [composed/grouped-select.md](./composed/grouped-select.md) Gate 항목

---

## 항목 추가 방법

1. 위 표에 `D-00N` 행 추가 (컴포넌트·항목·배경·방향)
2. 필요 시 상세 섹션 보강
3. `implementation-log.md`에 착수·완료 기록

관련: [migration-plan.md](./migration-plan.md), [architecture.md](./architecture.md)

<!--
 @file packages/ui/.docs/composed/grouped-select.md
 @description Design notes for GroupedSelect (multi-field select chrome).

 @created 2026-06-24
-->
# GroupedSelect (구상 · Deferred)

백오피스 **메인 화면에 나란히 놓인 Select 여러 개**를 **하나의 UI**로 묶어, 화면상 컴포넌트 수·시각적 잡음을 줄이는 **composed** 위젯입니다.

> **구현 상태:** Wave 1–5 UI 이관 완료 후 진행 — [deferred.md](../deferred.md) **D-002**

## `StandardSelect.groups`와 구분

| 개념 | 의미 | value |
| --- | --- | --- |
| **`StandardSelect` + `groups`** | **하나의 Select** 안에서 옵션을 섹션으로 묶음 (과일/채소) | **단일** `string` |
| **`GroupedSelect`** | **여러 독립 필드**(각각 Select)를 **한 덩어리 UI**로 표시 | **필드별** `Record<string, string \| undefined>` |

Radix `@radix-ui/react-select`는 **단일 value**만 지원합니다. GroupedSelect는 Select를 **N번 조립**하는 composed 레이어이며, primitive API 확장이 아닙니다.

## 해결하려는 문제

- 검색/필터 영역에 `StandardSelect` 3~4개가 한 줄을 차지함
- 각 Select가 trigger·label·여백을 반복해 **밀도·정렬**이 나빠짐
- 관련 조건(부서·상태·등급 등)은 **논리적으로 한 그룹**인데 UI는 분리됨

## UX 패턴 (후보)

### A. 단일 트리거 + Popover 패널 (1차 권장)

```text
[ 부서: 영업 · 상태: 진행중 ▼ ]     ← 메인 화면 1칸
        └─ Popover
             ├─ Label + StandardSelect (부서)
             ├─ Label + StandardSelect (상태)
             └─ [초기화] [적용]
```

- 메인 DOM/컴포넌트 수 최소
- **적용/초기화**로 메인 쿼리와 동기화하기 쉬움

### B. Segmented inline (한 줄, 시각적 통합)

```text
[ 부서 ▼ | 상태 ▼ | 등급 ▼ ]
```

- 공간은 줄지만 trigger는 필드 수만큼 존재
- “통합”은 주로 스타일·border 공유

### C. Cascading (연쇄)

- `fields[n].options`가 `fields[n-1].value`에 의존
- 상위 변경 시 하위 value 초기화

## API 스케치 (초안)

```tsx
type GroupedSelectField = {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  /** cascading: 이 필드 options/filter가 참조할 상위 field name */
  dependsOn?: string;
};

type GroupedSelectProps = {
  fields: GroupedSelectField[];
  value: Record<string, string | undefined>;
  onValueChange: (next: Record<string, string | undefined>) => void;
  /** Popover 트리거 요약 텍스트 */
  formatSummary?: (
    value: Record<string, string | undefined>,
    fields: GroupedSelectField[]
  ) => string;
  layout?: 'popover' | 'inline';
  /** popover layout: true면 패널 [적용] 후에만 onValueChange (draft) */
  applyOnConfirm?: boolean;
  footer?: React.ReactNode;
};
```

내부 구현: **`Popover` + `StandardSelect` × N** (+ 필요 시 `Label`).

## 패키지·Wave 위치

| 항목 | 값 |
| --- | --- |
| 패키지 경계 | **`composed`** (`packages/ui/src/composed/grouped-select/` 예상) |
| 선행 Gate | Wave 3 **Popover**, **StandardSelect** |
| 인접 composed | **FilterBar** (C5) — GroupedSelect + Input + Button을 포함할 수 있음 |
| Storybook | `UI/Composed/GroupedSelect` |

core `StandardSelect` / `Select*` API는 변경하지 않습니다.

## 관련 컴포넌트

```text
StandardSelect     → 폼 필드 1개 (단일 value)
GroupedSelect      → 관련 Select N개 → 화면 1칸 (composed)
FilterBar          → 검색/필터 바 전체 (GroupedSelect + Input + Button …)
Combobox           → 옵션 많을 때 검색 가능 단일 선택
MultiCombobox      → 다중 선택 (별 과제)
```

## 구현 시 Gate 체크 (착수 때)

- [ ] cascading `dependsOn` + 하위 value reset
- [ ] `applyOnConfirm` draft vs 즉시 반영
- [ ] 필드별 `error` / 필수 validation 표시
- [ ] 키보드·focus: Popover 안 Select 포커스 이동
- [ ] `formatSummary` 기본 동작 (미선택·부분 선택)
- [ ] Storybook + RTL test
- [ ] FilterBar(C5)와 API 경계 문서화

## 왜 지금 하지 않는가

- Wave 3 overlay Gate·Wave 4–5 composed 이관이 우선
- FilterBar와 **적용/초기화 UX**를 함께 정하는 편이 낫음
- V1 parity 범위 밖 **신규 composed**

관련: [select.md](../core/select.md), [popover.md](../core/popover.md), [migration-plan.md](../migration-plan.md), [deferred.md](../deferred.md)

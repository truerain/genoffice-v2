<!--
 @file packages/ui/.docs/README.md
 @description Package documentation index for @gen-office/ui.

 @created 2026-06-23
-->
# @gen-office/ui 문서

Radix UI 기반 **도메인 중립** React 컴포넌트 패키지입니다.  
V1 [`frontend/packages/ui`](../../../frontend/packages/ui)를 **core → composed** 순으로 이식합니다.

## 문서

| 문서 | 내용 |
| --- | --- |
| [architecture.md](./architecture.md) | 패키지 구조·Radix 래퍼·CSS·테스트·Storybook |
| [core/button.md](./core/button.md) | Button 컴포넌트 API·토큰·Gate (Wave 1 템플릿) |
| [core/label.md](./core/label.md) | Label 컴포넌트 API·토큰·Gate |
| [core/separator.md](./core/separator.md) | Separator 컴포넌트 API·토큰·Gate |
| [core/badge.md](./core/badge.md) | Badge 컴포넌트 API·토큰·Gate |
| [core/input.md](./core/input.md) | Input 컴포넌트 API·토큰·Gate |
| [core/masked-input.md](./core/masked-input.md) | MaskedInput 아키텍처·C5a Gate (DatePicker 선행) |
| [core/textarea.md](./core/textarea.md) | Textarea 컴포넌트 API·토큰·Gate |
| [core/checkbox.md](./core/checkbox.md) | Checkbox 컴포넌트 API·토큰·Gate |
| [core/switch.md](./core/switch.md) | Switch 컴포넌트 API·토큰·Gate |
| [core/radio.md](./core/radio.md) | Radio · StandardRadioGroup API·토큰·Gate |
| [core/slider.md](./core/slider.md) | Slider 컴포넌트 API·토큰·Gate |
| [core/dialog.md](./core/dialog.md) | Dialog · StandardDialog API·Gate |
| [core/drawer.md](./core/drawer.md) | Drawer API·토큰·Gate (V1 custom) |
| [core/popover.md](./core/popover.md) | Popover API·Gate |
| [core/dropdown-menu.md](./core/dropdown-menu.md) | DropdownMenu API·Gate |
| [core/select.md](./core/select.md) | Select · StandardSelect API·Gate |
| [composed/grouped-select.md](./composed/grouped-select.md) | GroupedSelect 구상 (Deferred D-002) |
| [composed/date-picker.md](./composed/date-picker.md) | DatePicker 계열 C5b Gate (MaskedInput 선행) |
| [migration-plan.md](./migration-plan.md) | 코어 컴포넌트 이관 순서·컴포넌트별 Gate 체크리스트 |
| [deferred.md](./deferred.md) | **UI 이관 완료 후** 진행할 enhancement 목록 |
| [logs/implementation-log.md](./logs/implementation-log.md) | 컴포넌트 이관 작업 로그 (이관 시 갱신) |

## 선행 패키지

- `@gen-office/theme` — CSS 변수·`ThemeProvider`
- `@gen-office/utils` — format / normalize / validation (className은 **`clsx` 직접**)

## 빌드·테스트·Storybook

```bash
pnpm -C packages/ui build
pnpm -C packages/ui test
pnpm -C apps/storybook dev          # 통합 Storybook (packages/ui stories 자동 수집)
```

## 이관 원칙 (요약)

1. **한 번에 한 core 컴포넌트** — 이관 → 자동 test → Storybook 수동 확인 → 로그
2. **composed는 core 안정 후** — **C5a MaskedInput** → C5b DatePicker · Combobox 등
3. **V1 monolith 복사 금지** — `cn` → `clsx`, V1 `brand` variant는 이식하지 않음

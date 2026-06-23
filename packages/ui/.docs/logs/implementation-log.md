<!--
 @file packages/ui/.docs/logs/implementation-log.md
 @description Implementation and migration change log for @gen-office/ui.

 @created 2026-06-23
-->
# UI 구현 로그

## 2026-06-23

### Radio · Slider core 이식 (사용자) — clsx·헤더·문서·test

- **Radio:** `Radio.tsx`, types, css, `SimpleRadioGroup` — 헤더, V1 hex → theme 토큰, `useId()` id 스코프
- **Radio stories:** `UI/Core/Radio`, `UI/Core/SimpleRadioGroup`, core `Label`
- **Slider:** 헤더, `--color-brand-secondary` → `--color-primary`, focus ring 토큰
- `slider.stories.tsx` → `Slider.stories.tsx`, `UI/Core/Slider`
- `test/core/Radio.test.tsx`, `SimpleRadioGroup.test.tsx`, `Slider.test.tsx`
- `.docs/core/radio.md`, `slider.md`

### Switch core 이식 (사용자) — clsx·헤더·문서·test

- `Switch.tsx`, `Switch.types.ts`, `Switch.module.css`, `index.ts` — 파일 헤더, V1 hex → theme 토큰
- `index.tsx` → `index.ts` (패키지 convention)
- `Switch.stories.tsx` — core `Label` 연동, `AllStates`·`FormExample` 추가
- `test/core/Switch.test.tsx`, `.docs/core/switch.md`
- `pnpm -C packages/ui test` (29) · `build` 통과

### Checkbox core 이식 (사용자) — clsx·헤더·문서·test

- `Checkbox.tsx` — `cn` → `clsx`, 파일 헤더
- `Checkbox.types.ts` — `ComponentPropsWithoutRef` 명시 import
- `Checkbox.module.css` — V1 마젠타 hex → `--button-focus-ring`, `--color-primary-dark`, `--color-fg-inverse`
- `checkbox.stories.tsx` → `Checkbox.stories.tsx`, title `UI/Core/Checkbox`
- `test/core/Checkbox.test.tsx`, `.docs/core/checkbox.md`

### Checkbox stories 점검

- `Checkbox.stories.tsx` — `UI/Core/Checkbox`, 파일 헤더, core `Label` 연동
- `ErrorChecked`, `WithRequiredLabel`, `FormExample` 스토리 추가
- standalone 스토리에 `aria-label` (autodocs·a11y)

### ui build — theme CSS `@import` resolve

- `vite.config.ts`, `vitest.config.ts` — `@gen-office/theme/index.css` → `../theme/src/index.css` alias
- PostCSS가 패키지명을 로컬 경로로 해석하던 오류 수정 (`pnpm -C packages/ui build` 통과)

### Input·Textarea core 이식 (사용자) — 정리

- 파일 헤더, `UI/Core/*` 스토리, `Texttarea.stories.tsx` → `Textarea.stories.tsx` 오타 수정
- focus ring V1 magenta rgba → `--button-focus-ring` / status `color-mix`
- `Label.stories` → core `Input` 사용
- `test/core/Input.test.tsx`, `Textarea.test.tsx`, `.docs/core/input.md`, `textarea.md`

### Wave 0 — Vitest 스캐폴드

- `vitest.config.ts`, `test/setup.ts`, `test/core/Button.test.tsx`
- `package.json` — `test`, `test:watch` 스크립트 및 RTL·vitest devDeps
- `test/core/Label.test.tsx`, `Separator.test.tsx`, `Badge.test.tsx` 추가

### Badge core 이식 (사용자) — 헤더·export·문서 정리

- `src/index.ts`에 badge export 추가 (누락)
- status variant `color: white` → `var(--color-fg-inverse)`
- `UI/Core/Badge` 스토리, secondary·outline argTypes/AllVariants
- `.docs/core/badge.md`, 로그·architecture 갱신

### Separator core 이식 (사용자) — 헤더·문서 정리

- `Separator.types.ts` — `ComponentPropsWithoutRef` 명시 import
- `Separator.stories.tsx` — `UI/Core/Separator`, Variants 스토리, `decorative` argType
- 파일 헤더·`.docs/core/separator.md`, `SeparatorVariant` export
- `pnpm -C packages/ui build` 통과

### Label core 이식 (사용자) — 오류·문서 정리

- `Label.tsx` — `forwardRef` 타입 `HTMLLabelElement` (기존 `HTMLButtonElement` 오류 수정)
- `Label.stories.tsx` — `UI/Core/Label`, Input/Checkbox 미이식 → native `StoryInput` 헬퍼
- 파일 헤더·`.docs/core/label.md` 추가, architecture·README 갱신
- `pnpm -C packages/ui build` 통과

### Button `brand` variant·토큰 제거

- `Button.types.ts`, `Button.module.css`, `Button.stories.tsx` — `brand` 전면 삭제
- theme `--button-brand-*` alias 제거 (primary만 사용)

### Button core 이식 (사용자) — 헤더·구조 점검

- `src/core/button/` — Button.tsx, types, module.css, stories, index.ts
- `src/index.css` 추가 (theme import)
- `vite.config.ts` — `@vitejs/plugin-react` 제거, theme 패턴 lib build (vite/internal 오류 해결)
- `src/vite-env.d.ts` — CSS Modules 타입
- `pnpm -C packages/ui build` 통과

### 이관 Plan·아키텍처 문서

- `.docs/architecture.md` — core/composed, Radix 패턴, Vitest + Storybook Gate
- `.docs/migration-plan.md` — Wave 0~5, core 20 + composed 순서
- `.docs/README.md` — 문서 인덱스
- `package.json` React 19 / Storybook 10 정렬 (선행)

### 다음

- Wave 0: vite/vitest 스캐폴드
- Wave 1-1: **Button** 첫 Gate

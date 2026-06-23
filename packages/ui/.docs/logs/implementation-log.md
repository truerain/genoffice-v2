<!--
 @file packages/ui/.docs/logs/implementation-log.md
 @description Implementation and migration change log for @gen-office/ui.

 @created 2026-06-23
-->
# UI 구현 로그

## 2026-06-23

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

<!--
 @file packages/ui/.docs/architecture.md
 @description Package structure, Radix wrapper patterns, testing, and Storybook integration for @gen-office/ui.

 @created 2026-06-23
-->
# @gen-office/ui 아키텍처

GenOffice V2의 **UI 컴포넌트 라이브러리**입니다.  
백오피스 화면·`mdi`·`gen-datagrid-crud` 등 feature 패키지가 `@gen-office/ui`를 통해 일관된 컨트롤·레이아웃·다이얼로그를 사용합니다.

V1 [`frontend/packages/ui`](../../../frontend/packages/ui)를 **수정 이식**합니다. Gate마다 Vitest + Storybook 수동 검증을 수행합니다 ( [migration-plan.md](./migration-plan.md) ).

---

## 1. 패키지 역할·경계

| OK (`ui`) | NOT OK (다른 패키지) |
| --- | --- |
| Radix 래퍼 + CSS Modules | 그리드 엔진 (`gen-datagrid`) |
| 도메인 중립 form·overlay·layout | MDI 탭/창 상태 (`mdi`) |
| `@gen-office/theme` 토큰 소비 | API fetch / query |
| Story + 단위 테스트 | 비즈니스 CRUD 규칙 (`utils` normalize/validation) |

### 의존 방향

```text
apps / mdi / gen-datagrid-crud / demo
        ↓
   @gen-office/ui
        ↓
   @gen-office/theme , clsx , @radix-ui/* , (composed 전용: date-fns, lucide-react, …)
        ↓
   @gen-office/utils  (선택 — 폼/표시 유틸; className은 clsx 직접)
```

- **`@gen-office/utils`의 `cn`:** V1 호환용만. V2 `ui` 신규·수정 코드는 **`clsx` 직접 import** ( [decisions.md](../../.docs/logs/decisions.md) ).
- **TipTap `RichTextEditor`:** Phase 2(composed) 또는 별도 `@gen-office/html-editor` 분리 **보류 가능** — 무거운 엔진은 feature 패키지 후보 ( AGENTS.md ).

---

## 2. 디렉터리 구조 (목표)

```text
packages/ui/
├── .docs/
│   ├── README.md
│   ├── architecture.md          본 문서
│   ├── migration-plan.md        이관 순서·Gate
│   └── logs/implementation-log.md
├── src/
│   ├── index.ts                 public barrel (+ index.css side-effect)
│   ├── index.css                @import @gen-office/theme/index.css + ui globals
│   ├── core/                    Radix·단일 primitive (Phase 1)
│   │   └── Button/
│   │       ├── Button.tsx
│   │       ├── Button.types.ts
│   │       ├── Button.module.css
│   │       ├── Button.stories.tsx
│   │       └── index.ts
│   └── composed/                core 조합 (Phase 2)
│       └── DatePicker/ …
├── test/
│   ├── setup.ts                 jsdom · theme CSS · RTL
│   └── core/                    컴포넌트별 *.test.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

### `core` vs `composed`

| | `core/` | `composed/` |
| --- | --- | --- |
| 역할 | Radix primitive 래퍼 1:1 | core 2개+ · 도메인 UX (FilterBar, DatePicker) |
| 예 | Button, Input, Dialog | AlertDialog, Combobox, SplitLayout |
| Story title | `UI/Core/<Name>` | `UI/Composed/<Name>` |
| 선행 | theme 토큰 | 해당 core export 완료 |

---

## 3. 컴포넌트 파일 규약

V1과 동일한 **폴더 단위 co-location**을 유지합니다.

| 파일 | 역할 |
| --- | --- |
| `*.tsx` | `forwardRef` 컴포넌트 구현 |
| `*.types.ts` | props·variant union (public) |
| `*.module.css` | CSS Modules (`localsConvention: camelCaseOnly`) |
| `index.ts` | named export |
| `*.stories.tsx` | Storybook (lib `dts`·번들 **제외**) |
| `test/core/*.test.tsx` | Vitest + Testing Library |

### AGENTS.md 파일 헤더

모든 신규 `.ts` / `.tsx` / `.css` 상단에 `@file` / `@description` / `@created`, 필요 시 `@remark` (variants, Radix primitive, a11y 메모).

---

## 4. Radix 래퍼 패턴

V1과 동일한 **headless Radix + presentation CSS** 모델입니다.

```tsx
import { forwardRef } from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { clsx } from 'clsx';
import type { CheckboxProps } from './Checkbox.types';
import styles from './Checkbox.module.css';

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <RadixCheckbox.Root
      ref={ref}
      className={clsx(styles.root, className)}
      {...props}
    />
  ),
);
Checkbox.displayName = 'Checkbox';
```

| 규칙 | 내용 |
| --- | --- |
| Ref | leaf DOM 또는 Radix Root에 `forwardRef` |
| `asChild` | Button 등 Slot 패턴 유지 (V1 Button 참고) |
| className | `clsx(styles.*, className)` — **`cn` 사용 안 함** |
| 토큰 | 하드코드 hex 금지 — `var(--color-primary)` 등 theme CSS 변수 |

---

## 5. 스타일·테마

```css
/* src/index.css */
@import "@gen-office/theme/index.css";

/* ui 전역 (필요 시) */
```

- 컴포넌트 CSS는 **component token** (`packages/theme/src/styles/tokens/components/*`)과 **semantic 변수**를 우선 사용.
- V1 `Button.module.css`의 `brand` 클래스는 이식하지 않음 — primary variant·토큰만 사용.

---

## 6. Public export

`src/index.ts`는 **이관 완료된 컴포넌트만** 점진적으로 export 합니다.  
한 컴포넌트 Gate 통과 시 한 줄 추가 — 미완성 bulk export 금지.

```ts
import './index.css';

export * from './core/Button';
// … 이관될 때마다 추가
```

`package.json` exports:

- `"."` → JS + types
- `"./index.css"` → 번들 CSS

---

## 7. 빌드 (Vite lib)

`theme` / V1 `ui` 패턴을 따릅니다 ( Wave 0에서 `vite.config.ts` V2 정리 ).

| 항목 | 정책 |
| --- | --- |
| entry | `src/index.ts` |
| formats | `es` only |
| external | `react`, `react-dom`, `react/jsx-runtime`, `@radix-ui/*`, `@gen-office/theme`, `@gen-office/utils`, `clsx`, `lucide-react`, … |
| CSS | `cssCodeSplit: false`, 산출물 `dist/index.css` |
| dts | `vite-plugin-dts`, **`src/**/*.stories.*` 제외** |

---

## 8. 테스트 전략

V1 `ui`에는 **자동 테스트가 없었음**. V2부터 컴포넌트 Gate마다 추가합니다.

### 8.1 자동 (Vitest + Testing Library)

`packages/theme`과 동일 스택:

```json
"devDependencies": {
  "@testing-library/jest-dom": "6.9.1",
  "@testing-library/react": "16.3.2",
  "@testing-library/user-event": "14.6.1",
  "jsdom": "29.1.1",
  "vitest": "4.1.9"
}
```

`vitest.config.ts`:

- `environment: 'jsdom'`
- `setupFiles: ['./test/setup.ts']` — `@testing-library/jest-dom`, theme CSS import
- `css: true` — CSS Modules 클래스 적용 smoke

**컴포넌트별 최소 테스트 (Gate 필수):**

| 유형 | 예 |
| --- | --- |
| render | default props로 mount, role/query 존재 |
| variant / state | disabled, loading, checked 등 class 또는 aria |
| interaction | click / keyboard 1건 (Radix 컴포넌트) |
| ref | `forwardRef` forward 여부 (필요 시) |

과도한 snapshot·스타일 픽셀 테스트는 하지 않습니다.

### 8.2 수동 (Storybook)

**통합 Storybook:** `apps/storybook` — `packages/*/src/**/*.stories.tsx` 자동 수집 ( 이미 설정됨 ).

`preview.tsx`에 `ThemeProvider` + `@gen-office/theme/index.css` 적용됨.

**수동 Gate 체크 (컴포넌트 이관 PR / 로그마다):**

- [ ] default · 주요 variant 스토리 표시
- [ ] light / dark theme 전환 (`ThemeProvider`)
- [ ] focus ring · keyboard 조작
- [ ] disabled / loading 상태
- [ ] addon-a11y violations 없음 (치명적 항목)

로컬 실행:

```bash
pnpm -C apps/storybook dev
```

---

## 9. Storybook 스토리 규약

V1 `Primitives/*` → V2 **`UI/Core/*`** / **`UI/Composed/*`**

```tsx
const meta = {
  title: 'UI/Core/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Button>;
```

- 스토리 파일은 **컴포넌트 폴더 co-location** (`Button.stories.tsx`)
- `@storybook/react` 타입 — SB 10 (`apps/storybook`과 버전 일치)

---

## 10. 컴포넌트 Gate (Definition of Done)

[migration-plan.md](./migration-plan.md)의 컴포넌트별 체크리스트와 동일합니다.

1. V1 소스·V2 theme/utils 정책 diff 확인
2. `src/core/<Name>/` 파일 이식 + V2 수정 (`clsx`, primary 토큰)
3. `test/core/<Name>.test.tsx` — `pnpm -C packages/ui test` 통과
4. `*.stories.tsx` — `pnpm -C apps/storybook dev` 수동 Gate
5. `src/index.ts` export 추가
6. `pnpm -C packages/ui build` 통과
7. `.docs/logs/implementation-log.md` 한국어 로그

---

## 11. V1 대비 수정 이식 메모

| V1 | V2 |
| --- | --- |
| `cn` from `@gen-office/utils` | `clsx` 직접 |
| `variant="brand"` | 제거 (primary만) |
| Story `Primitives/` | `UI/Core/` |
| 자동 test 없음 | Gate마다 Vitest 필수 |
| package 내 storybook script | **`apps/storybook` 통합** 우선 (로컬 script는 보조) |

---

## 12. 관련 문서

- [migration-plan.md](./migration-plan.md) — 이관 순서·Wave
- [../theme/.docs/architecture.md](../theme/.docs/architecture.md) — 토큰·ThemeProvider
- [../utils/.docs/README.md](../utils/.docs/README.md) — format / normalize
- [.docs/06-PACKAGE-REVIEW-PLAN.md](../../.docs/06-PACKAGE-REVIEW-PLAN.md) — 패키지 검토 순서

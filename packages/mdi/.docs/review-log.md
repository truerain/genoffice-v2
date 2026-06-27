<!--
 @file packages/mdi/.docs/review-log.md
 @description Package review log for @gen-office/mdi (V1 migration).

 @created 2026-06-27

 @remark
 - 패키지 리뷰 순서: [06-PACKAGE-REVIEW-PLAN.md](../../../.docs/06-PACKAGE-REVIEW-PLAN.md) §4 mdi
 - V1 참조: frontend/packages/mdi
-->
# @gen-office/mdi 검토 로그

## 2026-06-27 — P2 V2 컨벤션·접근성·i18n

### 변경 요약

| # | 작업 | 결과 |
| --- | --- | --- |
| P2.1 | `cn` → `clsx` | components 전환; `@gen-office/utils` 의존 제거 |
| P2.2 | 타입 분리 | `types/mdi.types.ts`, `*Container/TabBar/Tab/TabPanel*.types.ts` |
| P2.3 | JSDoc `@file` | `src/**` 주요 파일 |
| P2.4 | Tab 닫기 Button | `size="icon"`; CSS hack 제거 |
| P2.5 | 키보드 | TabBar ←/→/Home/End; `tabListKeyboard` util |
| P2.6 | 포커스 | 탭 전환·닫기·context menu 후 활성 탭 focus |
| P2.7 | i18n | `tabBarLabels` / `TabBar.labels`; `DEFAULT_TAB_BAR_LABELS` export |
| P2.8 | `meta` | `Record<string, unknown>` |

### 검증

- [x] `pnpm -C packages/mdi test` — 25 passed (+ TabBar, tabListKeyboard)
- [x] `pnpm -C packages/mdi build`

### 다음

- Storybook Gate 또는 P3

## 2026-06-27 — P1 테스트·소비자 setup

### 변경 요약

| # | 작업 | 결과 |
| --- | --- | --- |
| P1.1 | store 테스트 확장 | remove/close/update/focus-only/id reopen — **14** store tests |
| P1.2 | setup `reset` | `test/setup.ts` `beforeEach` 전역 reset |
| P1.3 | `src/index.css` | `@import @gen-office/theme/index.css`; `index.ts` side-effect |
| P1.4 | 동일 id 재오픈 | **focus-only** — types JSDoc, README, architecture §4 |
| P1.5 | MDIContainer smoke | empty, render, maxTabs/tabPosition sync, onMaxTabsReached — **6** tests |

### 검증

- [x] `pnpm -C packages/mdi test` — 18 passed
- [x] `pnpm -C packages/mdi build` — `dist/index.css` theme 포함 (~19 kB)

### 다음

- [review-plan.md](./review-plan.md) **P2** (clsx, types 분리, a11y, i18n)

## 2026-06-27 — P0 public API·동작 정합

### 변경 요약

| # | 작업 | 결과 |
| --- | --- | --- |
| P0.1 | `onMaxTabsReached` | `setOnMaxTabsReached` + `MDIContainer` useEffect; `addTab` limit 시 콜백 호출 |
| P0.2 | TabPanel 숨김 | `display: none` 확정 (`.hidden`); 문서와 CSS 일치 |
| P0.3 | 미사용 코드 | `activeTab` 제거; TS6133 0 |
| P0.4 | maxTabs 하향 | **정책 A** — 기존 탭 유지, 신규 `addTab`만 차단 |

### store API 추가

- `setOnMaxTabsReached(handler?)` — container가 콜백 등록
- `reset()` — 테스트·Storybook store 격리 (P1.2 선행)

### 검증

- [x] `pnpm -C packages/mdi test` — 4 (mdiStore maxTabs)
- [x] `pnpm -C packages/mdi build` — TS error 0

### 다음

- [review-plan.md](./review-plan.md) **P1** (index.css, container smoke test, id 재오픈 정책 문서)

## 2026-06-27 — V2 스캐폴딩·설정 정합

V1 `frontend/packages/mdi` 소스를 `packages/mdi`로 이식한 뒤, V2 워크스페이스(`theme` → `utils` → `ui` 완료 후)에 맞게 패키지·빌드 설정을 정리했습니다. **소스 API 검토·동작 Gate는 아직 진행 전**입니다.

### 판단 요약

| 판단 | 항목 |
| --- | --- |
| **이식** | `MDIContainer`, `TabBar`, `Tab`, `TabPanel`, `useMDIStore`, 타입 정의 |
| **수정 이식** | `package.json`, `vite.config.ts`, `vitest.config.ts` — V2 `ui`/`theme` 패턴에 맞춤 |
| **재작성** | `test/setup.ts` (Vitest jsdom 공통 셋업) |
| **제외** | (아직 없음) |
| **보류** | Storybook story, 단위·컴포넌트 테스트, `onMaxTabsReached` 미구현, public `index.css` side-effect 진입점 |

### 이식 범위 (소스)

```text
packages/mdi/src/
├── components/
│   ├── MDIContainer/
│   ├── TabBar/
│   ├── Tab/
│   └── TabPanel/
├── store/mdiStore.ts
├── types/index.ts
└── index.ts
```

**public export** (`src/index.ts`):

- Components: `MDIContainer`, `TabBar`, `Tab`, `TabPanel`
- Store: `useMDIStore`
- Types: `MDITab`, `TabPosition`, `MDIContainerProps`, `TabBarProps`, `TabProps`, `TabPanelProps`, `MDIState`, `MDIActions`, `MDIStore`

**workspace 의존:**

- `@gen-office/theme`, `@gen-office/ui`, `@gen-office/utils`
- `zustand`, `lucide-react`

### package.json 변경

| 항목 | 내용 |
| --- | --- |
| devDependencies | `ui`/`theme`와 동일 핀 (`react` 19.2.7, `vite` 6.4.3, `vitest` 4.1.9, Storybook 10.4.6, `@types/*`, testing-library 등) |
| `jsdom` | Vitest jsdom 환경용 추가 (`29.1.1`) |
| `clean` | `rm -rf dist` 스크립트 추가 |
| `clsx` | 소스에서 직접 미사용 → dependencies에서 제거 (`cn`은 `@gen-office/utils`) |
| `license` | `ISC` (`ui`/`theme`/`utils`와 통일) |

### 빌드·테스트 설정

**`vite.config.ts`**

- lib name: `GenOfficeMdi` (V1 복사본의 `GenOfficeUi` 오기 수정)
- `external`: `react`, `react-dom`, `react/jsx-runtime`, `@gen-office/theme`, `@gen-office/ui`, `@gen-office/utils`, `zustand`, `lucide-react`
- CSS Modules: `localsConvention: 'camelCaseOnly'`
- `@gen-office/theme/index.css` → `../theme/src/index.css` alias (lib 빌드·테스트 공통)

**`vitest.config.ts`**

- jsdom 환경, `test/setup.ts`, `passWithNoTests: true`
- 테스트 파일: `test/**/*.{test,spec}.{ts,tsx}` (현재 0건)

**`test/setup.ts`**

- `@testing-library/jest-dom/vitest`, `cleanup`, `ResizeObserver` mock

**기타**

- `src/env.d.ts` 경로 주석 수정 (`packages/mdi`)

### 루트 설정

**`package.json` → `pnpm.overrides` 추가**

- `vitest`, `jsdom`, `vite-plugin-dts`
- `@testing-library/jest-dom`, `@testing-library/react`, `@testing-library/user-event`

**변경 없음 (이미 V2 호환)**

- `pnpm-workspace.yaml` — `packages/*`에 mdi 자동 포함
- `turbo.json` — `build` → `^build` 의존으로 `theme` → `utils` → `ui` → `mdi` 순 빌드

### public API 변경

- (없음 — V1 이식 직후, V2 검토 전)

### 미결·보류

| 항목 | 설명 |
| --- | --- |
| `onMaxTabsReached` | `MDIContainer` props로 선언되어 있으나 store/`addTab` 연동 미구현 — TS6133 경고 |
| `activeTab` | `MDIContainer` 내부 미사용 변수 — TS6133 경고 |
| `src/index.css` | `ui`처럼 theme import side-effect 진입점 없음; CSS는 컴포넌트 CSS Modules 번들 → `dist/index.css` 생성은 됨 |
| Storybook | `apps/storybook` glob(`packages/*/src/**/*.stories.*`) 대상; mdi story 미작성 |
| 테스트 | store·TabBar·탭 전환·maxTabs 동작 테스트 미작성 |
| 파일 헤더 | V1 스타일 `// packages/mdi/...` 주석 → V2 JSDoc `@file` 형식으로 정리 예정 |

### 검증

- [x] `pnpm install` (workspace 6 packages)
- [x] `pnpm -C packages/mdi build` — `dist/index.mjs`, `dist/index.css`, `.d.ts`
- [x] `pnpm -C packages/mdi test` — passWithNoTests
- [x] `pnpm build` (turbo, mdi 포함)
- [ ] storybook (mdi story 없음)
- [x] 하위 패키지 의존 — `theme`, `ui`, `utils` only; 역방향 없음

### 다음 단계

1. [review-plan.md](./review-plan.md) P0부터 순차 진행
2. V1 `frontend/packages/mdi`와 diff — API·동작 계약 확인
3. Storybook Gate — §6 story 시나리오
4. 검토 완료 후 `gen-chart` 또는 demo shell 연동 — [04-ROADMAP.md](../../../.docs/04-ROADMAP.md) Phase 1b

### 참고

- **검토·개선 Plan:** [review-plan.md](./review-plan.md)
- 사용법 초안: [README.md](./README.md) (V1 기준, 검토 후 갱신 예정)
- **구조·다이어그램:** [architecture.md](./architecture.md)
- 선행 패키지: [packages/ui/.docs/review-log.md](../../ui/.docs/review-log.md) (2026-06-25 마감)

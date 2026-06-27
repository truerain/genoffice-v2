<!--
 @file packages/mdi/.docs/review-log.md
 @description Package review log for @gen-office/mdi (V1 migration).

 @created 2026-06-27

 @remark
 - 패키지 리뷰 순서: [06-PACKAGE-REVIEW-PLAN.md](../../../.docs/06-PACKAGE-REVIEW-PLAN.md) §4 mdi
 - V1 참조: frontend/packages/mdi
-->
# @gen-office/mdi 검토 로그

## 2026-06-27 — Storybook Docs store 격리

### 원인

- Storybook **Docs** 탭은 모든 story를 한 페이지에 동시 렌더링
- `useMDIStore`가 **전역 singleton**(`defaultMDIStore`)이어서 story 간 탭·activeTabId가 공유됨

### 수정

- `createMdiStoreState` — store 로직 분리
- `createMDIStore()` + `MDIStoreProvider` — subtree마다 독립 store
- `useMDIStore` — Context store 우선, 없으면 default singleton (demo·기존 테스트)
- `MDIContainer.stories.tsx` — decorator에 `MDIStoreProvider` + mount/unmount `reset`
- `TabBar.focusActiveTab` — 닫기 직후 stale `activeTabId` 클로저 방지 (`storeApi.getState()`)
- 테스트: `MDIStoreProvider.test.tsx` (41 tests pass)

### 사용 가이드

- Storybook / 다중 MDI 인스턴스: `<MDIStoreProvider>`로 감싸기
- 단일 앱 demo: Provider 없이 `useMDIStore` 그대로 사용 가능

---

## 2026-06-27 — TabBar 가로 스크롤 연동 (2차)

### 원인 추정

- `useLayoutEffect` 1회만 실행 → 신규 탭 DOM 레이아웃 전에 scroll 계산 실패
- `getBoundingClientRect` delta 방식만 사용 → 일부 환경에서 scrollLeft 미갱신
- flex item 기본 `flex-shrink: 1` → 탭 폭이 줄어 overflow·스크롤이 기대와 다를 수 있음

### 수정

- `scrollIntoView({ inline: 'nearest' })` + **document scroll 복원** 후, 여전히 안 보이면 `scrollLeft` 절대값 보정
- `scrollTabIntoTabBarWhenReady` — rAF 재시도 (레이아웃 대기)
- `useScrollActiveTabIntoView` — layout/paint effect + `ResizeObserver`
- `Tab.module.css` — `flex-shrink: 0`
- Storybook `ManyTabsScroll` — Add tab 반복 검증용

### 3차 (화살표 키)

- `useLayoutEffect`/`useEffect`가 **공유 cancelRef**로 rAF 재시도를 서로 취소하던 문제 제거
- `selectTabWithFocus`(←/→/Home/End): `requestAnimationFrame` 후 **스크롤 → focus** 순서로 명시 호출
- `scrollIntoView` 제거, `scrollLeft` 수동 보정만 사용 (페이지 스크롤·포커스 간섭 방지)

### 4차 (LEFT 스크롤)

- 왼쪽으로 잘린 탭은 `getBoundingClientRect()`가 클립 경계에 붙어 `tabStart ≈ scrollLeft`로 계산됨 → LEFT만 스크롤 안 됨
- 탭 위치를 **`offsetLeft`(tabList 기준)** 로 계산하도록 변경

### 5차 (클릭 + 반쯤 가려진 탭)

- 클릭은 `focus()` 없이 `setActiveTab`만 → **같은 탭 재클릭** 시 hook 미실행 → 반쯤 가려진 Tab4 스크롤 안 됨
- `revealTabInBar`: 클릭·키보드 공통 rAF 후 tab bar scroll (document focus/scroll 점프 없음)

### 6차 (activeTab 단일 동기화)

- **`syncTabBarScrollToActiveTab`** — activeTabId → tab bar scroll 단일 진입점
- **`useSyncTabBarScrollToActiveTab`** — activeTabId 변경 시 layout/paint 동기화
- **활성 Tab ref** — active DOM 부착 시 즉시 scroll
- **가시성**: `getBoundingClientRect` / **스크롤 좌표**: `offsetLeft` 분리 (반쯤 가려진 탭 감지)
- `selectTab`·키보드·addTab 모두 `syncTabBarScrollToActiveTab(tabId)` 경유

### 7차 (left 정렬 좌표)

- `offsetLeft`만으로 scroll 시 border/subpixel 오차 → left edge가 컨테이너에 맞지 않음
- **1차**: `getBoundingClientRect` viewport delta (부분 가림 탭, 픽셀 정확)
- **2차**: `offsetLeft` content range (rect collapsed·완전 off-screen)
- viewport nudge 후 **2nd pass** (active 스타일 적용 후 subpixel 보정)

## 2026-06-27 — closable:false pin 탭 (ClosableFalse story)

### 문제

Dashboard(`closable: false`)에 닫기 버튼 표시·닫힘.

### 원인

- Storybook decorator `reset`이 `useEffect` → 자식 `addTab` **이후** 실행되면 focus-only 재호출 등으로 `closable` 미반영
- `removeTab`이 `closable: false` 검사 없음

### 수정

- decorator `useLayoutEffect` reset (자식 `useEffect` addTab보다 선행)
- `ClosableFalseDemo`: `reset()` 후 pin 탭 add
- `removeTab`: `closable === false` no-op

## 2026-06-27 — TabBar 컨텍스트 메뉴 좌표

### 문제

Storybook ContextMenu story에서 우클릭 메뉴 **y 좌표**가 클릭 위치와 어긋남.

### 원인

- `position: fixed` + `clientX/Y`인데 TabBar DOM **내부** 렌더 → Storybook/overflow/transform 좌표계 불일치
- 재오픈 시 **이전 `contextMenuPosition`** 이 잠깐 재사용됨
- clamp 시 메뉴 height 0 측정 → `maxTop` 왜곡 가능

### 수정

- `createPortal(..., document.body)` — viewport 좌표와 일치
- `openContextMenu`: anchor와 position 동시 초기화
- `clampViewportPosition` + rAF remeasure 후 clamp

## 2026-06-27 — Deferred: Excel-style TabBar

- 탭 다수 UX는 Excel 시트 strip 방식(스크롤 화살표·시트 목록 등)으로 **별도 deferred** — `review-plan.md` §5.1
- 현재 TabBar scroll ↔ activeTab 연동은 완료; UI 패턴 개선은 착수 보류

## 2026-06-27 — TabBar 가로 스크롤 연동

### 문제

탭이 많아 `.tabListWrap`에 가로 스크롤바가 생긴 뒤 **Add tab**으로 신규 탭을 열면 활성 탭은 바뀌지만 스크롤 위치가 갱신되지 않아 새 탭이 화면 밖에 남음.

### 수정

- `src/utils/tabScroll.ts` — `scrollTabIntoTabBar` (컨테이너 `scrollLeft`만 조정, 페이지 스크롤 없음)
- `TabBar.tsx` — `tabListWrapRef` + `activeTabId`/`tabs` 변경 시 `useLayoutEffect`로 활성 탭 scroll-into-view
- 키보드·닫기 후 포커스 경로(`focusTabInBar`)에도 동일 스크롤 적용
- `test/utils/tabScroll.test.ts` 3건 추가 (총 29 tests)

## 2026-06-27 — Storybook Gate

### stories

`packages/mdi/src/components/MDIContainer/MDIContainer.stories.tsx` — title: `MDI/MDIContainer`

| Story | 검증 |
| --- | --- |
| Default | 3탭 오픈, Input 상태 보존 |
| MaxTabs | maxTabs=2, onMaxTabsReached 카운터 |
| BottomTabs | tabPosition bottom |
| ContextMenu | tabBarLabels 한글, 우클릭 메뉴 |
| ClosableFalse | pin 탭 + Close Others |
| Empty | custom emptyContent |

### storybook 앱

- `apps/storybook/package.json` — `@gen-office/mdi`, `@gen-office/ui` workspace 의존
- `.storybook/main.ts` — `@gen-office/theme/index.css` alias (CSS import 충돌 방지)
- `.storybook/preview.tsx` — storySort `MDI` 추가

### 검증

- [x] `pnpm -C packages/mdi storybook` → `apps/storybook` 위임 (로컬 `.storybook` 없음)

### 후속 수정 (2026-06-27)

- 탭 **마우스 클릭** 시 `focusTabById` 제거 → 페이지 최상단 스크롤 점프 방지
- 키보드·탭 닫기 focus는 `preventScroll: true` 유지

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

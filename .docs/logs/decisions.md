<!--
 @file .docs/logs/decisions.md
 @description Architecture and technology decision log for GenOffice V2.

 @created 2026-06-23
-->
# GenOffice V2 결정 로그

역시간순. 같은 날짜 섹션 안에서도 **최신 항목이 위**.

## 2026-10-13

### `@gen-office/*`는 npmjs 공개 패키지로 배포

- **결정:** 다른 저장소는 이 모노레포를 workspace로 묶지 않고, npmjs의 `@gen-office/*` 버전을 설치한다. 라이브러리 소스의 내부 의존성은 `workspace:*`로 두고, `pnpm publish --access public`이 배포본에서 정확한 버전으로 바꾼다.
- **배경:** `workspace:*`는 이 저장소 밖에서 해석되지 않는다. GitHub Packages는 스코프가 저장소 소유자(`truerain`)와 같아야 하므로 `@gen-office`에는 쓰지 않는다.
- **제약:** 루트와 `apps/*`는 `private`이라 배포하지 않는다. 같은 버전은 덮어쓸 수 없다. React peer는 `^19.0.0`을 유지하고, React 20은 테스트 후에만 범위를 넓힌다.
- **문서:** [.docs/12-NPM-PUBLISH.md](../12-NPM-PUBLISH.md)

## 2026-08-06

### `@gen-office/debug` foundation 패키지 채택

- **결정:** V1 `@gen-office/debug` MVP(`useDebugState` / `useRenderCount` / `useWhyRender` / `resolveDebugEnabled`)를 V2 `packages/debug`로 이식한다. `utils`에 합치지 않는다.
- **배경:** utils는 React 금지·포맷/정규화/검증 중심. debug는 React peer + console 기반 DEV 훅이라 경계가 다름. V1 도메인(`gen-grid` 등) 의존이 없어 포팅 비용이 낮다.
- **제약:** Dialog UI·DataGrid 데이터셋 뷰어·CRUD 내부 디버그는 포함하지 않음. apps/feature가 `enabled: import.meta.env.DEV`로 옵트인.
- **비채택:** utils 확장, feature 패키지에 프로덕션 필수 의존으로 강제 연결.
- **문서:** [packages/debug/.docs/README.md](../../packages/debug/.docs/README.md), [.docs/02-ARCHITECTURE.md](../02-ARCHITECTURE.md)

## 2026-07-13

### 공개 Docs Quick Start: GenFrame 첫 앱 경로

- **결정:** Getting Started / 홈 CTA의 정본은 **GenFrame으로 새 백오피스 앱 셸을 만드는 것**이다. GenDataGrid-only 임베드는 Key Features 등 보조 트랙.
- **배경:** 도입 질문의 중심은 “그리드를 어떻게 붙이나”가 아니라 “GenOffice 프로젝트를 어떻게 시작하나”이다. `gen-frame`이 layout·메뉴·workarea·navigation 계약을 소유한다.
- **트레이드오프:** AG Grid식 그리드-first Quick Start와 달라진다. 기능 문서 분량은 여전히 그리드가 크다.
- **문서:** [apps/docs/.docs/plan/docs-site-plan.md](../../apps/docs/.docs/plan/docs-site-plan.md)

### 공개 Docs 사이트: Fumadocs + Next.js / 한·영 / 외부 / Vercel

- **결정:** `apps/docs`에 공개 문서 사이트를 둔다. 스택은 **Fumadocs + Next.js + Fumadocs MDX**. 언어는 **한/영**, 공개 범위는 **외부**, 배포는 **Vercel**(demo와 별도 Project). 2026-07-13부터 D0 착수.
- **배경:** AG Grid식 학습 경로·라이브 예제가 필요하나 멀티 프레임워크 codegen은 불필요. Storybook만으로는 튜토리얼·SEO·외부 Docs에 부족. Vite+MDX 직접 구축보다 Fumadocs가 검색·레이아웃·Vercel 적합.
- **트레이드오프:** 모노레포에 Next 런타임이 추가된다(기존 앱은 Vite). demo/docs/storybook 역할을 엄격히 분리해 이중 유지보수를 제한한다.
- **비채택:** Storybook Docs only, 순수 Vite+MDX, Docusaurus/VitePress, AG Grid Astro+Markdoc 파이프라인 복제, 사내-only Docs.
- **문서:** [apps/docs/.docs/plan/docs-site-plan.md](../../apps/docs/.docs/plan/docs-site-plan.md)

## 2026-07-09

### gen-datagrid 토큰 계층: 하이브리드 구조 확정 (D4 정제)

- **결정:** (D4 정제) theme semantic(`--color-*`) 참조는 **Shell 토큰 3~5개**에만 한정. 하위(Header/Body/Footer/System/Chrome/Feature)는 `--gen-datagrid-*`만 참조·파생. 추상 팔레트 레이어(`--gen-datagrid-color-*`) 폐기.
- **구조:** Shell → Regions(Header/Body/Footer) → System(Header/Body/Footer override) → Chrome → Features. AG Grid 영역 prefix + GenDataGrid DOM·system 분리 + feature 토큰 하이브리드.
- **구현:** WS1.2로 분리. 정본 `packages/gen-datagrid/.docs/architecture/design-tokens-architecture.md`, `.docs/10` §6.5.
- **비채택:** 전 레이어 semantic 참조(WS1, mini-theme 중복), gen-chart식 완전 자립 hex+dark preset(브랜드 단일 소스·유지보수 비용).

## 2026-07-08

### 디자인 토큰 소유권: 패키지 전용 토큰의 패키지 내부화 + CSS 로드 컨벤션(B)

- **결정:** (D1) 패키지 전용 디자인 토큰은 **해당 패키지 내부에서 정의**한다. base·semantic 등 cross-cutting 팔레트는 `packages/theme`에 잔류. (D2) theme `components/grid.css`를 **완전 삭제**한다(V1 하위호환·어댑터 금지). (D3) `gen-datagrid`는 `--gen-datagrid-*` 토큰을 **자체 신규 정의**하고 V1 `--grid-*` 네이밍/값을 승계하지 않는다. (D4) datagrid 토큰 값은 **theme semantic 참조 + 폴백**(`var(--color-*, #hex)`)으로 다크모드 자동 상속·브랜드 단일 소스를 유지. (D5) CSS 로드 목표 컨벤션은 **B 방식**(앱이 theme 1회 로드, 라이브러리 패키지는 self-`@import` 없이 토큰 참조+폴백). (D6) 기존 ui/mdi/gen-chart/gen-frame의 A→B 전환은 그리드 트랙과 분리한 별도 워크스트림으로 진행.
- **배경:** theme `--grid-*`의 V2 런타임 소비처(`gen-grid`)가 이 레포에 부재(검증 0건)하고, `gen-datagrid`는 theme와 단절되어 hex 하드코딩 상태. theme grid 토큰은 V1 기준이라 updated 상태색·헤더 높이 등 V2와 충돌하고 active/editing/dirty/validation/visual-merge 등 커버리지 갭이 큼.
- **트레이드오프:** A(패키지 self-import)의 중복 비용은 실질적으로 미미(번들 dedupe·멱등 `:root`)하나, B는 결합도·로드 순서 관점에서 더 건전. ui/mdi는 theme var 폴백이 없어 A→B 전환 시 폴백 보강이 선행되어야 안전(그래서 WS2로 분리).
- **비채택:** theme grid.css 유지 후 부분 이관(3번째 혼재 상태·의미 충돌 승계), gen-datagrid 완전 자립(brand 복제로 단일 소스 붕괴·다크 별도 관리).
- **문서:** [.docs/10-THEME-TOKEN-MIGRATION-PLAN.md](../10-THEME-TOKEN-MIGRATION-PLAN.md)

### 데모 CRUD 커밋 계약: CommitPayload<TRequest> + PK 필수(sentinel) + 전체 행 update

- **결정:** CRUD 화면 공용 커밋 계약을 `shared/api/commit.ts`의 `CommitPayload<TRequest>`(`created/updated/deleted`)로 통일. 요청 타입에 **PK를 필수 포함**하고 신규는 sentinel(`NEW_ID`)로 표기, 서버(MSW)는 `id===NEW_ID`면 채번. **update는 전체 행**(모든 편집 컬럼) 전송(일반 `UPDATE SET 전체` / ORM save 정합).
- **배경:** rowId 단일 문자열은 복합키에 부적합, delta-only update는 "UPDATE 모든 컬럼" 관례와 어긋남. 요청/응답 타입 분리는 파생·감사 필드 배제와 오버포스팅 방지를 위해 유지.
- **트레이드오프:** sentinel은 매직 밸류 계약이라 문서화 필요(타입 안전성은 optional 대비 실질 동등). 전체 행 update는 "요청 타입 = 편집 컬럼 전체"일 때만 안전(부분 projection 화면은 별도 검토), 동시편집 클로버는 낙관적 락으로 보완.
- **비채택:** `api/`·`model/` 폴더 과분리, `{key,patch}` envelope(구조 한 겹 추가), `userId?` optional(정밀도·관례 애매).
- **문서:** [apps/demo/.docs/guide/data-integration.md](../../apps/demo/.docs/guide/data-integration.md) (화면 작성 표준·체크리스트).

### 데모 데이터 계층: TanStack Query + MSW 채택

- **결정:** `apps/demo`의 데이터 흐름을 실제 업무와 동일하게 "컴포넌트 → react-query 훅 → httpClient → 네트워크"로 세우고, dev mock은 **MSW로 일원화**. `@tanstack/react-query`(dep), `msw`(devDep) 도입.
- **배경:** 기존 mock은 api 모듈 내 분기(`useMockAuth/useMockMenu`)라 페이지 데이터 흐름이 실제와 달랐음. MSW는 네트워크만 가로채므로 페이지/‌api 코드가 프로덕션과 동일해져 레퍼런스로서 신뢰도가 높음.
- **범위:** UserPage를 최초 레퍼런스(useQuery+useMutation)로 전환. auth/app-menu mock은 MSW 핸들러로 이관(구 `mock/mockAuth.ts` 삭제). MenuPage/Actuals/CustomerInfo는 후속.
- **경계:** react-query/MSW는 `apps/demo`에 한정(패키지 미도입). MSW 워커는 `import.meta.env.DEV && VITE_ENABLE_MSW !== 'false'`일 때만 동적 import → 프로덕션 번들에서 tree-shake로 제외.
- **트레이드오프:** 의존성/부트스트랩 복잡도 증가 대신 데모가 실제 데이터 흐름을 충실히 재현. 시드/서버 상태는 `src/mocks/data` + 핸들러 in-memory store로 이동(페이지에서 직접 import 제거).

## 2026-06-29

### `@gen-office/gen-frame` 패키지 신설 (설계)

- **역할:** 앱 layout chrome, navigation 오케스트레이션, URL ↔ page, MDI/단일 페이지 host
- **네이밍:** `gen-grid` / `gen-chart` / `gen-frame` 제품군 정렬
- **경계:** 메뉴 API·registry·auth는 `apps/*`; `mdi`는 optional peer
- **Showcase:** 동일 메뉴로 layout mode 전환 — Shell 복제 대신 `NavRenderer` registry
- 문서: `packages/gen-frame/.docs/`

## 2026-06-28

### 소스 규칙 정본 분리

- `.docs/09-SOURCE-CONVENTIONS.md` — encoding, file headers, `@remark`/`@history`, 로그 분업
- `AGENTS.md` — Source Conventions 요약 + 링크; 상세 예시는 09로 이전

### apps/demo 구현 전략 — shell·chart 선행

- **D0~D3:** grid 없이 scaffold, MDI shell, Chart/Dashboard (`gen-chart`)
- **D4~D5:** `gen-datagrid-crud` · `gen-datagrid-chart` 합류 후 admin·Actuals
- gen-datagrid 미완이어도 demo shell 착수 가능; admin 포팅은 보류
- 문서: `apps/demo/.docs/`

## 2026-06-27

### @gen-office/gen-chart Phase 1 마감

- Gate C0~C7 완료; C8·연동·고급 기능은 Phase 2로 이관
- 선행: gen-datagrid MVP, apps/demo, gen-datagrid-chart
- 정본: `packages/gen-chart/.docs/phase.md`

### @gen-office/gen-chart motion 계층 분리

- **lifecycle** `ChartMotionOptions` (C6b) vs **interactive** emphasis / selection / visibility motion (Phase 2)
- core는 항상 최종 geometry; hit-test·tooltip은 목표 geometry 기준 유지
- C7·C8에 상호작용 모션 구현 필수 아님 — 연구 후 `motion.md` 순서로 착수
- 문서: `packages/gen-chart/.docs/motion.md`

## 2026-06-25

### @gen-office/ui V1 이관 마감

- **Wave 5 composed C1~C9** Gate 완료 (AlertDialog … TreeView)
- **제외·별도:** PopupInput 제거, RichTextEditor → `@gen-office/html-editor`
- **정리:** orphan `popupInput/` 삭제; canonical `combobox/` 유지
- **다음 패키지 리뷰:** `mdi`
- 문서: `packages/ui/.docs/review-log.md`, `migration-plan.md` §11

### @gen-office/ui 소스 구조 — `composed/` 단일, RichTextEditor ui 밖

- **`src/panels/` 도입 보류·롤백** — SplitLayout `composed/splitLayout` 유지; TreeView도 `composed/treeView`
- **UX 구분은 문서로** — TreeCombobox(필드) vs TreeView(탐색 패널); 물리 폴더 분리는 규모상 불필요
- **RichTextEditor** — V1 composed 이관 대신 **`@gen-office/html-editor` 별도 패키지**; `ui` Wave 5 Gate 제외
- 문서: `migration-plan.md` §6, `architecture.md`

### @gen-office/ui C5 — MaskedInput 선행 · DatePicker 순서

- **C5a** core **MaskedInput** (+ `@gen-office/utils` `format/mask`) — V1 없음; 1차 preset `ymd`·`ym`
- **C5b** composed DatePicker 계열 — MaskedInput + Calendar + Popover; V1 raw input split chrome **미사용**
- **구조 분리** — mask 엔진·MaskedInput은 DatePicker import 없음; `Date` parse/format은 composed만; date preset은 registry 한 종류
- value: MaskedInput = **display string**; DatePicker = **`Date`**
- 범용 mask(전화·사업자번호 등) → deferred **D-003**
- 문서: `packages/ui/.docs/core/masked-input.md`, `composed/date-picker.md`; `migration-plan.md` §5c·C5a/C5b

### @gen-office/ui FilterBar 레이아웃 표준 — 2-zone · size preset

- **fields / actions 분리** — `actionsPlacement="column"` 기본; actions는 fields **오른쪽 세로 column**
- **필드 너비** — `FilterBarFieldSize` (`xs`~`xl`, `fill`); theme `--filter-field-width-*`
- **정렬** — fields 영역 12-column CSS Grid, `align-items: end`; `flex`/`width`는 legacy
- **`inline`** — V1 한 줄 flex 호환; 신규 화면은 `column` + `size` 사용
- **simple/detail** — chevron on bottom border (`border`); borderless = `border-bottom` only; `divider` removed

### @gen-office/ui Filter composed 명명 — `FilterBar` + `StandardFilterBar`

- **FilterBar** + `FilterBar.Item` — V1 compound 레이아웃 유지 (grid action **bar**·데이터 **row**와 구분)
- V1 **SimpleFilterBar** → **StandardFilterBar** (`StandardDialog`·`StandardSelect` 패턴)
- V1 **SearchInput** — 내부 전용, public export 없음
- `FilterRow`·`FilterGroup` 등 대안은 grid `row` 혼동·`*Group` 의미 축으로 보류

### @gen-office/ui `MasterDetailLayout` V2 미이관

- V1 `composed/MasterDetailLayout` — `SplitLayout` + optional `title`/`actions` 헤더 thin wrapper
- **앱/demo 사용 0건**; admin 화면은 `SplitLayout` 직접 + `PageHeader` 패턴
- V2 Wave 5에서 **제외**; `migration-plan.md` C4 삭제·이후 순번 조정

## 2026-06-24

### @gen-office/ui StandardRadioGroup 적용

- `SimpleRadioGroup` → `StandardRadioGroup` (`RadioGroup` + `Radio` primitive 유지)
- 앱 폼 기본 라디오 API; 커스텀 레이아웃은 `RadioGroup` + `Radio`

### @gen-office/ui StandardDialog 적용

- `SimpleDialog` → `StandardDialog` (Dialog primitive 이름 유지)
- 앱 화면 기본 모달 API; composed·커스텀은 `Dialog*` compound

## 2026-06-23

### @gen-office/theme primary → near-black (Danger와 구분)

- **`--color-primary`:** `#171717` (light hover `#262626`, tint `var(--base-neutral-100)`)
- **dark mode primary:** `#fafafa` (CTA invert), hover `#ffffff`
- **이유:** 마젠타 primary(`#C6004D`)와 Bootstrap danger(`#DC3545`) 시각적 혼동
- **button.css:** focus/outline/shadow 마젠타 rgba → neutral; dark outline overrides 추가
- **danger/status:** Bootstrap red 유지

### @gen-office/utils `cn` vs `clsx` 정책

- **`cn`:** V1 `ui`/`mdi` 이식 호환용으로 `@gen-office/utils`에 유지 (clsx thin wrapper).
- **V2 신규·수정:** className 병합은 각 패키지가 **`clsx` 직접 의존**해 사용. utils에 `cn` 확장·신규 export 하지 않음.
- ui 이식 완료 후 `cn` 모듈 제거 검토.

### @gen-office/theme 색상 토큰 정책

- **1층 팔레트:** CSS 변수가 유일한 source of truth. 색 값은 `#rrggbb` hex.
- **강조색(primary):** ~~`#C6004D`~~ → **`#171717`** (near-black CTA; danger red와 분리). dark mode CTA `#fafafa`.
- **status:** Bootstrap 계열 유지 (`#28a745`, `#ffc107`, `#dc3545`, `#17a2b8`).
- **brand 토큰 제거:** `--color-brand`·`--button-brand-*` 삭제. Button·CTA는 primary만 사용.
- **JS 프리셋 제거:** `lightTheme` / `darkTheme` export 삭제. `useTheme()`만 런타임 JS API.
- **ChartTokens:** `@gen-office/theme`에서 제거. `@gen-office/gen-chart` 패키지에서 정의·소유.
- **Theme 타입:** `colors.brand` → `colors.primary` (`default` / `light` / `dark`).

관련 문서: `packages/theme/.docs/ref/token-sources-and-decisions.md`

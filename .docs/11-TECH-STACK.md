<!--
 @file .docs/11-TECH-STACK.md
 @description GenOffice V2 채택 기술 스택 카탈로그와 항목별 장단점·채택 이유.

 @created 2026-07-12
-->
# GenOffice V2 기술 스택

이 문서는 GenOffice V2에 **현재 채택된 기술 스택**의 목록과, 각 항목의 **장단점·채택 이유**를 정리합니다.

| 구분 | 정본 |
| --- | --- |
| **버전 핀** (기계적) | 루트 [`package.json`](../package.json) `pnpm.overrides` |
| **왜 골랐는지 / 트레이드오프** | 본 문서 |
| **개별 결정 기록** | [logs/decisions.md](./logs/decisions.md) |
| **패키지 경계·의존 방향** | [02-ARCHITECTURE.md](./02-ARCHITECTURE.md) |

버전 숫자는 `pnpm.overrides`가 우선합니다. 본 문서의 버전은 작성 시점 스냅샷이며, 충돌 시 overrides를 따릅니다.

---

## 1. 현재 스택 요약

| 영역 | 기술 | 버전 (스냅샷) | 비고 |
| --- | --- | --- | --- |
| UI 프레임워크 | React | 19.2.7 | `react` / `react-dom` override |
| 언어 | TypeScript | 5.9.3 | |
| 앱·패키지 빌드 | Vite | 6.4.3 | |
| 모노레포 패키지 관리 | pnpm | 9.15.0 | `packageManager` |
| 모노레포 태스크 | Turbo | latest (루트) | `turbo run build` 등 |
| 런타임 | Node.js | 20+ | `engines` |
| 린트 | ESLint | ^9 | `eslint.config.js` |
| 컴포넌트 문서 | Storybook | 10.4.6 | `apps/storybook` |
| 단위·상호작용 테스트 | Vitest | 4.1.9 | Testing Library 병행 |
| 그리드 상태 | TanStack Table + Virtual | (패키지 dep) | `gen-datagrid` |
| 헤드리스 UI | Radix UI | (패키지 dep) | `packages/ui` |
| 차트 렌더 | visx (+ core는 d3-scale) | (패키지 dep) | `gen-chart` |
| 서버 상태 (demo) | TanStack Query | (demo dep) | `apps/demo` 한정 |
| API mock (demo) | MSW | (demo devDep) | `apps/demo` 한정 |

요약 표는 루트 [README.md](../README.md) 「기술 스택」과도 맞춰 둡니다.

---

## 2. 플랫폼 스택

각 항목은 **역할 → 장점 → 단점/비용 → 이 레포에서 채택한 이유** 순으로 적습니다.

### 2.1 React 19

- **역할:** UI 런타임. 모든 앱·React 패키지의 peer/override 기준.
- **장점:** 생태계·인재 풀이 넓음. Concurrent·최근 React API를 프레임워크 쪽에서 활용 가능.
- **단점/비용:** 생태계 일부(구형 라이브러리·예시)가 18 기준. 마이그레이션·디버깅 시 버전 혼선 위험. major 업은 전 패키지 동시 검증 부담.
- **채택 이유:** 워크스페이스 기준 React를 19.x로 고정. 핀은 `pnpm.overrides`.

### 2.2 TypeScript 5.9

- **역할:** 패키지·앱 공용 타입 시스템. 공유 설정은 `@gen-office/tsconfig`.
- **장점:** 대규모 모노레포에서 계약(API·props)을 문서화·검증. 리팩터·패키지 경계 유지에 유리.
- **단점/비용:** `strict`·project reference 유지 비용. 타입만으로 런타임 계약을 대체할 수 없음.
- **채택 이유:** 타입스크립트 전제 모노레포. 버전은 5.9.3으로 핀.

### 2.3 Vite 6

- **역할:** 앱(`demo`, `storybook`)과 라이브러리 패키지 빌드/개발 서버.
- **장점:** 빠른 HMR·간단한 설정. ESM·모노레포 패키지 개발과 잘 맞음.
- **단점/비용:** 패키지별 `vite`/`vite-plugin-dts` 설정 중복. 앱과 라이브러리 빌드 옵션 차이 관리 필요.
- **채택 이유:** 앱·패키지 공통 빌드 도구로 6.4.x 핀.

### 2.4 pnpm 9

- **역할:** workspace 설치·호이스팅 제어·`overrides`로 버전 단일화.
- **장점:** disk/링크 효율, workspace 프로토콜, peer 의존성 엄격. monorepo에서 npm/yarn보다 예측 가능.
- **단점/비용:** 팀원·CI가 pnpm에 익숙해야 함. phantom dependency 습관이 있으면 깨짐(의도된 엄격함).
- **채택 이유:** pnpm workspace. `packageManager`: `pnpm@9.15.0`.

### 2.5 Turbo

- **역할:** `build` / `lint` / `test` / `dev` 등 패키지 태스크 오케스트레이션·캐시.
- **장점:** 변경된 패키지만 재실행해 CI·로컬 반복 비용 감소. 파이프라인 선언이 단순.
- **단점/비용:** 캐시 무효화·필터 이해 필요. 루트에 `nx`도 있으나 주 오케스트레이션은 Turbo.
- **채택 이유:** pnpm workspace와 조합한 모노레포 태스크 표준.

### 2.6 Node.js 20+

- **역할:** 로컬·CI 런타임. Vite/Storybook/도구 체인 전제.
- **장점:** 현재 프론트 툴체인이 요구하는 LTS 구간. 네이티브 fetch 등 현대 API.
- **단점/비용:** Node 18 환경은 공식 미지원. 구형 CI 이미지 교체 필요.
- **채택 이유:** `engines.node: >=20.0.0`.

### 2.7 ESLint 9

- **역할:** 저장소 루트 린트. 설정 파일: [`eslint.config.js`](../eslint.config.js).
- **장점:** TS parser·type-aware recommended로 타입 관련 실수를 조기에 잡음.
- **단점/비용:** ESLint 9 Flat Config 전환 과도기. 현재 파일명은 flat 관례이나 본문은 `extends` 등 **구 eslintrc 스타일**이라 이후 flat 정식화 시 정리 필요. type-aware 규칙은 느리고 tsconfig 범위 관리가 까다로움.
- **채택 이유:** 루트 ESLint 9로 모노레포 단위 린트. 문서의 `.eslintrc.json` 예시와 파일명만 다름.
- **비채택:** 패키지별 파편화된 `.eslintrc*` 다중화(현 시점 미사용).

### 2.8 Storybook 10

- **역할:** `apps/storybook`에서 ui · mdi · gen-chart · gen-frame · gen-datagrid 등 통합 시각·문서 검증.
- **장점:** 패키지를 앱 없이 고립 검증. a11y·docs 애드온과 Vite 빌드 경로 공유.
- **단점/비용:** Storybook major 업그레이드 비용이 큼. 통합 앱이라 스토리·의존성 그래프가 무거워질 수 있음.
- **채택 이유:** 컴포넌트 프레임워크 특성상 시각 회귀·API 문서화가 필수. 통합 Storybook 앱으로 정리.

### 2.9 Vitest 4 (+ Testing Library)

- **역할:** 패키지 단위 테스트(`pnpm test` / 패키지별 vitest). DOM·상호작용은 Testing Library.
- **장점:** Vite와 설정·변환 경로를 공유해 속도·일관성 좋음. jsdom으로 그리드 interaction 테스트 가능.
- **단점/비용:** E2E(브라우저 실사용)는 별도. 그리드·차트는 테스트 작성·유지 비용이 큼.
- **채택 이유:** Vite 계열 테스트 러너. Vitest 4.x + Testing Library 버전을 overrides로 고정.

---

## 3. 도메인·라이브러리 스택

### 3.1 TanStack Table + TanStack Virtual (`gen-datagrid`)

- **역할:** 그리드 **상태 모델**(정렬·필터·컬럼·행 모델)과 **가상 스크롤**. 렌더는 **div `role="grid"`** (table DOM 아님).
- **장점:** 헤드리스라 UI·DOM 계약을 우리가 소유. 대량 행에서 Virtual이 필수.
- **단점/비용:** “그리드 제품”이 아니라 조립 키트 — selection·editing·키보드·a11y는 자체 구현. 학습·유지 비용이 AG Grid 등 상용 대비 높음.
- **채택 이유:** 핵심이 **자체 그리드 엔진**. 상용 그리드 라이선스·DOM 제약을 피함.
- **비채택:** AG Grid 등 상용 풀스택 그리드. table DOM 기반 레거시 그리드 스택.

상세: [packages/gen-datagrid/.docs](../packages/gen-datagrid/.docs/), [02-ARCHITECTURE.md](./02-ARCHITECTURE.md)

### 3.2 Radix UI (`packages/ui`)

- **역할:** Dialog, Popover, Select 등 접근성·포커스 트랩이 필요한 헤드리스 프리미티브. theme 토큰과 composed 컴포넌트로 감쌈.
- **장점:** a11y·포커스 동작의 검증된 기반. UI 외형을 theme에 맡기기 쉬움.
- **단점/비용:** 스타일·합성은 전부 우리 몫. Radix API/버전 추적 필요. 무거운 에디터 등은 ui에 넣지 않음([`html-editor` 분리 방침](./logs/decisions.md)).
- **채택 이유:** 백오피스 폼·모달·오버레이의 표준 기반.
- **비채택:** ui 패키지 안에 TipTap 등 대형 엔진을 직접 넣기.

### 3.3 visx + d3-scale (`gen-chart`)

- **역할:** 차트 **렌더 어댑터**(visx)와 **스케일·도메인 core**(d3-scale). public API는 headless model + composable React ([05-GEN-CHART.md](./05-GEN-CHART.md)).
- **장점:** SVG 조합이 유연. core를 React/visx와 분리해 테스트·재사용 가능. API·headless 계약을 처음부터 정리할 수 있음.
- **단점/비용:** “차트 완제품”이 아님 — 테마·모션·키보드·연동은 게이트로 직접 쌓음. visx 패키지 쪼개진 의존성 관리 필요.
- **채택 이유:** visx는 internal renderer로만 쓰고 public은 composable 계약.
- **비채택:** 단일 monolith 차트 컴포넌트. Chart.js/ECharts 등 완제품 위주 스택(커스텀·그리드 연동 계약이 약함).

### 3.4 TanStack Query + MSW (`apps/demo` 한정)

- **역할:** demo의 서버 상태(Query/Mutation)와 개발용 HTTP mock(MSW).
- **장점:** 페이지 → 훅 → httpClient → 네트워크 흐름이 프로덕션과 동일. MSW는 네트워크만 가로채 mock 분기 오염을 줄임.
- **단점/비용:** demo 부트스트랩·워커·시드 데이터 복잡도 증가. 패키지(`gen-*`)에는 도입하지 않음 → 앱마다 다시 선택.
- **채택 이유:** [decisions.md 2026-07-08](./logs/decisions.md) — 데모를 레퍼런스 데이터 계층으로 신뢰도 있게 맞춤.
- **범위:** `@tanstack/react-query`는 demo dep, `msw`는 demo devDep. 프로덕션 번들에서 MSW tree-shake.

---

## 4. 명시적으로 포함하지 않는 것

| 항목 | 이유 |
| --- | --- |
| table DOM 기반 레거시 그리드 스택 | div 기반 `gen-datagrid`가 핵심 엔진 |
| monolith 차트 구현 | headless + composable API로 재설계 ([05-GEN-CHART.md](./05-GEN-CHART.md)) |
| 상용 AG Grid 등 | 라이선스·DOM/테마 종속. 자체 `gen-datagrid` 전략과 충돌 |
| React Flow 등 다이어그램 완제품 | 현 범위 밖. 아이디어 단계만 [idea/process-diagram.md](./idea/process-diagram.md) |
| 패키지 공용으로의 react-query/MSW | demo 레퍼런스에 한정 ([decisions.md](./logs/decisions.md)) |

---

## 5. 버전 변경 규칙

- **minor/patch:** 필요 시 overrides를 갱신하고, 영향 패키지 `build` / `test`로 검증.
- **major:** 명시적 합의 없이 올리지 않는다 (`AGENTS.md` Core Stack과 동일).
- 스택 **교체**(예: 테스트 러너·UI 프리미티브 교체)는 본 문서와 [decisions.md](./logs/decisions.md)에 이유를 남긴다.

---

## 6. 관련 문서

| 문서 | 내용 |
| --- | --- |
| [01-OVERVIEW.md](./01-OVERVIEW.md) | 목표·MVP |
| [02-ARCHITECTURE.md](./02-ARCHITECTURE.md) | 모노레포·패키지 책임 |
| [05-GEN-CHART.md](./05-GEN-CHART.md) | 차트 스택·API |
| [logs/decisions.md](./logs/decisions.md) | 개별 기술 결정 |
| 루트 [README.md](../README.md) | 빠른 스택 표·현재 상태 |
| 루트 [AGENTS.md](../AGENTS.md) | 에이전트용 Core Stack 요약 |

# GenOffice V2

GenOffice V2(`genoffice-v2`)는 기존 [`frontend`](../frontend) 워크스페이스를 한 단계 발전시킨 **차세대 백오피스 프론트엔드 프레임워크**입니다.

V1이 table DOM 기반 `@gen-office/gen-grid`를 중심으로 성장했다면, V2는 div 기반 `@gen-office/gen-datagrid`를 핵심 그리드 엔진으로 삼고 레거시 그리드 스택을 제거하는 것을 목표로 합니다.

차트(`@gen-office/gen-chart`)도 V1은 급히 구현되며 API·headless 계약이 정리되지 않았으므로, V2에서는 **코드 이식 없이 API 우선으로 처음부터 재작성**합니다.

## 현재 상태

| 항목 | 상태 |
| --- | --- |
| 소스 코드 이식 | **준비 중** — 문서·구조 정의 단계 |
| 기반 레포 | [`frontend`](../frontend) |
| 백엔드 | [`backend`](../backend) — API 변경 없이 연동 가능 |
| 패키지 스코프 | `@gen-office/*` (내부 워크스페이스 기준) |
| gen-datagrid | **다른 agent**에서 Gate 8까지 완성 |
| 나머지 packages | **직접 소스 검토** — `theme` → `utils` → `ui` → … 순 ([검토 계획](./docs/06-PACKAGE-REVIEW-PLAN.md)) |

## V2에서 바뀌는 핵심

- **그리드 엔진**: `gen-grid` → `gen-datagrid` (div `role="grid"`, TanStack Table 상태 모델 유지)
- **CRUD 레이어**: `gen-grid-crud` → `gen-datagrid-crud` (신규 설계·이식)
- **차트 엔진**: `gen-chart` V2에서 API·headless 모델부터 재설계 (V1 `GenChart` monolith 이식 안 함)
- **차트 연동**: `gen-grid-chart` → `gen-datagrid-chart` (새 GenChart API 기준)
- **레거시 제거**: `gen-grid`, `gen-grid-crud`, `gen-grid-chart`, V1 `gen-chart` 구현은 V2에 포함하지 않음
- **안정 자산 유지**: `theme`, `ui`, `utils`, `mdi`, demo 인프라(MDI·메뉴·인증)는 V1에서 이식

## 목표 기술 스택 (초안)

| 항목 | V1 (`frontend`) | V2 (`genoffice-v2`) |
| --- | --- | --- |
| 프레임워크 | React 18 | React 18 → 이후 React 19 검토 |
| 언어 | TypeScript 5.7 | TypeScript 5.7+ |
| 빌드 | Vite 6, Turbo | 동일 |
| 패키지 관리 | pnpm 9 | pnpm 9+ |
| 문서화 | Storybook 8 | Storybook 8 → 이후 9 검토 |
| 데이터 그리드 | TanStack Table + table DOM | TanStack Table + div renderer |
| 차트 | visx (monolith `GenChart`) | visx + headless composable API (신규 설계) |
| UI | Radix UI | Radix UI (V1에서 이식) |

## 계획된 워크스페이스 구조

```text
genoffice-v2/
  apps/
    demo/              V2 통합 데모 (gen-datagrid 기반)
    storybook-all/     통합 Storybook

  packages/
    theme/             디자인 토큰, 글로벌 스타일
    ui/                공통 UI 컴포넌트
    utils/             공통 유틸리티
    mdi/               MDI 레이아웃
    gen-datagrid/      div 기반 데이터 그리드 (핵심)
    gen-datagrid-crud/ 그리드 CRUD 레이어 (신규)
    gen-datagrid-chart/ 그리드-차트 연동 (신규 또는 포팅)
    gen-chart/         차트 컴포넌트 (V2 신규 설계·구현)
    tsconfig/          공유 TypeScript 설정

  docs/                V2 설계·로드맵·아키텍처 문서
```

## 패키지 의존 방향

```text
apps → feature packages → ui → theme/utils
```

- `gen-datagrid`는 `ui`, `utils`에만 의존합니다.
- `gen-datagrid-crud`는 `gen-datagrid` 위에 CRUD·Excel·i18n 연동을 제공합니다.
- 앱은 도메인 화면과 라우팅·API 연동만 담당합니다.

## 문서

상세 개요와 설계 방향은 [`docs/`](./docs/)를 참고하세요.

| 문서 | 설명 |
| --- | --- |
| [docs/README.md](./docs/README.md) | 문서 목차 |
| [docs/01-OVERVIEW.md](./docs/01-OVERVIEW.md) | 프로젝트 개요·목표·범위 |
| [docs/02-ARCHITECTURE.md](./docs/02-ARCHITECTURE.md) | 아키텍처·패키지 경계 |
| [docs/03-V1-RELATIONSHIP.md](./docs/03-V1-RELATIONSHIP.md) | V1(`frontend`)과의 관계·이식 원칙 |
| [docs/04-ROADMAP.md](./docs/04-ROADMAP.md) | 단계별 마이그레이션 로드맵 |
| [docs/05-GEN-CHART.md](./docs/05-GEN-CHART.md) | GenChart V2 재설계·API·품질 Gate |
| [docs/06-PACKAGE-REVIEW-PLAN.md](./docs/06-PACKAGE-REVIEW-PLAN.md) | 패키지별 소스 검토 순서·분담 |

## V1과의 관계

- **V1** [`frontend`](../frontend): 현재 운영·데모 기준. `gen-grid` 기반.
- **V2** `genoffice-v2`: 신규 개발 기준. `gen-datagrid` 기반.
- V2 MVP가 완료되기 전까지 V1은 참조 구현 및 회귀 비교 기준으로 유지합니다.
- V2 출시 후 V1은 기능 freeze를 원칙으로 합니다.

## MVP 완료 기준 (초안)

- [ ] `gen-grid` 패키지 없이 워크스페이스 빌드·테스트·lint 통과
- [ ] `gen-datagrid` Gate 8 (MVP Acceptance) 충족
- [ ] `gen-datagrid-crud`로 대표 admin CRUD 화면 동작
- [ ] demo: 로그인 → MDI → 메뉴 기반 화면 5종 이상 GenDataGrid로 동작
- [ ] mock 모드 및 실 backend 연동 모두 동작
- [ ] `gen-chart` Chart/Dashboard demo 시나리오를 V2 composable API로 재현

## 빠른 시작 (코드 이식 후)

소스 이식이 완료되면 아래 명령을 사용합니다.

```bash
pnpm install
pnpm dev          # 데모 앱
pnpm demo:mock    # Mock 모드
pnpm storybook    # Storybook
pnpm build        # 전체 빌드
pnpm test         # 테스트
```

## 관련 리포지토리

- [frontend](../frontend) — GenOffice V1 프론트엔드
- [backend](../backend) — Spring Boot 백오피스 API

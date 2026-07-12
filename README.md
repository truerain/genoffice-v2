# GenOffice V2

GenOffice V2(`genoffice-v2`)는 기존 [`frontend`](../frontend) 워크스페이스를 한 단계 발전시킨 **차세대 백오피스 프론트엔드 프레임워크**입니다.

V1이 table DOM 기반 `@gen-office/gen-grid`를 중심으로 성장했다면, V2는 div 기반 `@gen-office/gen-datagrid`를 핵심 그리드 엔진으로 삼고 레거시 그리드 스택을 제거하는 것을 목표로 합니다.

차트(`@gen-office/gen-chart`)도 V1은 급히 구현되며 API·headless 계약이 정리되지 않았으므로, V2에서는 **코드 이식 없이 API 우선으로 처음부터 재작성**합니다.

## 현재 상태 (2026-07-07)

| 항목 | 상태 |
| --- | --- |
| **워크스페이스** | `pnpm install` · `pnpm build` 동작. React **19.2.7**, Vite **6.4**, Storybook **10.4** |
| **`@gen-office/gen-datagrid`** | V2 workspace **이관 완료**. Gate 0~8 MVP + Gate 9 handle API ✅. test baseline 17 + interaction 181 |
| **`@gen-office/gen-datagrid-crud`** | V2 workspace **이관 완료**. Gate 10 thin shell · Gate 11 mutation ✅. test 9 |
| **`@gen-office/gen-chart`** | Phase 1 (C0~C7) ✅. demo Chart/Dashboard 연동 ✅ |
| **`@gen-office/gen-frame`** | F0~F5 ✅. demo MDI shell 연동 ✅ |
| **`apps/demo`** | D0~D3 ✅ · **D4 🔄** UserManagement + Actuals `GenDataGridCrud` 연동 |
| **`apps/storybook`** | ui·mdi·gen-chart·gen-frame·gen-datagrid story 통합 |
| **레거시 `gen-grid*`** | V2 workspace **미포함** (의도적 제외) |

정본·Gate 상세: [packages/gen-datagrid/.docs/README.md](./packages/gen-datagrid/.docs/README.md), [packages/gen-datagrid-crud/.docs/README.md](./packages/gen-datagrid-crud/.docs/README.md)

## V2에서 바뀌는 핵심

- **그리드 엔진**: `gen-grid` → `gen-datagrid` (div `role="grid"`, TanStack Table 상태 모델 유지)
- **CRUD 레이어**: `gen-grid-crud` → `gen-datagrid-crud` (신규 설계·이식)
- **차트 엔진**: `gen-chart` V2에서 API·headless 모델부터 재설계 (V1 `GenChart` monolith 이식 안 함)
- **차트 연동**: `gen-grid-chart` → `gen-datagrid-chart` (새 GenChart API 기준)
- **레거시 제거**: `gen-grid`, `gen-grid-crud`, `gen-grid-chart`, V1 `gen-chart` 구현은 V2에 포함하지 않음
- **안정 자산 유지**: `theme`, `ui`, `utils`, `mdi`, demo 인프라(MDI·메뉴·인증)는 V1에서 이식

## 기술 스택

- **버전 핀:** 루트 `package.json`의 `pnpm.overrides`
- **장단점·채택 이유 정본:** [`.docs/11-TECH-STACK.md`](./.docs/11-TECH-STACK.md)

| 항목 | V1 (`frontend`) | V2 (`genoffice-v2`) |
| --- | --- | --- |
| 프레임워크 | React 18 | React **19.2.7** |
| 언어 | TypeScript 5.7 | TypeScript **5.9.3** |
| 빌드 | Vite 6, Turbo | Vite **6.4.3**, Turbo |
| 패키지 관리 | pnpm 9 | pnpm **9.15.0** |
| 테스트 | Vitest (패키지별) | Vitest **4.1.9** |
| 문서화 | Storybook 8 | Storybook **10.4.6** (`apps/storybook`) |
| 런타임 | Node 18+ (V1 기준) | Node **20+** |
| 데이터 그리드 | TanStack Table + table DOM | TanStack Table + Virtual + div renderer |
| 차트 | visx (monolith `GenChart`) | visx + headless composable API (신규 설계) |
| UI | Radix UI | Radix UI (V1에서 이식) |

## 계획된 워크스페이스 구조

```text
genoffice-v2/
  apps/
    demo/              V2 통합 데모 (gen-datagrid 기반 admin 이관 진행)
    storybook/         통합 Storybook

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

  .docs/               V2 설계·로드맵·아키텍처 문서
```

## 패키지 의존 방향

```text
apps → feature packages → ui → theme/utils
```

- `gen-datagrid`는 `ui`, `utils`에만 의존합니다.
- `gen-datagrid-crud`는 `gen-datagrid` 위에 CRUD·Excel·i18n 연동을 제공합니다.
- 앱은 도메인 화면과 라우팅·API 연동만 담당합니다.

## 문서

상세 개요와 설계 방향은 [`.docs/`](./.docs/)를 참고하세요.

| 문서 | 설명 |
| --- | --- |
| [.docs/README.md](./.docs/README.md) | 문서 목차 |
| [.docs/01-OVERVIEW.md](./.docs/01-OVERVIEW.md) | 프로젝트 개요·목표·범위 |
| [.docs/02-ARCHITECTURE.md](./.docs/02-ARCHITECTURE.md) | 아키텍처·패키지 경계 |
| [.docs/03-V1-RELATIONSHIP.md](./.docs/03-V1-RELATIONSHIP.md) | V1(`frontend`)과의 관계·이식 원칙 |
| [.docs/04-ROADMAP.md](./.docs/04-ROADMAP.md) | 단계별 마이그레이션 로드맵 |
| [.docs/05-GEN-CHART.md](./.docs/05-GEN-CHART.md) | GenChart V2 재설계·API·품질 Gate |
| [.docs/06-PACKAGE-REVIEW-PLAN.md](./.docs/06-PACKAGE-REVIEW-PLAN.md) | 패키지별 소스 검토 순서·분담 |

## V1과의 관계

- **V1** [`frontend`](../frontend): 현재 운영·데모 기준. `gen-grid` 기반.
- **V2** `genoffice-v2`: 신규 개발 기준. `gen-datagrid` 기반.
- V2 MVP가 완료되기 전까지 V1은 참조 구현 및 회귀 비교 기준으로 유지합니다.
- V2 출시 후 V1은 기능 freeze를 원칙으로 합니다.

## MVP 완료 기준 (초안)

- [x] `gen-grid` 패키지 없이 워크스페이스에 `gen-datagrid` 존재
- [x] `gen-datagrid` Gate 0~8 MVP + Gate 9 handle API (패키지 test green)
- [x] `gen-datagrid-crud` thin shell + mutation workflow (Gate 10~11)
- [ ] demo: admin/Actuals 등 그리드 화면 V2 연동 (UserManagement·Actuals ✅, 나머지 admin ⏸)
- [ ] demo: 로그인 → MDI → 메뉴 5종 이상 GenDataGrid 화면
- [x] `gen-chart` Chart/Dashboard demo composable API 재현
- [ ] mock·실 backend 연동 smoke (admin CRUD 포함)

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

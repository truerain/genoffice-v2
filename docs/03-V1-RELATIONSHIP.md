# V1(`frontend`)과 V2(`genoffice-v2`)의 관계

## 1. 두 워크스페이스의 역할

| | V1 `frontend` | V2 `genoffice-v2` |
| --- | --- | --- |
| **역할** | 현재 reference·운영 기준 | 차세대 개발 기준 |
| **그리드** | `gen-grid` (table DOM) | `gen-datagrid` (div grid) |
| **차트** | monolith `GenChart` (visx) | headless composable `gen-chart` (신규) |
| **상태** | 구현 완료·데모 동작 중 | 문서·스캐폴딩 단계 |
| **신규 기능** | MVP 완료 후 freeze | MVP 이후 모든 신규 개발 |

V2는 V1을 **대체**하는 것이 목표이며, 장기적으로 두 그리드 스택을 병행 유지하지 않습니다.

## 2. 이식 매트릭스

### 그대로 이식 (변경 최소)

| V1 패키지/영역 | V2 | 비고 |
| --- | --- | --- |
| `packages/theme` | `packages/theme` | 토큰·스타일 |
| `packages/utils` | `packages/utils` | 유틸 |
| `packages/ui` | `packages/ui` | UI 컴포넌트 |
| `packages/mdi` | `packages/mdi` | MDI 레이아웃 |
| `packages/tsconfig` | `packages/tsconfig` | TS 설정 |
| `apps/demo` 인프라 | `apps/demo` | App shell, menu, api, i18n, auth |
| `apps/storybook-all` | `apps/storybook-all` | Storybook 앱 |
| `scripts/` | `scripts/` | 인코딩 체크, 토큰 매핑 등 |
| 루트 설정 | 루트 설정 | `pnpm-workspace`, `turbo`, `package.json` |

### 이식 후 수정

| V1 | V2 | 변경 내용 |
| --- | --- | --- |
| `packages/gen-datagrid` | `packages/gen-datagrid` | Gate 8 완료, V2 core로 승격 |
| `apps/demo` 페이지 | `apps/demo` 페이지 | `GenGrid` → `GenDataGrid`, CRUD config 재작성 |
| `docs/` | `docs/` | V2 기준으로 재작성 (본 문서군) |

### 신규 작성

| V2 패키지 | V1 대응 | 설명 |
| --- | --- | --- |
| `gen-datagrid-crud` | `gen-grid-crud` | GenDataGrid API 기준 재설계 |
| `gen-chart` | V1 `gen-chart` | headless composable API로 **처음부터 재작성**. V1 `GenChart.tsx` 이식 안 함 |
| `gen-datagrid-chart` | `gen-grid-chart` | 새 gen-chart API 기준 range chart 연동 |

### V2에 포함하지 않음

| V1 패키지 | 이유 |
| --- | --- |
| `gen-grid` | `gen-datagrid`로 대체 |
| `gen-grid-crud` | `gen-datagrid-crud`로 대체 |
| `gen-grid-chart` | `gen-datagrid-chart`로 대체 |
| V1 `packages/gen-chart` | monolith 구현·API 부채. V2에서 코드 이식하지 않음. demo 시나리오만 참고 |

## 3. API 호환 정책

### breaking change를 허용하는 영역

- 그리드 public props·imperative handle
- column meta 타입 (`GenGridColumnMeta` → `GenDataGridColumnMeta`)
- CRUD config·helper 시그니처
- 차트 public API (`GenChart` monolith → `CartesianChart` + series)

### 호환을 유지하려는 영역

- `ui` 컴포넌트 API
- `mdi` store·컴포넌트 API
- backend REST API·인증 흐름
- demo 메뉴·componentName 등록 패턴 (이름은 유지, 구현만 교체)

`gen-chart`는 V1과 **호환을 유지하지 않습니다.** V1 `GenChart`의 `kind` discriminated union props는 V2에서 사용하지 않습니다.

### 호환 레이어

V2에서는 **`gen-grid` → `gen-datagrid` adapter를 만들지 않습니다.**  
V1 **`GenChart` → V2 chart adapter도 만들지 않습니다.**  
마이그레이션은 demo·문서·타입 수준에서 V2 API로 직접 전환합니다.

## 4. 코드 이식 원칙

### 1) 복제 후 정리

1. `frontend/`를 `genoffice-v2/`로 복제
2. `gen-grid`, `gen-grid-crud`, `gen-grid-chart` 디렉터리 삭제
3. V1 `packages/gen-chart`는 **이식하지 않음** — 빈 scaffold + V2 types/docs만 생성
4. `package.json` 의존·스크립트·필터에서 레거시 참조 제거
4. `pnpm install && pnpm build`로 깨진 참조 수정

### 2) 문서 우선 동기화

구현 변경 시 V2 `docs/`와 패키지 README를 함께 갱신합니다. V1 문서를 무분별하게 복사하지 않습니다.

### 3) 테스트로 회귀 방지

- `gen-datagrid` interaction test·baseline test 이식
- demo 핵심 화면별 smoke test 추가 (이후 Playwright 검토)

### 4) 한 번에 한 Phase

[04-ROADMAP.md](./04-ROADMAP.md)의 Phase 순서를 지켜, 그리드 Gate 8 · 차트 C1~C4(병렬) → CRUD → demo 포팅 순으로 진행합니다.

## 5. demo 화면 이식 우선순위

V1 demo에서 V2로 옮길 화면 우선순위입니다.

| 순위 | 화면 | V1 그리드 사용 | V2 작업 |
| --- | --- | --- | --- |
| 1 | UserManagement | GenGridCrud | CRUD 패턴 reference |
| 2 | MenuManagement | GenGridCrud | 계층·트리 연동 |
| 3 | ActualsPage | GenGrid + chart | gen-datagrid-chart |
| 4 | LkupManagement | GenGridCrud | lookup·modal editor |
| 5 | RoleManagement | GenGridCrud | |
| 6 | NoticeManagement | GenGridCrud | |
| 7 | MessageManagement | GenGridCrud | |
| 8 | UserRoleManagement | GenGridCrud | |
| 9 | demo/chart, demo/dashboard | V1 `GenChart` | V2 composable API로 재작성 |
| 10 | demo/* 그리드 시연 | GenGrid | Storybook·demo 정리 |

## 6. 백엔드

[`backend`](../../backend)는 별도 git 저장소입니다. V2 프론트는 동일 API base URL·인증 방식을 사용합니다.

변경이 필요 없는 것으로 예상되는 영역:

- `/api/auth/*` 세션·CSRF
- `/api/app-menu` 메뉴
- admin CRUD REST
- i18n 메시지 API
- 파일 업로드/다운로드

## 7. V1 freeze 정책 (권장)

V2 MVP 달성 시점 이후:

- V1 `frontend`에 신규 기능·화면 추가 중단
- V1 버그는 critical만 수정
- 문서·AGENTS.md에 "신규 개발은 genoffice-v2" 명시

MVP 이전에는 V1을 **회귀 비교·동작 참조** 용도로 유지합니다.

## 8. 자주 묻는 질문

### Q. 패키지 스코프를 `@genoffice-v2/*`로 바꿔야 하나?

내부 monorepo만 사용한다면 `@gen-office/*` 유지가 단순합니다. npm 배포·V1/V2 장기 병행이 필요하면 스코프 분리를 검토합니다.

### Q. React 19는 V2 Day-1에 넣나?

권장하지 않습니다. 그리드 엔진 교체만으로 작업량이 크므로, React 19는 MVP 이후 Phase로 미룹니다.

### Q. `gen-datagrid` 문서는 어디에 두나?

구현 초기에는 V1 [`gen-datagrid/docs/`](../../frontend/packages/gen-datagrid/docs/)를 source of truth로 두고, V2 이식 후 `packages/gen-datagrid/docs/`로 옮깁니다. V2 `docs/`는 리포지토리 수준 개요만 담습니다.

## 9. 관련 문서

- [01-OVERVIEW.md](./01-OVERVIEW.md)
- [02-ARCHITECTURE.md](./02-ARCHITECTURE.md)
- [04-ROADMAP.md](./04-ROADMAP.md)
- [05-GEN-CHART.md](./05-GEN-CHART.md)

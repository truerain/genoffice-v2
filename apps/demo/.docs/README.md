

# @gen-office/demo 문서

V2 **reference 백오피스 앱**입니다. 패키지를 조합해 실제 운영에 가까운 shell·메뉴·MDI·도메인 화면을 제공합니다.

## 문서 목록


| 문서 | 내용 |
| --- | --- |
| [architecture/architecture.md](./architecture/architecture.md) | 레이어, 디렉터리, 데이터 흐름, 패키지 의존, 레이아웃 계약 |
| [architecture/multi-app-frame.md](./architecture/multi-app-frame.md) | App Profile, MDI/single·layout 조합, multi-persona 파일 배치 (M0~M4) |
| [plan/plan.md](./plan/plan.md) | 구현 Phase D0~D5, componentRegistry 개선, Gate, V1 이식 범위 |
| [guide/ui-direction.md](./guide/ui-direction.md) | Soft Modern demo 토큰, chrome / workarea 계층 |
| [guide/data-integration.md](./guide/data-integration.md) | 화면 데이터 연동 표준 — TanStack Query · MSW · 요청/응답 타입 · CommitPayload |
| [guide/page-conventions.md](./guide/page-conventions.md) | 화면 소스·스타일 컨벤션 — 파일 구성/네이밍, 훅 분리, 함수 정렬·주석, CSS 규칙 |
| [logs/implementation-log.md](./logs/implementation-log.md) | 구현·설계 변경 로그 (역시간순, 한국어) |




## 상위 문서

- [.docs/02-ARCHITECTURE.md](../../../.docs/02-ARCHITECTURE.md) — monorepo 앱 레이어
- [.docs/03-V1-RELATIONSHIP.md](../../../.docs/03-V1-RELATIONSHIP.md) — V1 demo 이식 매트릭스
- [.docs/04-ROADMAP.md](../../../.docs/04-ROADMAP.md) — Phase 3·4 (demo)
- [.docs/06-PACKAGE-REVIEW-PLAN.md](../../../.docs/06-PACKAGE-REVIEW-PLAN.md) — 패키지 검토 순서 §9



## V1 참조 (경로·동작 기준, blind copy 금지)


| 자료          | V1 경로 (`frontend` 워크스페이스)                       | V2 용도                     |
| ----------- | ----------------------------------------------- | ------------------------- |
| App shell   | `apps/demo/src/app/`                            | MDI·로그인·레이아웃              |
| 메뉴·registry | `app/menu/`, `app/config/componentRegistry*.ts` | componentName → lazy page |
| API         | `shared/api/`                                   | auth, CSRF, HTTP client   |
| Admin 페이지   | `pages/admin/`                                  | CRUD 화면 (grid API 교체)     |
| Demo 페이지    | `pages/demo/`                                   | chart, dashboard, 컴포넌트 시연 |
| i18n        | `i18n/`                                         | 다국어 키·로더                  |


**금지:** `gen-grid`, `gen-grid-crud`, `gen-grid-chart`, V1 `GenChart` import.

## 현재 상태 (2026-06-28)

- `apps/demo` 디렉터리 생성됨 — **Gate D0 scaffold 완료** (2026-06-28)
- 선행 패키지: `theme`, `utils`, `ui`, `mdi` ✅ · `gen-chart` Phase 1 ✅
- **미준비:** `gen-datagrid`, `gen-datagrid-crud`, `gen-datagrid-chart`
- **전략:** shell·인프라·비그리드 화면 먼저 (Phase D0~~D3), 그리드 화면은 합류 후 (D4~~D5)


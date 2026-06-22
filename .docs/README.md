# GenOffice V2 문서

GenOffice V2 설계·이식·운영에 관한 문서 모음입니다.

## 읽는 순서

처음 접하는 경우 아래 순서를 권장합니다.

1. [01-OVERVIEW.md](./01-OVERVIEW.md) — V2가 무엇인지, 왜 만드는지
2. [02-ARCHITECTURE.md](./02-ARCHITECTURE.md) — 패키지 구조와 의존 관계
3. [03-V1-RELATIONSHIP.md](./03-V1-RELATIONSHIP.md) — V1에서 무엇을 가져오고 버리는지
4. [04-ROADMAP.md](./04-ROADMAP.md) — 단계별 작업 계획
5. [05-GEN-CHART.md](./05-GEN-CHART.md) — GenChart V2 재설계 (API·headless·gate)
6. [06-PACKAGE-REVIEW-PLAN.md](./06-PACKAGE-REVIEW-PLAN.md) — 패키지별 소스 검토 순서·분담 (theme → ui → …)
7. [07-HANDOFF.md](./07-HANDOFF.md) — 세션 종료/재개용 작업 이어하기 메모

## 문서 목록

| 문서 | 역할 |
| --- | --- |
| [01-OVERVIEW.md](./01-OVERVIEW.md) | 프로젝트 개요, 목표, 범위, MVP 정의 |
| [02-ARCHITECTURE.md](./02-ARCHITECTURE.md) | 모노레포 구조, 패키지 책임, 의존 방향 |
| [03-V1-RELATIONSHIP.md](./03-V1-RELATIONSHIP.md) | V1(`frontend`) 대비 변경·이식·제외 항목 |
| [04-ROADMAP.md](./04-ROADMAP.md) | Phase별 마이그레이션 로드맵과 우선순위 |
| [05-GEN-CHART.md](./05-GEN-CHART.md) | GenChart V2 재설계 — V1 부채, 목표 API, 품질 Gate |
| [06-PACKAGE-REVIEW-PLAN.md](./06-PACKAGE-REVIEW-PLAN.md) | 패키지 소스 검토 순서, 작업 분담, 패키지별 체크리스트 |
| [07-HANDOFF.md](./07-HANDOFF.md) | 작업 중단 후 재개를 위한 handoff 문서 |

## 앞으로 추가될 문서 (예정)

| 문서 | 역할 |
| --- | --- |
| `06-BUILD_GUIDE.md` | 설치, 빌드, 실행, 트러블슈팅 |
| `AGENTS.md` (루트) | AI 코딩 에이전트 공통 규칙 |
| `packages/gen-datagrid-crud/` 설계 문서 | CRUD 레이어 API·이식 범위 |
| `packages/gen-chart/.docs/` | GenChart API reference, chart gates (C0~C8) |
| `packages/gen-datagrid/.docs/` Gate 8 체크리스트 | MVP acceptance 상세 기준 |

## 외부 참조 (V1)

V2 이식·설계 시 자주 참조하는 V1 문서입니다.

| V1 경로 | 내용 |
| --- | --- |
| [`frontend/README.md`](../../frontend/README.md) | V1 프로젝트 소개 |
| [`frontend/AGENTS.md`](../../frontend/AGENTS.md) | V1 AI 코딩 규칙 |
| [`frontend/packages/gen-datagrid/docs/`](../../frontend/packages/gen-datagrid/docs/) | GenDataGrid 설계·Gate 문서 |
| [`frontend/packages/gen-datagrid/docs/reference/api-comparison-with-gen-grid.md`](../../frontend/packages/gen-datagrid/docs/reference/api-comparison-with-gen-grid.md) | gen-grid ↔ gen-datagrid API 비교 |
| [`frontend/docs/gen-chart/api-draft.md`](../../frontend/docs/gen-chart/api-draft.md) | V1 composable API 초안 (V2 설계 참고) |
| [`frontend/docs/gen-chart/visx-rewrite-plan.md`](../../frontend/docs/gen-chart/visx-rewrite-plan.md) | V1 visx 전환·monolith API (참고용, 이식 안 함) |
| [`frontend/docs/01.BUILD_GUIDE.md`](../../frontend/docs/01.BUILD_GUIDE.md) | V1 빌드 가이드 (이식 후 V2용으로 갱신 예정) |

## 문서 위치 (V2)

- **리포지토리 수준**: `.docs/` (본 문서군)
- **패키지 수준**: `packages/<name>/.docs/` (검토 로그, API, 구현 메모)
- V1 `frontend/docs/`, `frontend/packages/*/docs/`는 참조용 외부 경로입니다.

## 문서 작성 규칙

- V2 문서는 **한국어**로 작성합니다.
- 아키텍처·패키지 경계·MVP 범위가 바뀌면 해당 문서와 루트 `README.md`를 함께 갱신합니다.
- 구현이 진행되면 각 패키지의 `packages/<name>/.docs/` 아래에 상세 문서를 추가합니다.
- V1 문서를 복사할 때는 V2 기준으로 내용을 맞추고, 단순 복제로 outdated 정보가 남지 않게 합니다.

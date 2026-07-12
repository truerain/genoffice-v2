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
8. [08-DESIGN-TOKENS-GUIDE.md](./08-DESIGN-TOKENS-GUIDE.md) — **디자이너·퍼블리셔** 디자인 토큰·색상 작업 가이드
9. [09-SOURCE-CONVENTIONS.md](./09-SOURCE-CONVENTIONS.md) — **개발·에이전트** 소스 편집·파일 헤더·인코딩 규칙
10. [11-TECH-STACK.md](./11-TECH-STACK.md) — 채택 기술 스택 목록·장단점·채택 이유

### 역할별 추천

| 역할 | 우선 문서 |
| --- | --- |
| 디자이너·퍼블리셔 | [08-DESIGN-TOKENS-GUIDE.md](./08-DESIGN-TOKENS-GUIDE.md) → [theme architecture](../packages/theme/.docs/architecture.md) |
| 프론트엔드 개발 | 01 → 02 → [11](./11-TECH-STACK.md) → [09](./09-SOURCE-CONVENTIONS.md) → 06 → 패키지 `.docs/` |
| AI·작업 재개 | [07-HANDOFF.md](./07-HANDOFF.md), 루트 `AGENTS.md`, [09-SOURCE-CONVENTIONS.md](./09-SOURCE-CONVENTIONS.md) |

## 아이디어 (미채택 초안)

공식 설계 전 논의·스케치는 [idea/](./idea/)에 둡니다.

| 문서 | 주제 |
| --- | --- |
| [idea/page-frame-composable.md](./idea/page-frame-composable.md) | 앱 화면 composable `PageFrame` / `StandardPageFrame` |

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
| [08-DESIGN-TOKENS-GUIDE.md](./08-DESIGN-TOKENS-GUIDE.md) | 디자이너·퍼블리셔용 디자인 토큰·색상 추가·변경 절차 |
| [09-SOURCE-CONVENTIONS.md](./09-SOURCE-CONVENTIONS.md) | 소스 편집·파일 헤더(`@remark`/`@history`)·UTF-8·인코딩 가드 |
| [10-THEME-TOKEN-MIGRATION-PLAN.md](./10-THEME-TOKEN-MIGRATION-PLAN.md) | theme ↔ 패키지 토큰 이관 계획 |
| [11-TECH-STACK.md](./11-TECH-STACK.md) | 채택 기술 스택 목록, 항목별 장단점·채택 이유 |

## 패키지 `.docs/` (V2 정본)

| 패키지 | 문서 |
| --- | --- |
| `gen-datagrid` | [packages/gen-datagrid/.docs/README.md](../packages/gen-datagrid/.docs/README.md) — Gate 0~9, architecture, QA |
| `gen-datagrid-crud` | [packages/gen-datagrid-crud/.docs/README.md](../packages/gen-datagrid-crud/.docs/README.md) — Gate 10~12, migration |
| `gen-chart` | [packages/gen-chart/.docs/](../packages/gen-chart/.docs/) |
| `gen-frame` | [packages/gen-frame/.docs/](../packages/gen-frame/.docs/) |
| `theme` · `ui` · `mdi` | 각 `packages/<name>/.docs/review-log.md` |

## 앞으로 추가될 문서 (예정)

| 문서 | 역할 |
| --- | --- |
| `06-BUILD_GUIDE.md` | 설치, 빌드, 실행, 트러블슈팅 |
| `packages/gen-datagrid-chart/` 설계 문서 | grid selection → chart 연동 |

## 외부 참조 (V1)

V2 이식·설계 시 자주 참조하는 V1 문서입니다.

| V1 경로 | 내용 |
| --- | --- |
| [`frontend/README.md`](../../frontend/README.md) | V1 프로젝트 소개 |
| [`frontend/AGENTS.md`](../../frontend/AGENTS.md) | V1 AI 코딩 규칙 |
| [`frontend/packages/gen-datagrid/docs/`](../../frontend/packages/gen-datagrid/docs/) | GenDataGrid 설계·Gate 문서 (V1, 이관 전 참조) |
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

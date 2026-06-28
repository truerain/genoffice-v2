<!--
 @file packages/gen-chart/.docs/README.md
 @description Orientation for @gen-office/gen-chart package documentation.

 @created 2026-06-27

 @remark
 - Repository overview: .docs/05-GEN-CHART.md
 - V1 reference (external): frontend/docs/gen-chart, frontend/packages/gen-chart
-->
# @gen-office/gen-chart 문서

V2 **재사용 차트 엔진** 패키지입니다. headless model + composable React + visx internal renderer.

## 문서 목록

| 문서 | 내용 |
| --- | --- |
| [phase.md](./phase.md) | **Phase 1 마감 / Phase 2 backlog** — 패키지 리뷰 상태 |
| [architecture.md](./architecture.md) | 모듈 구조, 상태 모델, Public API, motion 요약, gen-datagrid-chart 연동 |
| [motion.md](./motion.md) | lifecycle / emphasis / selection / visibility motion 계층·Phase 2 백로그 |
| [gates.md](./gates.md) | 품질 Gate C0~C8, C1.5, C6b — 완료 조건·검증 명령 |
| [implementation-log.md](./implementation-log.md) | 구현·설계 변경 이력 |

## 상위 문서

- [`.docs/05-GEN-CHART.md`](../../../.docs/05-GEN-CHART.md) — 저장소 수준 개요·로드맵
- [`.docs/02-ARCHITECTURE.md`](../../../.docs/02-ARCHITECTURE.md) — monorepo 패키지 경계

## V1 참조 (코드 이식 금지)

| 자료 | 경로 (V1 `frontend` 워크스페이스) | 용도 |
| --- | --- | --- |
| API 초안 | `docs/gen-chart/api-draft.md` | composable·warning·motion 타입 참고 |
| visx 계획 | `docs/gen-chart/visx-rewrite-plan.md` | visx 의존 범위·차트 kind 목록 |
| 토큰 초안 | `docs/gen-chart/chart-tokens.md` | ChartTokens 구조 참고 |
| 실제 구현 | `packages/gen-chart/src/GenChart.tsx` | demo 수용 기준·axis 옵션·enter motion CSS 정책 참고 |

V1 `GenChart.tsx` monolith는 **복사 이식하지 않습니다.**

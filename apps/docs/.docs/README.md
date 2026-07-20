<!--
 @file apps/docs/.docs/README.md
 @description Index for the GenOffice public documentation site (`apps/docs`) planning docs.

 @created 2026-07-13

 @remark
 - 공개 Docs 사이트(`apps/docs`) 설계·계획 정본. 내부 Gate/architecture는 루트·패키지 `.docs/`에 둔다.
 - 구현 앱 소스는 `apps/docs/src` (스캐폴드 후). 본 디렉터리는 계획·결정만.
-->
# @gen-office/docs 문서

공개 문서 사이트(`apps/docs`)의 설계·개발 계획입니다.

내부용 Gate·architecture·agent 로그는 루트 [`.docs/`](../../../.docs/README.md) 및 `packages/*/.docs/`에 두고, 이 앱의 `.docs`에는 **공개 Docs 제품**만 다룹니다.

## Plan

| 문서 | 역할 |
| --- | --- |
| [plan/docs-site-plan.md](./plan/docs-site-plan.md) | Docs 사이트 개발 계획 (IA, 스택, Phase, Vercel, 역할 분리) |

## Log

| 문서 | 역할 |
| --- | --- |
| [implementation-log.md](./implementation-log.md) | 구현 이력 |

## 관련 문서

| 문서 | 관계 |
| --- | --- |
| [`.docs/01-OVERVIEW.md`](../../../.docs/01-OVERVIEW.md) | 제품 목표 |
| [`.docs/02-ARCHITECTURE.md`](../../../.docs/02-ARCHITECTURE.md) | 패키지 경계 |
| [apps/demo/.docs/plan/plan.md](../../demo/.docs/plan/plan.md) | 레퍼런스 demo (Docs Patterns에서 링크) |
| [apps/storybook](../../storybook/) | 컴포넌트 카탈로그·시각 검증 (Docs와 역할 분리) |

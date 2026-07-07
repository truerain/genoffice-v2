<!--
 @file .docs/idea/README.md
 @description Index of design ideas not yet adopted into official architecture.

 @created 2026-06-27

 @remark
 - Ideas here are discussion drafts only — not implementation commitments
 - Adopted ideas move to .docs/, packages/*/.docs/, or decisions.md
-->
# 아이디어 문서

**공식 설계가 아닌** 논의·아이디어 초안을 모읍니다. 채택 시 해당 패키지 `.docs/` 또는 `.docs/logs/decisions.md`로 옮기고, 여기 문서에는 상태를 갱신합니다.

| 상태 | 의미 |
| --- | --- |
| `draft` | 아이디어 정리만 됨 |
| `under-review` | 검토·합의 진행 중 |
| `adopted` | 공식 문서로 승격됨 (링크만 유지) |
| `rejected` | 채택하지 않기로 함 |

## 목록

| 문서 | 주제 | 상태 |
| --- | --- | --- |
| [page-frame-composable.md](./page-frame-composable.md) | 앱 화면용 composable slot `PageFrame` / `StandardPageFrame` | `draft` |
| [gen-calendar.md](./gen-calendar.md) | 구글 캘린더 수준 일정 캘린더 feature 패키지 `@gen-office/gen-calendar` | `under-review` |
| [process-diagram.md](./process-diagram.md) | 업무 프로세스 다이어그램 뷰어(자체 구현, 노드 화면 링크 + 실시간 데이터) | `draft` |

## 작성 규칙

- 파일명: `kebab-case.md`
- 상단에 `@file`, `@description`, `@created` 주석
- **채택 전** 구현·패키지 scaffold 착수하지 않음 (명시적 요청 시 예외)
- gen-chart 등 다른 설계와의 관계가 있으면 링크로 연결

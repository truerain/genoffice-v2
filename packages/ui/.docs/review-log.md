<!--
 @file packages/ui/.docs/review-log.md
 @description Package review log for @gen-office/ui (V1 migration closure).

 @created 2026-06-25
-->
# @gen-office/ui 검토 로그

## 2026-06-25 — V1 이관 마감

### 범위

- **core** Wave 1~4 + feedback( Tooltip/Toast/Progress ) + **MaskedInput** (C5a)
- **composed** C1~C9 (AlertDialog … TreeView)
- **제외:** `MasterDetailLayout`, `PopupInput`, V1 `RichTextEditor` → `@gen-office/html-editor` 별도 패키지

### 완료 기준

- [x] `migration-plan.md` Wave 5 composed C1~C9 Gate 완료
- [x] public `src/index.ts` export 정리
- [x] orphan 소스 제거 (`popupInput` — 미추적 잔존 디렉터리)
- [x] `pnpm -C packages/ui test` (149) / `build` — 2026-06-25

### 이후 트랙 (ui 패키지 밖)

| 항목 | 위치 |
| --- | --- |
| RichTextEditor | `@gen-office/html-editor` 설계 |
| GroupedSelect, Slider tooltip, mask 확장 | [deferred.md](./deferred.md) |
| 패키지 리뷰 순서 다음 | `mdi` — [06-PACKAGE-REVIEW-PLAN.md](../../../.docs/06-PACKAGE-REVIEW-PLAN.md) |

### 참고

- Gate 상세: [migration-plan.md](./migration-plan.md), `logs/implementation-log.md`
- composed Gate 문서: `composed/*.md`, `core/*.md`

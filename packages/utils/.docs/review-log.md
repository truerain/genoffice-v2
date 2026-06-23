<!--
 @file packages/utils/.docs/review-log.md
 @description Package review completion log for @gen-office/utils.

 @created 2026-06-23

 @remark
 - Follows .docs/06-PACKAGE-REVIEW-PLAN.md completion criteria
-->
# @gen-office/utils 검토 로그

## 2026-06-23 — 검토 마무리

패키지 검토 **종료**. 다음 패키지: **`ui`** (`.docs/06-PACKAGE-REVIEW-PLAN.md` 순서).

### 최종 상태

- **테스트:** 57 tests pass
- **public API:** `format`, `normalize`, `validation` (+ V1 compat `date.v1`, `normalize.v1`, `cn`)
- **정책:** `cn`은 V1 호환만; V2 신규 코드는 `clsx` 직접 사용 (`decisions.md`)

### 판단 요약

| 영역 | V1 대비 | 결과 |
| --- | --- | --- |
| `cn` | 이식 | V1 호환 유지; V2 신규는 `clsx` 직접 |
| `format/date` | 수정 이식 | `parseDateString` / `formatDateString` 통합, V1 alias → `date.v1.ts` |
| `format/number` | 이식 | `cellToNextUnit` / `calcAxisDivisor` **제외** → `gen-chart` |
| `format/string` | 이식 | 동일 |
| `normalize` | 수정 이식 | `normalizeYesNo` 통일, V1 `normalizeUseYn` → `normalize.v1.ts` |
| `validation` | 이식 | Y/N 공통 helper `validation/yesNo.ts` |

### 완료 기준 체크 (06-PACKAGE-REVIEW-PLAN)

- [x] `pnpm -C packages/utils build` 통과
- [x] `pnpm -C packages/utils test` 통과
- [x] public `src/index.ts` export가 의도와 일치 (deep import 없음)
- [x] 패키지 `.docs/` 검토·구현 로그 기록 (`review-log.md`, `implementation-log.md`)
- [x] 하위 workspace 패키지만 의존 (`clsx` runtime)
- [x] V2 제외 코드 없음 (`gen-grid` chart axis helpers 제외)

### 검토 포인트 (utils)

- [x] public export 목록·도메인 중립성 — React 없음, 포맷·정규화·검증만
- [x] ui·grid 전용 함수 — `cellToNextUnit`/`calcAxisDivisor` 제외 확정
- [x] React 의존 추가 금지 — devDeps 정리 완료

### 후속 (ui 이식 시)

- `format/date.v1.ts`, `normalize/normalize.v1.ts`, `cn/` 제거
- V1 import → `parseDateString` / `normalizeYesNo` / `clsx`

### 검증

```bash
pnpm -C packages/utils test   # unit tests
pnpm -C packages/utils build
```

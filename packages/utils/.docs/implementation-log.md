<!--
 @file packages/utils/.docs/implementation-log.md
 @description Package implementation and review change log for @gen-office/utils.

 @created 2026-06-23
-->
# Utils 구현 로그

## 2026-06-25

### C5a mask 엔진 (`format/mask`)

- `format/mask.ts` — `MaskDefinition`, `resolveMaskDefinition`, `formatDigits`, `createMaskState`, paste/backspace
- `format/maskPresets/date.ts` — `ymdMaskDefinition`, `ymMaskDefinition` (separator `-` / `/` / `.`)
- `format/index.ts` re-export; `test/format-mask.test.ts` 6건 통과

## 2026-06-23

### `cn` vs `clsx` 정책 문서화

- `cn` — V1 호환 유지, V2 신규 코드는 패키지별 `clsx` 직접 사용
- `packages/utils/.docs/README.md`, `src/cn/index.ts` @remark, `.docs/logs/decisions.md` 반영

### 패키지 검토 완료 (P0~P3 일괄 처리)

- `package.json` — React/Storybook/Testing Library devDeps 제거, `dev` script 제거
- `.docs/review-log.md` — 검토 완료 체크리스트
- `README.md` — `.docs` 링크
- `validation/yesNo.ts` — Y/N assert 공통 helper, normalize·validateYesNo 통합
- `normalize/normalize.v1.ts` — `normalizeUseYn` deprecated alias
- 테스트 보강 — date display/time/relative, number percent/fileSize/compact, validation 미커버 API
- `.docs/README.md` — V1→V2 migration 표

### format/date V1 alias 분리 (`date.v1.ts`)

- V1 호환 `@deprecated` 함수 7개를 `format/date.v1.ts`로 이동
- `format/index.ts`에서 re-export, `date.ts`는 V2 API만 유지

### 파일 헤더 `@remark` 규칙·utils 적용

- `AGENTS.md` — `@remark` 섹션 규칙 추가 (export 목록, deprecations, 제약 등)
- `packages/utils/src/**` — 11개 소스 파일 헤더에 `@remark` 반영

### format/date API 통합 (`parseDateString` / `formatDateString`)

- `DateWireFormat`: `'yyyymmdd' | 'yyyymm' | 'ymd'`, `ymd`는 `DateYmdSeparator`(`'-' | '/' | '.'`) 지원
- 화면 표시: `formatDate` → `formatDateDisplay` (`short` | `long` | `full`)
- V1 이름(`parseDate`, `parseApiDate`, `formatApiDate` 등)은 `@deprecated` alias 유지
- `test/format-date.test.ts` — 와이어·구분자·round-trip 테스트 추가

### Vitest 테스트·normalizeYesNo 정리

- `normalizeUseYn` → `normalizeYesNo` 명칭 통일, `normalizeUseYnWithDefault`가 `normalizeYesNo` 호출
- `test/` — cn, format-string/number/date, normalize, validation (**35 tests**)
- `.docs/README.md` — API 표 `normalizeYesNo` 반영

### 패키지 가이드 문서 (`packages/utils/.docs/README.md`)

- 루트 README 대신 패키지별 사용 가이드로 utils API·우선 사용 원칙 정리
- 루트 `README.md` utils 섹션 추가는 취소(원복)

### V1 이식 점검·파일 헤더 정리

- `src/**` 전 모듈에 `@file` / `@description` / `@created` 헤더 추가 (AGENTS.md 규칙)
- `vite.config.ts` — theme 복사본을 utils lib 설정으로 수정 (`GenOfficeUtils`, `clsx` external)
- `vitest.config.ts` — theme 전용 jsdom/setup 제거, `passWithNoTests`
- `parseApiDate` — `YYYYMMDD` 파싱 시 ISO 구분자 누락 버그 수정 (`${year}-${month}-${day}`)
- `normalize/index.ts` — V1 gen-backoffice 헤더·import 경로 정리

### 모듈 구성 (public export)

| 경로 | 역할 |
| --- | --- |
| `cn/` | `cn()` — clsx 래퍼 |
| `format/` | date, number, string (ko-KR Intl) |
| `normalize/` | 폼/API 값 정규화 (Y/N, uppercode, sortOrder) |
| `validation/` | 범용 검증 + `business` throw validators |

<!--
 @file packages/utils/.docs/README.md
 @description Package documentation index and usage guide for @gen-office/utils.

 @created 2026-06-23
-->
# @gen-office/utils 문서

백오피스 monorepo 전역에서 쓰는 **공통 유틸리티** 패키지입니다.  
포맷·검증·폼 정규화는 여기를 **우선** 사용하고, 패키지마다 복사하지 않습니다.

## 다른 패키지에서 사용하기

### 의존성

```json
{
  "dependencies": {
    "@gen-office/utils": "workspace:*"
  }
}
```

### import

```ts
import {
  formatDateDisplay,
  formatDateString,
  parseDateString,
  formatCurrency,
  normalize,
  normalizeYesNo,
  isEmail,
  validateRequired,
} from '@gen-office/utils';
```

className 병합은 **V2 신규 코드에서 `clsx`를 패키지에 직접 의존**해 사용합니다.  
`cn`은 V1 `ui`/`mdi` 이식 호환용으로만 export 되며, 새 코드에서는 `@gen-office/utils`의 `cn`을 쓰지 않습니다.

```json
{
  "dependencies": {
    "clsx": "^2.1.1"
  }
}
```

```ts
import { clsx } from 'clsx';

clsx(styles.root, isActive && styles.active, className);
```

| 하지 말 것 | 대신 |
| --- | --- |
| 패키지마다 날짜 포맷·Y/N 정규화 복사 | `@gen-office/utils` import |
| V2 신규 코드에서 `cn` import | 패키지 `dependencies`에 `clsx` 추가 후 직접 사용 |
| `ui` / `gen-datagrid`에 API 규칙 헬퍼 추가 | 필요 시 `utils`에 추가 후 barrel export |

## 모듈 구성

| 모듈 | 용도 | 대표 API |
| --- | --- | --- |
| `cn` | V1 호환용 clsx wrapper (**신규 코드 사용 안 함**) | `cn(...)` — ui/mdi 이식용 |
| `format/date` | 와이어·화면 날짜 (`yyyymmdd`, `yyyymm`, `ymd`+구분자, ko-KR 표시) | `parseDateString`, `formatDateString`, `formatDateDisplay`, `formatRelativeTime` … |
| `format/number` | ko-KR 숫자·통화·퍼센트·파일 크기 | `formatNumber`, `formatCurrency`, `formatPercent`, `formatNegativeNumber`, `formatDeltaFlag` … |
| `format/string` | 문자열 casing | `capitalize`, `toKebabCase` |
| `normalize` | 폼/API payload 정규화 (백오피스 공통 규약) | `normalize`, `normalizeNullable`, `normalizeUppercode`, `normalizeYesNo`, `normalizeSortOrder` … |
| `validation` | boolean 검증 + throw 기반 필드 검증 | `isEmail`, `isPhone`, `isEmpty`, `validateRequired`, `validateYesNo` … |

로케일 기본값은 **`ko-KR`** 입니다. 날짜·숫자 표시는 패키지 내부에서 `Intl`을 직접 쓰기 전에 `format/*`를 검토하세요.

### 날짜 와이어 포맷

```ts
// API 문자열 ↔ Date
parseDateString('20240315', 'yyyymmdd');
parseDateString('202403', 'yyyymm');
parseDateString('2024-03-15', 'ymd');       // separator 기본 '-'
parseDateString('2024/03/15', 'ymd', '/');

formatDateString(date, 'yyyymmdd');
formatDateString(date, 'ymd', '.');

// 화면 표시 (ko-KR)
formatDateDisplay(date, 'short');
```

`iso` 날짜는 `parseDateString(value, 'ymd', '-')` / `formatDateString(date, 'ymd', '-')` 와 동일합니다.  
V1 이름(`parseApiDate`, `formatDate` 등)은 **`format/date.v1.ts`** 에 `@deprecated` alias로 남아 있으며, `@gen-office/utils` barrel에서 그대로 export 됩니다.

### V1 → V2 migration

| V1 | V2 |
| --- | --- |
| `parseDate` | `parseDateString(value, 'ymd', '-')` |
| `parseApiDate` | `parseDateString(value, 'yyyymmdd')` |
| `formatDate` | `formatDateDisplay` |
| `parseDateString` (V1 alias of parseDate) | **주의:** V2 `parseDateString(value, format)` — 시그니처 변경 |
| `normalizeUseYn` | `normalizeYesNo` (또는 deprecated `normalizeUseYn`) |

V1 compat 파일: `format/date.v1.ts`, `normalize/normalize.v1.ts` — ui 이식 후 제거 예정.

## 패키지 경계

GenOffice V2는 **백오피스 전용** monorepo이므로 `normalize`·`validation/business`의 Y/N·uppercode 규칙도 **공유 백오피스 규약**으로 `utils`에 둡니다.

- **React 없음** — 훅·컴포넌트는 `ui` / feature 패키지로.
- **2곳 이상**에서 쓰일 함수만 `utils`에 추가.
- public export는 `src/index.ts` barrel만 (deep import 금지).

## 빌드·테스트

```bash
pnpm -C packages/utils build
pnpm -C packages/utils test
```

## 관련 문서

| 문서 | 내용 |
| --- | --- |
| [review-log.md](./review-log.md) | 패키지 검토 완료 체크 |
| [logs/implementation-log.md](./logs/implementation-log.md) | 구현·검토 변경 로그 |
| [../../.docs/06-PACKAGE-REVIEW-PLAN.md](../../.docs/06-PACKAGE-REVIEW-PLAN.md) | 패키지 검토 순서 |

<!--
 @file .docs/09-SOURCE-CONVENTIONS.md
 @description Source code editing conventions for GenOffice V2 (encoding, file headers, change records).

 @created 2026-06-28

 @remark
 - 정본: 소스 편집·파일 헤더·인코딩 규칙
 - AGENTS.md는 요약 + 본 문서 링크만 유지
-->
# 소스 코드 관리 규칙

GenOffice V2 저장소에서 **소스·스타일·문서 파일**을 추가·수정할 때 따르는 공통 규칙입니다.

AI 에이전트 진입점: 루트 [`AGENTS.md`](../AGENTS.md) — 요약 후 **본 문서를 정본**으로 참고합니다.

---

## 1. 인코딩·편집 도구

- 모든 텍스트 파일은 **UTF-8** (BOM 없음).
- 텍스트 변경은 **패치 기반** 편집을 우선합니다.
- 한글이 포함된 파일을 **Windows PowerShell** `Get-Content` / `Set-Content`로 읽거나 쓰지 않습니다 (CP949/ANSI로 깨질 수 있음).
- 한글 본문이 길면 `powershell.exe -Command`로 넘기지 말고, Node.js UTF-8 스크립트 또는 패치 도구를 사용합니다.

```js
// UTF-8 안전 예시
const fs = require('fs');
const path = 'path/to/file.md';
const next = fs.readFileSync(path, 'utf8').replace(old, newContent);
fs.writeFileSync(path, next, 'utf8');
```

- 한글 문서·주석 편집 후 **mojibake** 여부를 확인합니다.
- 법적·저작권 헤더는 요청 없이 추가하지 않습니다.
- 주석은 **짧고**, 비자명한 비즈니스·기술 규칙만 남깁니다.

### Pre-commit 인코딩 가드

`scripts/check-encoding.mjs`가 있을 때:

```bash
node scripts/check-encoding.mjs --staged
```

차단 대상:

- UTF-8 BOM
- invalid UTF-8
- replacement character ()
- 한글 mojibake 의심 패턴

한국어 문서·인코딩 이슈가 있던 파일을 수정한 뒤에는 가드를 실행합니다.

---

## 2. 파일 헤더 (주석 가능 형식)

JSON 등 주석을 넣을 수 없는 형식은 **제외**합니다.

### 2.1 필수·권장 태그

| 태그 | 필수 | 용도 |
| --- | --- | --- |
| `@file` | ✅ | 저장소 기준 상대 경로 |
| `@description` | ✅ | **현재** 파일 역할 (한두 문장) |
| `@created` | 권장 | 최초 추가일 (`YYYY-MM-DD`) |
| `@updated` | 선택 | 마지막 **의미 있는** 구조·계약 변경일 |
| `@remark` | ✅ | 현재 계약·export·제약 (빈 섹션 허용) |
| `@history` | 선택 | Gate·아키텍처급 변경 이력 (역시간순, 최대 3~5줄) |

### 2.2 `@remark`

- **모든** 신규 소스 헤더에 포함합니다.
- 내용이 없어도 태그와 빈 줄을 둡니다.
- `@created` 다음에 한 줄 공백 후 배치합니다.
- **현재 상태**를 기술합니다. public export, 기본값, deprecations, cross-file 의존, non-obvious 제약.
- public API·동작 계약이 바뀌면 **덮어씁니다** (과거형 누적 X).

### 2.3 `@updated` / `@history`

| 기록 위치 | 적합한 내용 |
| --- | --- |
| **헤더 `@remark`** | 지금 읽는 사람이 파일만 열어도 알아야 할 **현재** 규칙 |
| **헤더 `@history`** | D0→D1, Gate 완료, breaking rename 등 **큰 변경** (짧게) |
| **`packages/*/ .docs/implementation-log.md`** | 배경, 검증 명령, 영향 파일 |
| **`.docs/logs/work-log.md`** | 저장소 단위 작업 요약 |
| **git** | 모든 커밋·diff |

**헤더에 남길 변경:** export·동작 계약 변경, Gate/구조 전환, git 없이 맥락이 필요한 제약.

**헤더에 남기지 않을 변경:** 버그 수정, 스타일, 내부 리팩터(계약 동일), 테스트만 추가.

`@history` 한 줄 형식:

```text
- YYYY-MM-DD <Gate|이슈>: <한 줄 요약>
```

5줄을 넘기면 오래된 항목은 package `implementation-log`로 옮기고 헤더에서는 제거합니다.

### 2.4 TypeScript / JavaScript

```ts
/**
 * @file packages/ui/src/core/Button/Button.tsx
 * @description Primary button component for GenOffice V2.
 * @created 2026-06-22
 * @updated 2026-06-25
 *
 * @remark
 * - Exports: Button, buttonVariants
 * - Uses theme tokens from @gen-office/theme; no hard-coded colors
 *
 * @history
 * - 2026-06-25 variant API 정리
 */
```

빈 `@remark` 예:

```ts
/**
 * @file apps/demo/src/main.tsx
 * @description React entry for @gen-office/demo.
 * @created 2026-06-28
 *
 * @remark
 *
 */
```

### 2.5 CSS

```css
/**
 * @file packages/theme/src/styles/global.css
 * @description Global CSS variables and base styles.
 * @created 2026-06-22
 *
 * @remark
 * - Loaded once by ThemeProvider
 * - CSS variables are the source of truth for color tokens
 */
```

### 2.6 Markdown (`.docs/` 등)

```md
<!--
 @file packages/gen-chart/.docs/gates.md
 @description Quality gates for @gen-office/gen-chart.

 @created 2026-06-27

 @remark
 - Gate C0~C7: Phase 1 complete
-->
```

---

## 3. 패키지·도메인별 규칙

공통 소스 규칙은 **본 문서**. 아래는 작업 시 함께 읽는 **패키지 정본**입니다.

| 영역 | 문서 |
| --- | --- |
| GenDataGrid | `packages/gen-datagrid/.docs/` — div DOM 계약, Gate |
| GenChart | [05-GEN-CHART.md](./05-GEN-CHART.md), `packages/gen-chart/.docs/` |
| GenDataGrid CRUD·demo grid 레이아웃 | `AGENTS.md` 요약 + 패키지 `.docs/` |
| 디자인 토큰 | [08-DESIGN-TOKENS-GUIDE.md](./08-DESIGN-TOKENS-GUIDE.md) |

### GenDataGrid (요약)

- `data-gen-datagrid-root`, `data-grid-id`, `data-gen-datagrid-cell` DOM 계약 유지
- `<table>` 렌더·V1 `gen-grid` selector·adapter **금지**

### GenChart (요약)

- V1 `GenChart.tsx` monolith **이식 금지**
- headless model + composable React (`ChartRoot`, plot, series slots)

### Demo·CRUD 레이아웃 (요약)

- flex height chain + `min-height: 0`
- CRUD wrapper 기본 grid height 강제 금지
- action bar 단일 줄 우선

---

## 4. 신규 파일 체크리스트

- [ ] `@file`, `@description`, `@remark` (빈 섹션 허용)
- [ ] `@created` (권장)
- [ ] public export·비자명 규칙이 있으면 `@remark`에 명시
- [ ] Gate·구조 변경 시 `@updated` + `@history` (해당 파일만)
- [ ] package `implementation-log.md` 또는 `work-log.md` 갱신
- [ ] 한글 편집 시 encoding guard (해당 시)

---

## 5. 관련 문서

- [AGENTS.md](../AGENTS.md) — 에이전트 워크플로·작업 로그
- [02-ARCHITECTURE.md](./02-ARCHITECTURE.md) — 패키지 경계
- [06-PACKAGE-REVIEW-PLAN.md](./06-PACKAGE-REVIEW-PLAN.md) — 패키지 검토 순서

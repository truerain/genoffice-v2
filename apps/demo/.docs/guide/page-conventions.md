<!--
 @file apps/demo/.docs/guide/page-conventions.md
 @description 화면(page) 소스·스타일 컨벤션 — 파일 구성/네이밍, 데이터 훅 분리, 함수 정렬·주석, CSS 규칙.
 @created 2026-07-08

 @remark
 - apps/demo 업무 화면(pages/**)의 소스·스타일 표준. 레퍼런스: pages/admin/user
 - 데이터 계층 세부(타입/커밋/MSW)는 guide/data-integration.md, 시각 방향은 guide/ui-direction.md 참조
-->
# 화면 소스·스타일 컨벤션

`apps/demo`의 업무 화면이 **동일한 파일 구성·네이밍·정렬·스타일**을 따르도록 정한 표준입니다.
레퍼런스 구현은 `src/pages/admin/user`입니다. 데이터 계약 세부는 [data-integration.md](./data-integration.md)에 있고, 이 문서는 **구조·네이밍·스타일 규칙**에 집중합니다.

## 1. 파일 구성 (flat, 접미사 컨벤션)

폴더 분리(`api/`·`model/`) 없이 접미사로 역할을 구분합니다. `{domain}` 예: `user`.

| 파일 | 역할 |
| --- | --- |
| `{domain}.types.ts` | 응답(`XxxRow`) · 요청(`XxxRequest`) · 조회 파라미터(`XxxListParams`) |
| `{domain}Api.ts` | transport: `xxxKeys` · `fetchXxx` · `commitXxx` (**React 무의존**) |
| `{domain}Query.ts` | 조회(read) 훅: `useXxxQuery(params)` (리소스별 훅 추가 위치) |
| `{domain}Mutation.ts` | 쓰기(CUD) 훅: `useXxxMutations()` + 커밋 매핑(`toXxxRequest`·`buildXxxCommitPayload`) |
| `{domain}Columns.tsx` | 그리드 컬럼 정의 |
| `{domain}Page.tsx` | 화면: 필터바 + `GenDataGridCrud` + 훅 결선 |

### 네이밍 규칙

- **컴포넌트 파일 `{domain}Page.tsx`만 PascalCase**, 나머지 모듈은 camelCase(`userQuery.ts`, `userMutation.ts`).
- 데이터 훅은 **`{domain}Query` / `{domain}Mutation`** 로 조회/쓰기를 분리하는 **고정 컨벤션**(파일명 단수).
- 파일명은 카테고리 단수지만 **훅은 행위별로** 명명: `useUsersQuery`, 향후 `useUserDetailQuery` 등.

## 2. 데이터 훅 분리 (읽기 ↔ 쓰기)

축은 **transport(`{domain}Api`) ↔ hooks(`{domain}Query` / `{domain}Mutation`)** 입니다.

- **api에 훅을 섞지 않습니다.** `{domain}Api`는 `httpClient` 기반 순수 transport로 두어 prefetch·router loader·테스트에서 React 없이 재사용 가능하게 유지합니다.
- **조회가 늘면** `{domain}Query.ts`에 리소스별 훅을 추가합니다(리소스=훅, 각자 캐시). 하나의 `useXxxQuery`에 여러 데이터를 몰지 않습니다.
- **공통코드 등 도메인 중립 데이터**는 이 화면 파일이 아니라 **공유 훅**(예: `shared`의 `useCodeList`)으로 두고 화면은 조합만 합니다.
- `{domain}Mutation.ts`의 `useXxxMutations()`는 페이지 결선을 한 곳에 모읍니다: `newRow` / `validateCommit` / `handleCommit` / `isCommitting`. 페이지는 이 훅만 결선하고 CUD 로직을 갖지 않습니다.

> 근거: 조회 종류 증가는 파일 통합/분리 판단일 뿐, "리소스=훅·독립 캐시" 원칙은 불변. `{domain}Query`가 비대해지면 그때 리소스 단위로 재분리.

## 3. 함수 정렬 · 주석 규칙

- **중요도 순 정렬**: 파일 진입점(페이지가 쓰는 메인 훅/함수)을 **최상단**에, 이후 하위 상세 순으로 배치합니다. (함수 선언은 호이스팅되어 순서 변경이 안전)
- **진입점 표기**: 메인 함수의 JSDoc 첫 줄에 **`[메인]`** 마커를 붙여 "먼저 볼 함수"를 신호합니다.
- **함수별 요약 주석**: 각 함수/훅에 역할을 1~3줄로 설명합니다. 반환값이 여러 개인 훅은 항목별 용도를 한 줄씩 적습니다.
- **주니어 기준**: 주석은 "무엇을/왜"를 쉽게 설명합니다. 코드가 자명한 내용을 반복하지 않습니다.

```ts
/**
 * [메인] UserPage가 사용하는 쓰기(CUD) 훅.
 * - newRow: 그리드 '행 추가' 시 넣을 빈 행
 * - validateCommit: 저장 직전 입력값 검증
 * - handleCommit: 변경분을 서버로 저장
 * - isCommitting: 저장 진행 중 여부(버튼 비활성 등)
 */
export function useUserMutations() { /* ... */ }
```

## 4. 스타일(CSS) 규칙

### 4.1 표준 레이아웃 공유

- 콘텐츠 채움 패턴은 **`shared/styles/standardLayout.module.css`** 로 공유합니다.
  - `.workarea`: 콘텐츠 채움 컬럼(`flex:1; min-height:0; gap:--spacing-md`)
  - `.fill`: 남는 공간을 채우는 자식(그리드 등). 세로 균등 다중 그리드면 여러 개에 적용.
- **역할 분담**: `ui`의 `PageLayout`은 외곽(패딩·갭·헤더·필터), `standardLayout`은 content 안쪽 채움. 중복 정의 금지.
- **페이지 헤더 토글**: demo 환경설정(`PageLayoutChromeProvider`)으로 `PageHeader`를 숨길 수 있다. Filter·content는 유지된다.
- **화면 고유 배치**(비율·가로·스플리터·마스터디테일)는 공유 모듈에 넣지 말고 **그 화면 모듈**에서 정의합니다. `standardLayout`은 "높이 체인 원자"만 담습니다.

### 4.2 CSS import 이름

- 공유 표준 레이아웃은 **항상 `styles`** 로 import → `styles.workarea` · `styles.fill` (모든 페이지에서 의미 동일).
- 화면 전용 모듈이 있으면 **`{page}Style`** 로 구분(예: `actualsPageStyle`)해 이름 충돌을 피합니다.

```ts
import styles from '../../../shared/styles/standardLayout.module.css';
import actualsPageStyle from './ActualsPage.module.css'; // 화면 전용이 있을 때만
```

### 4.3 토큰 우선

- 하드코딩 값 대신 theme 토큰을 씁니다(`gap: var(--spacing-sm)`, `font-size: var(--font-size-sm)` 등).

> 참고: 현재 `gen-datagrid`는 폰트/색 theme 토큰을 소비하지 않고 상속/하드코딩에 의존합니다(셀 폰트는 body 상속으로 16px). 그리드 토큰 배선은 **grid 트랙 과제**로 별도 처리합니다.

## 5. 새 화면 체크리스트

1. `{domain}.types.ts`: `XxxRow` · `XxxRequest`(PK 필수) · `XxxListParams`.
2. `{domain}Api.ts`: `xxxKeys` · `fetchXxx` · `commitXxx`.
3. `{domain}Query.ts`: `useXxxQuery(params)` (읽기 전용).
4. `{domain}Mutation.ts`: `toXxxRequest`·`buildXxxCommitPayload` + `useXxxMutations()`.
5. `{domain}Page.tsx`: `StandardFilterBar` + `GenDataGridCrud` + 훅 결선(`useXxxQuery`·`useXxxMutations`). 공유 CSS는 `styles`로 import.
6. 진입점 함수 상단 배치 + `[메인]` 표기 + 함수별 요약 주석.
7. MSW/등록: `src/mocks/handlers/xxxHandlers.ts` · `src/mocks/data/xxx.ts` · `componentRegistry.dynamic.ts`.

## 참조

- [data-integration.md](./data-integration.md) — 타입/커밋/MSW/쿼리키 세부
- [ui-direction.md](./ui-direction.md) — Soft Modern 시각 방향
- 레퍼런스 구현: `src/pages/admin/user/*`, `src/shared/styles/standardLayout.module.css`

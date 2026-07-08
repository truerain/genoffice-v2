<!--
 @file apps/demo/.docs/guide/data-integration.md
 @description 화면 데이터 연동 표준 — TanStack Query · MSW · 요청/응답 타입 · CommitPayload.
 @created 2026-07-08

 @remark
 - apps/demo CRUD 화면의 데이터 계층 컨벤션(레퍼런스: pages/admin/user)
 - 새 업무 화면은 이 문서의 레이어·규칙·체크리스트를 그대로 따른다
-->
# 데이터 연동 가이드 — TanStack Query · MSW · CommitPayload

`apps/demo`의 모든 CRUD 화면이 **동일한 데이터 계층 패턴**을 쓰도록 정한 표준입니다.
레퍼런스 구현은 `src/pages/admin/user`이며, 새 화면도 같은 파일 구성·규칙·흐름을 따릅니다.

## 1. 데이터 흐름

```text
컴포넌트(Page)
  → react-query 훅(useXxxQuery / useCommitXxxMutation)
    → transport(xxxApi.ts: fetch/commit + query key)
      → httpClient
        → 네트워크 (dev: MSW 핸들러가 가로채 in-memory 처리)
```

- **조회**는 `useQuery`, **쓰기**는 `useMutation`으로 통일합니다.
- dev 환경에서는 실제 서버 대신 **MSW**가 네트워크 레벨에서 응답합니다(`isMswEnabled()`).
- 컴포넌트는 `httpClient`/MSW를 직접 알지 못하고 훅만 사용합니다.

## 2. 파일 구성 (flat 구조)

폴더 분리(`api/`·`model/`) 없이 **접미사 컨벤션**으로 역할을 구분합니다.

| 파일 | 역할 |
| --- | --- |
| `xxx.types.ts` | 응답 타입(`XxxRow`) · 요청 타입(`XxxRequest`) · 조회 파라미터(`XxxListParams`) |
| `xxxApi.ts` | transport: `xxxKeys`(쿼리 키 팩토리) · `fetchXxx(params)` · `commitXxx(payload)` (React 무의존) |
| `xxxQuery.ts` | 조회(read) 훅: `useXxxQuery(params)` (리소스별 훅 추가 위치) |
| `xxxMutation.ts` | 쓰기(CUD) 훅: `useXxxMutations()` + 커밋 매핑(`toXxxRequest` · `buildXxxCommitPayload`) |
| `XxxPage.tsx` | 화면: 필터바 + `GenDataGridCrud` + 훅 결선 |
| `xxxColumns.tsx` | 컬럼 정의 |
| `src/mocks/handlers/xxxHandlers.ts` | MSW: GET(필터) · POST commit(분기) |
| `src/mocks/data/xxx.ts` | MSW 시드 데이터 |

- 데이터 훅은 **`{domain}Query` / `{domain}Mutation`** 로 조회/쓰기를 분리하는 고정 컨벤션입니다(파일명은 단수).
- 컴포넌트 파일 `{domain}Page`만 PascalCase(`UserPage.tsx`), 나머지 모듈은 camelCase(`userQuery.ts`, `userMutation.ts`).
- 파일명은 카테고리 단수지만 훅은 행위별로 명명합니다(`useUsersQuery`, 향후 `useUserDetailQuery` 등).

## 3. 요청/응답 타입 분리

응답과 요청은 필드 집합·optional 규칙·보안 성격이 다르므로 분리합니다.

- **응답(`XxxRow`)**: 서버가 채우는 전체 필드(대리키 `xxxId`, 파생·조인 필드 `titleName` 등 포함).
- **요청(`XxxRequest`)**: 클라이언트가 쓰기 가능한 필드만. 서버 생성/파생 필드는 제외(오버포스팅 방지).
- 완전 복제(V1 `User2`식) 금지 — **응답에서 파생**해 단일 원천을 유지합니다.

```ts
// 파생 예: 응답에서 파생 컬럼만 제외
export type UserRequest = Omit<DemoUserRow, 'titleName' | 'titleNameEng'>;
```

## 4. 키(PK) 정책

- 요청 타입에 **PK를 필수(`userId: string`)로 포함**합니다(수정 대상 식별자이므로 정당한 쓰기 필드).
- **신규(create)** 는 PK가 아직 없으므로 **sentinel 상수 `NEW_ID`** 로 채웁니다. 서버는 `id === NEW_ID`면 채번(INSERT), 아니면 UPDATE/DELETE로 분기합니다.
- 매직 밸류 오남용 방지를 위해 `NEW_ID`는 명시 상수로 정의하고 이 문서/코드에 근거를 남깁니다.
- **복합키**는 요청 타입에 키 컬럼들을 그대로 포함하면 됩니다(별도 surrogate 불필요).

```ts
export const NEW_ID = '' as const;
```

## 5. 커밋 계약 — `CommitPayload`

전 화면 공용 계약을 `src/shared/api/commit.ts`에 둡니다.

```ts
export interface CommitPayload<TRequest> {
  created: TRequest[];
  updated: TRequest[];   // 전체 행(모든 편집 컬럼)
  deleted: TRequest[];   // 서버는 키만 사용
}
```

- **update는 전체 행(full row)** 을 보냅니다(일반적인 `UPDATE SET 전체컬럼 WHERE pk` / ORM save와 정합).
  - 전제: **요청 타입 = 서버가 덮어쓸 편집 컬럼 전체**. 화면이 편집 컬럼 일부만 다루면 누락 컬럼이 초기화될 수 있으니, 그런 화면은 부분 update 방식으로 별도 검토합니다.
  - 주의: 전체 덮어쓰기는 동시편집 시 타인 변경을 덮을 수 있음 → 필요 시 낙관적 락(row version)으로 보완.
  - 그리드 `changeSet.created/updated/deleted`의 각 항목은 **전체 행(`row`)** 을 제공하므로 빌더는 그 값을 그대로 매핑합니다(원본 재구성 불필요). `deleted[i].row`는 생성 직후 삭제 등으로 `undefined`일 수 있어 그 경우는 서버 전송에서 제외합니다.
- 매핑은 `xxxMutation.ts`에 격리하고 페이지 인라인 매핑을 두지 않습니다.

```ts
// shared/api/commit.ts — 화면 무관 빌더(changeSet 항목의 전체 행을 직접 매핑)
export function buildCommitPayload<TRow, TRequest>(
  args: DataGridCrudCommitArgs<TRow>,
  toRequest: (row: TRow) => TRequest,
): CommitPayload<TRequest> {
  const { changeSet } = args;
  return {
    created: changeSet.created.map((row) => toRequest(row)),
    updated: changeSet.updated.map((it) => toRequest(it.row)),
    deleted: changeSet.deleted.flatMap((it) => (it.row ? [toRequest(it.row)] : [])),
  };
}
```

```ts
// xxxMutation.ts — 화면별 매퍼 한 개(요청 필드만 명시 pick, 신규는 sentinel)
function toUserRequest(row: UserRow): UserRequest {
  return {
    userId: row.userId.startsWith(NEW_ROW_ID_PREFIX) ? NEW_ID : row.userId,
    loginId: row.loginId,
    // ... 나머지 편집 필드(titleName* 파생 필드는 제외)
    langCd: row.langCd,
    active: row.active,
  };
}
```

> 신규 행은 그리드 식별을 위해 임시 rowId(`NEW_ROW_ID_PREFIX + timestamp`)를 갖고, 커밋 매핑에서 PK를 `NEW_ID`로 치환합니다.

## 6. 조회 · 필터

- **쿼리 키 팩토리**로 캐시 스코프를 관리합니다.

```ts
export const userKeys = {
  all: () => ['admin', 'users'] as const,
  list: (params: UserListParams) => ['admin', 'users', 'list', params] as const,
};
```

- 파라미터 필터는 `@gen-office/ui`의 **`StandardFilterBar`** + **draft/applied 분리**로 구현합니다.
  - `draftFilters`(입력 중) → 검색 시 `appliedFilters`로 반영 → `queryKey` 변경으로 refetch.
  - 값이 동일하면 `refetch()`로 강제 재조회.
- `fetchXxx(params)`는 querystring으로 서버 필터를 전달합니다.

## 7. 쓰기(CUD) — `xxxMutation.ts`로 집약

- 읽기(`xxxQuery.ts`)와 쓰기(CUD)를 파일로 분리합니다. 쓰기는 **`xxxMutation.ts`** 한 곳에 모읍니다.
- 순수 매핑(`toXxxRequest` / `buildXxxCommitPayload`)과, i18n/뮤테이션에 의존하는 페이지 결선 핸들러(`newRow` / `validateCommit` / `handleCommit`)를 **훅 `useXxxMutations()`** 로 노출합니다.

```ts
// xxxMutation.ts
export function buildUserCommitPayload(args: DataGridCrudCommitArgs<UserRow>): UserCommitPayload {
  return buildCommitPayload(args, toUserRequest);
}

export function useUserMutations() {
  const { t } = useI18n();
  const commit = useCommitUsersMutation(); // invalidateQueries({ queryKey: userKeys.all() })

  const newRow = useCallback((): UserRow => ({ /* 기본 행, 임시 rowId */ }), [t]);
  const validateCommit = useCallback((args) => { /* fieldErrors 규칙 */ }, [t]);
  const handleCommit = useCallback(async (args) => {
    await commit.mutateAsync(buildUserCommitPayload(args));
    return { ok: true };
  }, [commit]);

  return { newRow, validateCommit, handleCommit, isCommitting: commit.isPending };
}
```

- 커밋 성공 시 `invalidateQueries({ queryKey: xxxKeys.all() })`로 목록을 무효화(자동 refetch)합니다.
- `UserCommitPayload = CommitPayload<UserRequest>` 별칭으로 화면별 특수화합니다.
- 페이지는 `const { newRow, validateCommit, handleCommit } = useXxxMutations()`만 결선하고 CUD 로직을 갖지 않습니다.

## 8. MSW 핸들러

- `GET /api/.../xxx`: querystring 필터 반영(대소문자 무시 includes 등).
- `POST /api/.../xxx/commit`: `created`(PK가 `NEW_ID`면 채번) · `updated`(키로 갱신) · `deleted`(키로 제거) 처리 후 최신 목록 반환.
- 서버측 커밋 타입은 client↔mock **디커플링**을 위해 핸들러 로컬로 정의합니다(공유 타입 import 금지).

## 9. 새 화면 추가 체크리스트

1. `xxx.types.ts`: `XxxRow`(응답) · `XxxRequest`(응답 파생, PK 필수) · `XxxListParams`.
2. `xxxApi.ts`: `xxxKeys` · `fetchXxx(params)` · `commitXxx(payload)`.
3. `xxxQuery.ts`: `useXxxQuery(params)` (읽기 전용, 리소스별 훅 추가).
4. `xxxMutation.ts`: 순수 매핑(`toXxxRequest` · `buildXxxCommitPayload`) + `useXxxMutations()`(newRow · validateCommit · handleCommit).
5. `XxxPage.tsx`: `StandardFilterBar`(draft/applied) + `GenDataGridCrud` + 훅 결선(`useXxxQuery` · `useXxxMutations`). 페이지에 CUD 로직 없음.
6. `src/mocks/handlers/xxxHandlers.ts` + `src/mocks/data/xxx.ts` + `handlers/index.ts` 등록.
7. `componentRegistry.dynamic.ts`에 페이지 등록.

## 10. 명시적 비채택 (V1 부채)

- `api/`·`model/` 폴더 과분리, `User2`식 중복 타입, 정의만 하고 안 쓰는 granular 뮤테이션, 페이지에 로직 집중.

## 참조

- 레퍼런스 구현: `src/pages/admin/user/*`, `src/shared/api/commit.ts`, `src/mocks/handlers/userHandlers.ts`
- [architecture/architecture.md](../architecture/architecture.md) — 레이어·데이터 흐름
- 결정 로그: [.docs/logs/decisions.md](../../../../.docs/logs/decisions.md)

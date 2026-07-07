<!--
 @file .docs/idea/gen-calendar.md
 @description Idea draft: Google-Calendar-level event calendar as new feature package @gen-office/gen-calendar.
 @created 2026-07-08

 @remark
 - Status: under-review (채택·구현 미결정)
 - Trigger: 사용자 요청 "구글 Calendar 수준 캘린더 UI"
 - Related: packages/ui core/calendar (DayPicker 날짜 선택기, 역할 분리), gen-chart headless-first 컨벤션
-->
# 아이디어: Gen Calendar (구글 캘린더 수준 일정 캘린더)

**상태:** `under-review` — 검토용 초안. 채택 전 구현 착수하지 않음(명시적 요청 시 예외).

## 1. 배경 / 목표

- 목표: **구글 캘린더 수준**의 일정 캘린더 UI (월/주/일/목록 뷰, 이벤트 블록, 드래그 생성·이동·리사이즈).
- 기존 `packages/ui`의 `core/calendar`는 `@daypicker/react` 기반 **날짜 선택기(date picker)** 로, "일정/이벤트 캘린더"와 목적이 다름 → 이름·역할을 분리해야 함.
- 리포 ethos: datagrid/chart를 외부 monolith가 아닌 **자체 구축**. 캘린더도 동일 방향이 자연스러움.

## 2. 핵심 결정 사항 (초안 기본값 — 검토 대상)

아래는 사용자 질문 스킵으로 채택한 기본값이며, 검토에서 변경 가능.

- **구현 방식**: `date-fns@4` 기반 **자체 구현**. 외부 캘린더 엔진(FullCalendar / react-big-calendar / @schedule-x) 미사용.
  - 장점: 디자인 토큰 완전 통일, 의존성·번들 통제, 리포 컨벤션 일치.
  - 비용/리스크: 겹침 레이아웃·드래그 상호작용 등 **자체 구현 작업량이 큼**. 구글 캘린더 수준 전체는 다(多) Gate 작업.
  - 대안: 라이브러리 래핑(빠름, 그러나 스타일 오버라이드·의존성 통제 부담, 리포 ethos와 거리). 검토 시 재고 가능.
- **구조**: **headless 상태 로직 + composable 렌더** (`gen-chart` headless-first 준용).
- **뷰 범위**: 월(Month) / 주(Week, 시간 그리드) / 일(Day, 시간 그리드) / 목록(Agenda) 전부.
- **배치**: 신규 feature 패키지 **`@gen-office/gen-calendar`**.
  - 근거: AGENTS.md — "무거운 서드파티 엔진/대형 기능 컴포넌트는 `packages/ui`가 아닌 별도 feature 패키지" (TipTap → `@gen-office/html-editor` 예시).
  - 대안: `packages/ui/composed`에 두기(단순 월 뷰 수준일 때만 합리적).

## 3. 패키지 스캐폴딩 (`packages/gen-calendar`)

`packages/gen-chart` / `packages/ui` 설정을 미러링.

- `package.json`: name `@gen-office/gen-calendar`, deps `@gen-office/theme` + `@gen-office/utils` + `date-fns` + `clsx` + `lucide-react`, peer `react`/`react-dom ^19`. `exports`에 `.` 및 `./index.css`.
- `vite.config.ts`: lib es 빌드 + `vite-plugin-dts`, CSS Modules `camelCaseOnly`, external(react/theme/utils/clsx/lucide), `style.css` → `index.css` 리네임.
- `tsconfig.json`: `packages/tsconfig` 확장.
- `src/index.ts`: `import './index.css'` + 배럴 export.

## 4. 데이터 스키마 & headless 로직 (`src/model/`)

### 4.1 두 종류의 스키마 구분 (중요)

렌더링 모델과 도메인 스키마를 분리해 패키지 경계를 지킨다.

- **렌더링 모델** (`gen-calendar`가 소유): 화면을 그리는 데 필요한 최소 표준형. 도메인 중립.
- **도메인/영속 스키마** (앱이 소유): 백엔드 응답, 예약·회의·휴가 등 업무 데이터.

앱은 도메인 데이터를 렌더링 모델로 **매핑(adapter)** 해서 넣는다. 업무 필드는 `meta`에 싣거나 매핑 함수로 변환 → 캘린더 패키지가 특정 업무 도메인에 오염되지 않는다.

### 4.2 스키마 초안 (`CalendarEvent`)

```ts
/** 렌더링 모델: 캘린더가 화면 표시에 필요로 하는 최소 표준형 */
interface CalendarEvent<TMeta = unknown> {
  id: string;
  title: string;
  start: Date;          // 시작 시각
  end: Date;            // 종료 시각 (allDay면 종일 범위)
  allDay?: boolean;     // 종일 이벤트 여부 (기본 false)
  color?: string;       // 상태색 토큰 키 또는 색상값 (예: 'primary' | 'success')
  editable?: boolean;   // 드래그/리사이즈 허용 (기본 true)
  meta?: TMeta;         // 앱 도메인 데이터 확장 슬롯 (오염 방지)
}

type CalendarView = 'month' | 'week' | 'day' | 'agenda';
```

설계 원칙:
- **최소 필수 필드**(`id`/`title`/`start`/`end`) + 선택 필드 + 제네릭 `meta` 확장.
- 시간은 초안에서 **로컬 `Date`** 사용. 타임존/반복은 아래 확장 결정으로 미룬다(과설계 방지).
- `color`는 하드코딩 색상보다 **theme 상태색 토큰 키** 우선.
- **`end` 경계 규칙: 배타적(exclusive)**. `end`는 "끝나는 순간"으로 해석한다(구글 캘린더 API와 동일).
  - 예: 3일짜리 종일 이벤트 → `start=7/8 00:00`, `end=7/11 00:00` (`differenceInDays`가 정확히 3).
  - 산술이 깔끔하고 자정 걸침 처리가 명확해짐. 이 규칙은 타입 주석에 명시한다.

### 멀티데이 이벤트 표현

- 멀티데이 전용 필드는 두지 않는다. `start`/`end`가 서로 다른 날에 걸치면 그 자체로 멀티데이 이벤트다.
- 종일 멀티데이(`allDay: true`, 여러 날)와 자정을 넘기는 시간 이벤트(`allDay` 없이 날짜 경계 초과) 모두 동일 모델로 표현된다.
- 화면 표시는 뷰별로 다르며, headless 로직이 원본 이벤트를 **`EventSegment`(§4.4)** 로 전개해 처리한다.

### 4.3 스키마 크기를 좌우하는 확장 결정 (열린 질문 §10 연결)

- **시간 표현**: `Date`로 충분한가 vs `ISO 문자열 + timeZone`(타임존 정면 대응 시 스키마 확장 큼).
- **반복 일정(recurrence)**: RRULE 도입 시 "원본 규칙 + 전개 인스턴스 + 예외" 3중 모델 필요 → 복잡도 급증.
- **다중 캘린더/리소스**: `calendarId` / `resourceId`로 구분·색상화할지.
- **분류/상태**: `categoryId`, 확정/임시 상태, 읽기전용 등.

→ 1단계는 4.2 최소 모델로 시작하고, 위 항목은 요구 확정 후 확장.

### 4.4 headless 로직

- 날짜 헬퍼: `date-fns`(startOfWeek/endOfWeek/eachDayOfInterval/addDays/differenceInMinutes 등) 래핑, 주 시작 요일(월/일) 옵션.
- **`EventSegment` 전개(멀티데이 처리 핵심)**: 원본 `CalendarEvent` 하나를 뷰의 날짜/주 경계로 잘라 표시용 세그먼트 배열로 변환하는 순수 함수. 사용자는 `CalendarEvent`만 넣고, 세그먼트는 내부 산출물(입력 스키마 아님).

```ts
/** 레이아웃 계산의 출력 — 스키마(입력)가 아니라 렌더링용 파생 데이터 */
interface EventSegment {
  eventId: string;
  start: Date;      // 이 세그먼트의 시작 (날/주 경계로 clamp)
  end: Date;        // 이 세그먼트의 끝 (경계로 clamp)
  isStart: boolean; // 원본 시작 포함 여부 (막대 왼쪽 끝 처리)
  isEnd: boolean;   // 원본 끝 포함 여부 (막대 오른쪽 끝 처리)
  lane?: number;    // 월 뷰 겹침 방지용 행 인덱스
}
```

- 순수 레이아웃 계산(테스트 대상):
  - 월 뷰: 6주 그리드 + 멀티데이 세그먼트를 주 단위 가로 막대로 **lane 배치** + "+N more" overflow.
  - 주 뷰: 종일/멀티데이 → 상단 **all-day 행** 가로 막대; 자정 넘기는 시간 이벤트 → 날짜 컬럼별 세그먼트로 분할.
  - 일 뷰: 그날에 걸치는 세그먼트만 시간축(px/분) 좌표로 + **겹침 이벤트 컬럼 분할**.
  - 목록(Agenda): 걸치는 날마다 반복 표시 vs "7/8–7/10" 범위 한 줄 표시(정책 선택).
- 상태 훅 `useCalendar({ view, date, events })`: 뷰/기준일/네비게이션(prev/next/today)/뷰 전환.

## 5. 렌더 컴포넌트 (`src/components/`)

- `CalendarRoot`(Provider) + `CalendarToolbar`(prev/next/today, 뷰 스위처, 제목).
- `MonthView`, `WeekView`, `DayView`, `AgendaView`.
- `EventBlock`, `TimeGutter`(시간축), `AllDayRow`, `NowIndicator`(현재 시각 라인).
- 스타일: CSS Modules + `packages/theme` CSS 변수만(하드코딩 색상 금지). 이벤트 색상은 상태색 토큰 활용.

## 6. 상호작용 (구글 캘린더 수준 핵심)

- 이벤트 클릭/호버 콜백(`onEventClick`), 빈 슬롯 클릭 생성 콜백(`onSlotClick`).
- 드래그 생성(주/일 시간 드래그), 드래그 이동, 가장자리 리사이즈 → `onEventChange`.
- 접근성/키보드: 그리드 role, 포커스 이동(기본 수준).
- 제어/비제어: `events` 제어 + `onEventChange` 콜백 패턴.

## 7. 데모 연동 (`apps/demo`)

- `CalendarDemoPage` 신규: `PageLayout` + `PageHeader`(`@gen-office/ui`) 래핑, mock 이벤트, 뷰 전환 데모.
- 등록 파이프라인 편집 지점:
  - `apps/demo/src/app/config/componentRegistry.types.ts`: `ComponentName` 유니온에 `CalendarDemoPage` 추가.
  - `componentRegistry.dynamic.ts`: `React.lazy` 등록.
  - `apps/demo/src/app/menu/buildAppMenuFromV1.ts`: `V2_READY_COMPONENTS` Set에 추가.
  - `apps/demo/src/mocks/data/menu.ts`: 메뉴 row `execComponent: 'CalendarDemoPage'`(아이콘 `Calendar`).
  - i18n: `apps/demo/src/i18n/locales/ko.ts` / `en.ts` 메뉴·설명 키.
- `apps/demo/package.json`에 `@gen-office/gen-calendar: workspace:*` 추가.

## 8. 소스/문서 규칙

- 신규 파일 헤더: `@file`/`@description`/`@created`/`@remark` (`.docs/09-SOURCE-CONVENTIONS.md`).
- `packages/gen-calendar/.docs/implementation-log.md`(한국어) + `.docs/logs/work-log.md` 갱신.
- UTF-8, 한글 PowerShell 편집 금지, `node scripts/check-encoding.mjs --staged`.
- 검증: `pnpm -C packages/gen-calendar build` + `exec tsc --noEmit`, `pnpm -C apps/demo build`.

## 9. 제안 Gate 순서 (점진 구현)

1. 패키지 스캐폴딩.
2. 도메인 모델 + date-fns 헬퍼 + 순수 레이아웃 함수 + 단위 테스트.
3. `CalendarRoot`/`Toolbar` + `MonthView`.
4. `WeekView`/`DayView`(타임그리드, 겹침 컬럼, NowIndicator).
5. `AgendaView`.
6. 상호작용(드래그 생성·이동·리사이즈, 접근성 기본).
7. 데모 연동(registry/menu/i18n).
8. 문서/검증(로그, 헤더, 빌드·타입체크·인코딩 가드).

## 10. 열린 질문 (검토 필요)

- **스키마 확장(§4.3)** — 스키마 확정을 위해 우선 결정 필요:
  - 타임존 처리: 로컬 `Date` vs `ISO + timeZone`.
  - 반복 일정(recurrence, RRULE) 포함 여부.
  - 다중 캘린더/리소스(`calendarId`/`resourceId`) 포함 여부.
  - 분류/상태(`categoryId`, 확정·임시, 읽기전용) 필요 여부.
- 자체 구현 vs 라이브러리 래핑 — 작업량/유지보수 트레이드오프 최종 확정.
- 뷰 범위 축소 가능성(예: 월 + 주만 우선).
- 별도 패키지 vs `ui/composed` 최종 결정.

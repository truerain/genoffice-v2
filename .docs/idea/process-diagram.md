<!--
 @file .docs/idea/process-diagram.md
 @description Idea draft: business process diagram viewer with linked screens and real-time node data (self-implemented).
 @created 2026-07-08

 @remark
 - Status: draft (채택·구현 미결정)
 - Trigger: 사용자 아이디어 "프로세스 다이어그램 + 노드 화면 링크 + 노드 실시간 데이터"
 - Decision: 자체 구현 우선 (읽기전용 뷰어 + elkjs 자동배치 + 좌표 저장). GoJS/React Flow/Rete는 대안·참고로만 기록
-->
# 아이디어: Process Diagram (업무 프로세스 다이어그램 뷰어)

**상태:** `draft` — 검토용 초안. 채택 전 구현 착수하지 않음(명시적 요청 시 예외).

## 1. 배경 / 목표

업무 프로세스를 다이어그램으로 보여주고, 각 단계(Node)에서 상세 정보를 제공한다.

- 프로세스 흐름을 노드-엣지 그래프로 시각화(읽기전용 뷰어).
- **노드에서 관련 화면을 링크로 호출**(드릴다운 → MDI 탭 오픈).
- **노드에 해당 단계의 실시간 데이터 표시**(상태/수치 등).

세 요구는 성격이 달라 분리해서 다룬다: (1) 다이어그램 렌더링/레이아웃, (2) 앱 내 화면 네비게이션 연동, (3) 실시간 데이터 바인딩.

## 2. 라이브러리 검토 결과 (자체 구현으로 결정)

| 후보 | 라이선스 | 성격 | 판단 |
| --- | --- | --- | --- |
| GoJS | 상용(유료) | 강력한 canvas 다이어그램 | 아이디어 설명용 언급일 뿐, 미채택. 유료·canvas라 노드 내 React UI 이질적 |
| React Flow (`@xyflow/react`) | MIT (+Pro 구독) | 노드=React 컴포넌트 | 유력했으나 미래 재라이선싱 우려 + 기본 워터마크. 이 범위엔 과함 |
| Rete.js | MIT | 비주얼 프로그래밍/데이터플로우 에디터 | 연결 편집·실행 엔진 중심 → 읽기전용 뷰어엔 오버엔지니어링 |
| elkjs / dagre | EPL-2.0 / MIT | **headless 레이아웃 엔진(렌더 없음)** | 자동 배치 계산에 채택 후보(직접 렌더) |

결정 근거:
- 전문적·다양한 다이어그램이 아니라 **한정된 읽기전용 프로세스 뷰어**라, 다이어그램 프레임워크의 복잡한 기능(연결 드래그·포트·실행 엔진)이 대부분 미사용 영역.
- 리포 ethos(datagrid/chart 자체 구축, 오픈 스택)와 일치, 라이선스·워터마크 리스크 제거.
- 노드가 곧 **React 컴포넌트**여야 화면 링크·실시간 데이터가 자연스러움 → 자체 DOM 노드 렌더가 유리.

## 3. 확정된 범위 (사용자 결정)

- **편집 수준: 읽기전용 뷰어** — 노드/연결을 사용자가 추가·편집하지 않음(데이터로 고정).
- **배치: 자동 배치 + 사용자 조정·저장 병행** — 초기 elkjs/dagre 자동 배치, 이후 노드 드래그 위치를 저장.
  - 규칙: **저장 좌표 우선, 없으면 자동 배치 폴백**(신규 노드 등).

## 4. 아키텍처 초안

얇은 조합: **headless 레이아웃 엔진 + 자체 SVG 엣지 + DOM 노드(React) + 팬/줌/드래그**.

- **레이아웃(headless)**: `elkjs`(엣지 라우팅까지 지원) 또는 `dagre`(간단, 단 미유지보수). 그래프 데이터 → 좌표 계산. 직접 계산하지 않음.
- **엣지 레이어**: SVG `path`(직교 또는 베지어)로 노드 앵커 간 연결선. 초기엔 단순 경로, 필요 시 elkjs 라우팅 결과 활용.
- **노드 레이어**: DOM 오버레이에 **React 컴포넌트**로 렌더(좌표는 transform). 노드 타입별 커스텀 UI.
- **뷰포트**: 배경 드래그 팬 + 휠 줌 → 컨테이너 그룹에 CSS transform. 노드 드래그 시 줌 배율 반영한 좌표 변환.
- **화면 링크**: 데모의 기존 MDI 탭 오픈 파이프라인 재사용(`openPage`/`componentRegistry`/`useOpenPage`). 노드 클릭/버튼 → 대상 화면을 탭으로 오픈. 새 네비게이션 체계 불필요.
- **실시간 데이터**: 노드별 데이터 바인딩. 소스 방식(폴링 vs WebSocket/SSE)·갱신 주기·로딩/에러 표시는 열린 질문(§7).

## 5. 데이터 모델 초안

렌더링 모델(패키지 소유) vs 도메인 스키마(앱 소유)를 분리(캘린더 아이디어와 동일 원칙).

```ts
/** 렌더링 모델: 다이어그램 표시에 필요한 최소 표준형 */
interface ProcessNode<TData = unknown> {
  id: string;
  type?: string;                 // 노드 렌더 타입(단계 종류)
  title: string;
  position?: { x: number; y: number }; // 저장 좌표(없으면 자동 배치)
  linkTarget?: string;           // 클릭 시 열 화면 식별자(componentRegistry 키 등)
  data?: TData;                  // 실시간 데이터/도메인 확장 슬롯
}

interface ProcessEdge {
  id: string;
  source: string;                // ProcessNode.id
  target: string;                // ProcessNode.id
  label?: string;
}

interface ProcessGraph {
  nodes: ProcessNode[];
  edges: ProcessEdge[];
}
```

- 업무 필드는 `data`에 싣거나 매핑 함수로 변환 → 패키지가 특정 도메인에 오염되지 않음.
- 실시간 값은 `data`를 갱신하는 방식으로 노드에 전달(구독은 노드 자체 또는 상위 스냅샷 주입 중 선택).

## 6. 패키지 / 연동 (초안)

- 무거운 기능 컴포넌트이므로 AGENTS.md 권장대로 **별도 feature 패키지**(가칭 `@gen-office/gen-flow` 또는 `@gen-office/process-diagram`). `packages/ui`에 넣지 않음.
- 스캐폴딩은 `packages/gen-chart` 미러링(vite lib es 빌드, dts, CSS Modules, theme 토큰).
- 데모: `ProcessDiagramDemoPage` + registry/menu/i18n 등록(캘린더 아이디어 §7과 동일 파이프라인).

## 7. 열린 질문 (검토 필요)

- **실시간 데이터 소스**: 폴링 vs WebSocket/SSE, 갱신 주기, 로딩/에러/스테일 표시 정책.
- **좌표 저장 위치**: 로컬(사용자별) vs 서버(공유) 저장.
- **레이아웃 엔진**: elkjs(강력·EPL, 비동기) vs dagre(간단·미유지보수). 방향성(수직/수평) 요구.
- **엣지 라우팅 수준**: 단순 베지어로 충분한가 vs 겹침 회피 라우팅 필요.
- **패키지명 확정**: `gen-flow` vs `process-diagram`.
- 향후 편집(노드/연결 생성) 요구 발생 시 React Flow/Rete 재검토 트리거.

## 8. 관련 문서

- [gen-calendar.md](./gen-calendar.md) — 렌더링 모델 vs 도메인 스키마 분리 원칙 공유
- AGENTS.md — 무거운 기능 컴포넌트는 별도 feature 패키지

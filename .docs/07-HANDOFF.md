# 작업 이어하기 메모 (Handoff)

## 1) 지금 상태 한눈에 보기

- 현재 리포지토리: `genoffice-v2`
- 문서 중심으로 초기 방향 정리가 완료된 상태
- 아직 `packages/`, `apps/` 실소스 이식·구현은 본격 시작 전
- `gen-datagrid`는 **다른 agent 트랙**에서 진행 예정
- 본 트랙은 `theme -> utils -> ui -> mdi -> gen-chart -> ...` 순서로 검토/이식

## 2) 이번 세션에서 완료한 것

- V2 기본 문서 작성
  - `README.md`
  - `.docs/01-OVERVIEW.md`
  - `.docs/02-ARCHITECTURE.md`
  - `.docs/03-V1-RELATIONSHIP.md`
  - `.docs/04-ROADMAP.md`
  - `.docs/05-GEN-CHART.md`
  - `.docs/06-PACKAGE-REVIEW-PLAN.md`
- `AGENTS.md`를 V2 기준으로 정리
  - V1 잔재(`gen-grid*`, V1 `GenChart` 이식) 제거
  - 트랙 분담(다른 agent vs 직접 검토) 반영
  - 문서/로그/검증 규칙 최신화

## 3) 다음 세션 시작 순서 (권장)

아래 순서로 시작하면 자연스럽게 이어집니다.

1. `.docs/06-PACKAGE-REVIEW-PLAN.md` 재확인  
2. `frontend/packages/theme` 소스 읽기  
3. `genoffice-v2/packages/theme` 이식/정리 시작  
4. `packages/theme/.docs/review-log.md` 생성 후 판단 기록  
5. `theme` 빌드 확인 후 `utils`로 이동

## 4) 바로 시작할 첫 작업 (theme)

검토 체크리스트:

- `ThemeProvider`, `useTheme` API 유지 여부
- 토큰 구조(CSS 변수 + TS token) 확인
- `index.css`, `global.css` export 경로 확인
- 폰트(`pretendard`) 로딩 방식 확인
- `ui`, `gen-chart`에서 참조 가능한 token 이름 안정화

작업 결과는 아래 형식으로 기록:

- 이식
- 수정 이식
- 재작성
- 제외
- 보류

## 5) 유의사항 (실수 방지)

- V2에 `gen-grid`, `gen-grid-crud`, `gen-grid-chart` 복원 금지
- V1 `packages/gen-chart/src/GenChart.tsx` 복사 이식 금지
- `gen-datagrid` 코어 구현은 다른 agent 트랙이므로 충돌 작업 피하기
- 문서 변경 시 `README.md`와 `.docs/README.md` 링크 동기화
- 한글 문서 편집 시 UTF-8 유지

## 6) 다음 세션용 프롬프트 템플릿

아래 문장을 복붙해서 시작하면 문맥이 빠르게 이어집니다.

```text
genoffice-v2 작업 이어가자.
07-HANDOFF.md 기준으로 theme 패키지부터 시작하고,
frontend/packages/theme를 참고해서 V2로 이식/수정해줘.
변경할 때마다 review-log도 같이 남겨줘.
```

## 7) 완료 정의 (현재 단계 기준)

`theme` 단계 완료 기준:

- `packages/theme` 코드 이식/정리 완료
- public export 경로 검증 완료
- 빌드 통과
- `packages/theme/.docs/review-log.md` 기록 완료

완료 후 `utils`로 같은 흐름 반복.


<!--
 @file packages/theme/.docs/README.md
 @description Package documentation index for @gen-office/theme.

 @created 2026-06-22
-->
# @gen-office/theme 문서

`@gen-office/theme` 패키지의 설계·구조·토큰 참조 문서입니다.

## 읽는 순서

| 문서 | 내용 |
| --- | --- |
| [architecture.md](./architecture.md) | **패키지 구조**, hex 토큰 정책, CSS 3층, React·빌드·연동 (Mermaid) |
| [ref/token-sources-and-decisions.md](./ref/token-sources-and-decisions.md) | 색상 정책 배경·FAQ·**2026-06-23 확정 결정** |
| [ref/token-mapping.md](./ref/token-mapping.md) | 컴포넌트 토큰 ↔ 소스·사용처 매핑표 |
| [logs/implementation-log.md](./logs/implementation-log.md) | 구현·검토 변경 로그 |

## 빠른 참조

```ts
import { ThemeProvider, useTheme } from '@gen-office/theme';
import '@gen-office/theme/index.css';
```

```text
앱 → ThemeProvider → document[data-theme] → CSS 변수
                  → useTheme() → Theme 객체 (computed style)
```

상세 다이어그램은 [architecture.md](./architecture.md)를 참고하세요.

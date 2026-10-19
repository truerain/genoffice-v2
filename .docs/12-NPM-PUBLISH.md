<!--
 @file .docs/12-NPM-PUBLISH.md
 @description npmjs에 @gen-office/* 라이브러리 패키지를 배포하고 다른 저장소에서 설치하는 절차.

 @created 2026-10-13

 @remark
 - 정본: packages/* 공개 배포 절차
 - 앱(demo, docs, storybook)과 루트 패키지는 배포하지 않음
-->
# npmjs 배포

`packages/*` 라이브러리를 npmjs에 올려, 다른 저장소의 앱이 `@gen-office/*`를 버전으로 설치하게 합니다. 소스 저장소는 이 모노레포를 유지합니다.

다른 프로젝트의 `pnpm-workspace.yaml`에 이 폴더를 넣거나, `file:`로 패키지 디렉터리를 가리키는 방식은 쓰지 않습니다. 소스의 `@gen-office/*` 의존성은 `workspace:*`이며, 이 프로토콜은 이 저장소 안에서만 해석됩니다.

## 배포 대상

| 패키지 | 배포 |
| --- | --- |
| `@gen-office/theme` | 배포 |
| `@gen-office/utils` | 배포 |
| `@gen-office/debug` | 배포 |
| `@gen-office/ui` | 배포 |
| `@gen-office/gen-chart` | 배포 |
| `@gen-office/gen-datagrid` | 배포 |
| `@gen-office/mdi` | 배포 |
| `@gen-office/gen-datagrid-crud` | 배포 |
| `@gen-office/gen-frame` | 배포 |
| 루트 `gen-office`, `apps/demo`, `apps/docs`, `apps/storybook` | `"private": true`. 배포하지 않음 |

첫 배포 버전은 `0.2.0`입니다. 이후에는 패키지마다 버전을 올립니다.

## 소스에 유지할 것

라이브러리 `package.json`의 `@gen-office/*` 의존성은 `workspace:*`로 둡니다. `pnpm publish`가 tarball 안의 `package.json`만 그 패키지의 현재 버전으로 바꿉니다. 예: `ui`가 `theme` `0.2.0`에 의존하면 배포본에는 `"@gen-office/theme": "0.2.0"`이 들어갑니다.

앱의 `workspace:*`도 그대로 둡니다.

Radix, `clsx`, `lucide-react` 같은 외부 의존성과 `react` / `react-dom` peer는 배포 시 수정하지 않습니다.

`0.2.0` 배포본에 기록되는 내부 의존성:

| 패키지 | 배포본의 `@gen-office` 의존성 |
| --- | --- |
| `theme`, `utils`, `debug` | 없음 |
| `ui` | `theme`, `utils` |
| `gen-chart` | `theme` |
| `gen-datagrid` | `theme`, `ui`, `utils` |
| `mdi` | `theme`, `ui` |
| `gen-datagrid-crud` | `gen-datagrid`, `ui` |
| `gen-frame` | `dependencies`의 `mdi`, `theme`, `ui`. `peerDependencies`의 `mdi` |

`gen-frame`의 `mdi` peer는 optional입니다.

## npmjs 조건

- 조직 이름이 `gen-office`인 npm 조직이 있어야 `@gen-office` 스코프로 배포할 수 있습니다. 배포 계정은 그 조직의 멤버여야 합니다.
- 공개 스코프 패키지는 무료입니다. 비공개 패키지는 유료 플랜이 필요합니다.
- 스코프 패키지 기본 공개 범위는 비공개입니다. 공개 배포에는 `--access public`을 붙입니다.
- 직접 배포에는 계정 2FA, 또는 2FA를 우회하는 granular access token이 필요합니다.
- 한 번 올린 `패키지이름@version`은 덮어쓸 수 없습니다.

참고: [조직 스코프](https://docs.npmjs.com/about-organization-scopes-and-packages/), [스코프 공개 패키지](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/).

## 첫 배포

워크스페이스 루트에서 실행합니다.

1. 락파일을 맞춥니다.

```powershell
pnpm install
```

2. `dist`를 만듭니다. 각 패키지의 `files`는 `dist`만 포함하므로, 빌드 없이 배포하면 빈 패키지가 됩니다. `prepublishOnly`는 없습니다.

```powershell
pnpm build
```

3. 레지스트리에 올리지 않고, 의존성이 버전으로 바뀌었는지 확인합니다.

```powershell
pnpm --dir packages/ui pack --pack-destination $env:TEMP\gen-office-pack
tar -xOf "$env:TEMP\gen-office-pack\gen-office-ui-0.2.0.tgz" package/package.json
```

pnpm 9.15에서 `pnpm --filter … pack`은 `Unknown option: recursive`로 실패합니다. 패키지 디렉터리에서 `pnpm pack`을 실행합니다.

`dependencies`에 `"@gen-office/theme": "0.2.0"`, `"@gen-office/utils": "0.2.0"`이 있으면 됩니다. 워크스페이스의 `package.json`은 `workspace:*`인 채로 남습니다.

4. 전체 패키지를 미리 봅니다. `private`인 앱은 제외됩니다.

```powershell
pnpm -r --filter "./packages/*" publish --access public --dry-run --no-git-checks
```

5. 로그인과 조직 소속을 확인한 뒤 배포합니다. 실제 배포는 git 작업 트리가 깨끗해야 합니다. `--no-git-checks`는 dry-run에만 씁니다.

```powershell
npm whoami
pnpm -r --filter "./packages/*" publish --access public
```

pnpm은 내부 의존이 없는 `theme`, `utils`, `debug`를 먼저 올리고, 이어서 `ui`, `gen-chart`, `gen-datagrid`, `mdi`, `gen-datagrid-crud`, `gen-frame` 순으로 올립니다. `npm publish`는 `workspace:*`를 거부합니다. 배포는 `pnpm publish`로 합니다.

## 다른 저장소에서 설치

대상 앱은 React 19(`react`, `react-dom` 모두 `^19.0.0`, 즉 19.0.0 이상 20 미만)와 ESM 빌드여야 합니다. 두 패키지 버전은 같아야 합니다. 이 저장소에서 빌드·확인한 버전은 `19.2.7`입니다.

화면이 쓰는 패키지만 설치합니다. 예:

```powershell
pnpm add @gen-office/gen-datagrid-crud@0.2.0
```

`dependencies`에 적힌 패키지는 함께 설치됩니다. `gen-datagrid-crud`는 `gen-datagrid`와 `ui`를, `ui`는 `theme`와 `utils`를 가져옵니다. `gen-chart`, `gen-frame`, `mdi`, `debug`는 `gen-datagrid`의 의존성이 아니므로 그리드만 설치할 때 따라오지 않습니다.

CSS는 설치만으로 적용되지 않습니다. 앱에서 직접 불러옵니다.

```tsx
import { GenDataGridCrud } from '@gen-office/gen-datagrid-crud';
import { PageHeader, PageLayout } from '@gen-office/ui';

import '@gen-office/theme/index.css';
import '@gen-office/ui/index.css';
import '@gen-office/gen-datagrid-crud/index.css';
```

사용하는 패키지의 CSS만 불러오면 됩니다. MDI·프레임·차트를 쓰면 각각 `@gen-office/mdi/index.css`, `@gen-office/gen-frame/index.css`, `@gen-office/gen-chart/index.css`를 추가합니다.

## 이후 배포

수정본을 올릴 때마다 새 버전이 필요합니다. 아직 배포하지 않은 로컬 수정은 버전을 올리지 않습니다.

- 버그 수정: 패치 (`0.2.1`)
- 기능 추가: 마이너 (`0.3.0`)
- 호환이 깨지는 변경: 메이저 (`1.0.0`). `0.x`에서는 마이너도 호환을 깨뜨릴 수 있으므로, 깨지는 변경은 릴리스 노트에 적습니다.

바뀐 패키지만 버전을 올립니다. `workspace:*`는 배포본에서 정확한 버전으로 고정됩니다. `utils`만 `0.2.1`로 올리면, 이미 배포된 `gen-datagrid@0.2.0`은 계속 `utils@0.2.0`을 설치합니다. 상위 패키지 사용자에게 그 수정을 전달하려면 상위 패키지 버전도 올려 다시 배포합니다.

새 버전을 배포해도 이전 버전은 deprecate되지 않습니다. `latest` 태그만 새 버전으로 이동합니다. 버전 없이 설치하면 새 버전이 설치되고, `@0.2.0`처럼 고정한 의존성은 그 버전에 남습니다.

특정 버전에 경고만 붙이려면 배포와 별도로 지정합니다. 패키지는 삭제되지 않습니다.

```powershell
npm deprecate @gen-office/ui@0.2.0 "0.2.1을 사용하세요"
```

## React 20

peer는 `react`, `react-dom` 모두 `^19.0.0`으로 유지합니다. React는 번들에 포함되지 않으므로 React 20용 산출물을 따로 만들 필요는 없습니다.

React 20으로 이 패키지들을 테스트해 동작이 확인된 뒤에만 peer를 `^19.0.0 || ^20.0.0`으로 넓히고, 새 버전으로 배포합니다. 그 변경은 `react`와 `react-dom`을 함께, peer를 선언한 패키지 전부에 적용합니다. 범위를 미리 넓히면 React 20 앱에 경고 없이 설치됩니다.

루트 `pnpm.overrides`와 각 패키지 devDependency는 `19.2.7`에 고정되어 있습니다. React 20 테스트 전에는 이 고정을 풀지 않습니다.

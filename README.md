# release-notification-action

## Usage

1. 메시지 전달을 위해 **SLACK_WEBHOOK_URL** 이름의 secret을 설정하세요.
    - Repository Settings > Secrets > New repository secret

2. `.github/workflows/release-notification-action.yml` 파일을 생성하고, 아래 [Example](#example)처럼 작성하세요.

## Inputs

| 값                      | 설명                                                                                                       | 필수여부 |
|------------------------|----------------------------------------------------------------------------------------------------------|------|
| `token`                | GitHub에서 제공하는 토큰.                                                                                        | O    |
| `extractionStartPoint` | 본문을 추출할 시작 지점. 해당 지점부터 최하단까지 정보를 긁어옵니다. (예: `'## == 릴리즈 내용 시작 =='`)                                      | O    |
| `extractionEndPoint`   | 본문을 추출할 종료 지점. 해당 기점까지만 추출됩니다. (예: `'## == 릴리즈 내용 종료 =='`). 값이 없으면 `extractionStartPoint` 기점으로 모든 값을 추출. | X    |
| `slackWebhookURL`      | Slack 메시지 전송을 위한 웹훅 URL.                                                                                 | O    |
| `projectConfig`        | 배포 알림 설정을 위한 JSON 배열 형식의 프로젝트 설정.                                                                        | O    |

## Example

```yml
name: release-notification-action

on:
  [ deployment_status ]

jobs:
  release-notification-action:
    runs-on: ubuntu-latest
    steps:
      - name: release-notification-action
        uses: jiro-developers/release-notification-action@latest
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          extractionStartPoint: '## == 릴리즈 내용 시작 =='
          extractionEndPoint: '## == 릴리즈 내용 종료 =='
          slackWebHookURL: ${{ secrets.SLACK_WEBHOOK_URL }}
          projectConfig: >
            [
              {
                "projectName": "mystery project - PROD",  # 프로젝트 이름
                "stage": "production",       # 배포 환경
                "triggerBranch": "master",   # 배포를 트리거할 브랜치 (master 브랜치)
                "triggerFilePath": "{apps/*,pnpm-lock.yaml}",  # 변경을 감지할 파일 경로
                "successReleaseTitle": "프로젝트 PROD 클라이언트가 업데이트됐습니다.",  # 배포 성공 메시지
                "failedReleaseTitle": "프로젝트 PROD 클라이언트가 배포에 실패했습니다."   # 배포 실패 메시지
              },
              {
                "projectName": "mystery project - DEV",
                "stage": "development",     
                "triggerBranch": "dev",
                "triggerFilePath": "**",    
                "successReleaseTitle": "프로젝트 DEV 클라이언트가 업데이트됐습니다.", 
                "failedReleaseTitle": "프로젝트 DEV 클라이언트가 배포에 실패했습니다."
              }
            ]
```

## projectConfig Fields

| 필드명                   | 설명                                                           | 필수여부 | glob 패턴 |
|-----------------------|--------------------------------------------------------------|------|---------|
| `projectName`         | 배포할 프로젝트의 이름을 설정합니다. 예: `mystery project`                    | X    | -       |
| `stage`               | 배포할 환경을 설정합니다. 예: `production` / `development`               | O    | O       |
| `triggerBranch`       | 배포를 트리거할 브랜치를 설정합니다.                                         | O    | O       |
| `triggerFilePath`     | 배포를 트리거할 파일 경로를 설정합니다. 예: `apps/example/*`, `pnpm-lock.yaml` | O    | O       |
| `successReleaseTitle` | 배포가 성공했을 때 출력될 메시지.                                          | O    | -       |
| `failedReleaseTitle`  | 배포가 실패했을 때 출력될 메시지.                                          | O    | -       |

### projectName

- 배포할 프로젝트의 이름을 설정합니다.
    - 이 값은 내부적으로 사용되지 않으며, 프로젝트 식별을 위해 설정합니다.
    - 유지보수를 위해 설정하는 것이 권장됩니다.

### stage

- 배포할 환경을 설정합니다.
    - `production` 또는 `development` 등으로 설정 가능합니다.
    - 환경을 무시하려면 `**`을 입력하세요. glob 패턴을 지원합니다.

### triggerBranch

- 배포를 트리거할 브랜치를 설정합니다.
    - 예를 들어, `master` 브랜치에서만 배포가 진행될 수 있도록 설정할 수 있습니다.
    - 브랜치 값을 무시하려면 `**`을 입력하세요.

### triggerFilePath

- 배포를 트리거할 파일 경로를 설정합니다.
    - 특정 파일 경로에 대한 변경을 감지할 수 있습니다. 예: `apps/example/*`, `pnpm-lock.yaml`.
    - 파일 경로 값을 무시하려면 `**`을 입력하세요.

### successReleaseTitle

- 배포 성공 시 출력될 메시지를 설정합니다.

### failedReleaseTitle

- 배포 실패 시 출력될 메시지를 설정합니다.

## Example With `extractionStartPoint` and `extractionEndPoint`

### 본문 예시

```markdown
###### 기능 개발용 `downstream/feature-branch` to `upstream/dev`

## == 릴리즈 내용 시작 ==

## 리뷰 요약 정보

- 예상 리뷰 소요 시간: e.g., 5분, 30분
- 희망 리뷰 마감 기한: e.g., 이번주 수요일 오전

## 지라 티켓

- DD-000 포트폴리오 영상 자동 재생 처리
-

## 주요 변경점
- 

-

## 스타일 코드 변경시 호환성 체크

- Mac os
    - [ ] 크롬
    - [ ] 사파리
- Window os
    - [ ] 크롬
    - [ ] 사파리

## == 릴리즈 내용 종료 ==

## 검토자가 알아야 할 사항
- 

-
```

`extractionStartPoint`에 `'## == 릴리즈 내용 시작 =='`을 넣고, `extractionEndPoint`에 `'## == 릴리즈 내용 종료 =='`을 넣으면 아래와 같이 본문이 추출됩니다.

### 추출된 내용

```markdown
## 지라 티켓

- DD-000 포트폴리오 영상 자동 재생 처리
-

## 주요 변경점
- 

-

## 스타일 코드 변경시 호환성 체크

- Mac os
    - [ ] 크롬
    - [ ] 사파리
- Window os
    - [ ] 크롬
    - [ ] 사파리
```

- `extractionEndPoint`를 지정하지 않으면, `extractionStartPoint`부터 최하단까지 추출됩니다.

### 추가 참고사항

- `extractionStartPoint` 및 `extractionEndPoint` 값은 본문에서 유니크한 값으로 설정하면 됩니다.
- 본 액션은 [Slack Block Kit Builder](https://app.slack.com/block-kit-builder)에서 생성된 형식을 따릅니다.
- 액션은 `deployment_status` 이벤트에 의해 트리거되며, 이 이벤트는 배포 상태가 변경될 때마다 발생합니다.
- 각 CI/CD 플랫폼의 `environment` 값은 다를 수 있으므로 해당 플랫폼의 `action/deployments`를 확인하세요.
  action/deployments 를 확인해주세요.

## Flow Chart

![image](https://github.com/user-attachments/assets/267b3664-fc9a-46bc-93c1-f5523eb6534a)

## License

```markdown
Copyright (c) 2025 /  [jiro Corp](https://www.jirocorp.io/ko)

Licensed under the Apache License, Version 2.0 (the "License");  
you may not use this file except in compliance with the License.  
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0  

Unless required by applicable law or agreed to in writing, software  
distributed under the License is distributed on an "AS IS" BASIS,  
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  
See the License for the specific language governing permissions and  
limitations under the License.

```

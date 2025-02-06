# release-notification-action 



## Usage

1. 메시지 전달을 위해 SLACK_WEBHOOK_URL 이름의 secret을 세팅하세요.
   - Repo > Settings > Secrets > New repository secret

3. `.github/workflow/release-notification-action.yml` 파일을 생성하고 [Example](https://github.com/jiro-developers/release-notification-action?tab=readme-ov-file#example) 같이 작성하세요.

## Inputs

| 값                          | 설명                                                                                                                   | 필수여부 |
|----------------------------|----------------------------------------------------------------------------------------------------------------------|------|
| token                      | GitHub에서 제공하는 토큰                                                                                                     | O    |
| extractionStartPoint       | 본문을 추출할 기점 해당 기점부터 최하단 정보를 전부 긁어옵니다.<br>e.g '## == 릴리즈 내용 시작 =='                                                     | O    |
| extractionEndPoint         | 해당 기점까지만 추출을 합니다. 만약 값이 없다면,extractionStartPoint 기점으로 모든 값을 긁어옵니다. <br>e.g '## == 릴리즈 내용 종료 =='                      | X    |
| slackWebhookURL            | slack bot을 통해 메시지를 보내기 위한 웹훅 URL                                                                                     | O    |
| specificBranchPattern      | 해당 브랜치에서만 액션에 대한 로직을 실행합니다. 만약 값을 넘기지 않는다면 모든 브랜치에서 실행됩니다. glob 패턴을 지원합니다 ex) 'release/*' / {main,develop,feature/*} |  X   |
| specificDeployEnvironment  | 배포 환경을 감지합니다. 만약 값이 없다면, 배포 환경을 감지하지 않습니다. glob 패턴을 지원합니다 ex) {Production,Preview}                                   |  X   |
## Example

```yml
name: release-notification-action  
  
on:  
  [deployment_status]  
  
jobs:  
  release-notification-action:  
    runs-on: [ubuntu-latest]  
    steps:  
      - name: release-notification-action  
        uses: jiro-developers/release-notification-action@latest  
        with:  
          token: ${{ secrets.GITHUB_TOKEN }}  
          extractionStartPoint: '## == 릴리즈 내용 시작 =='
          extractionEndPoint: '## == 릴리즈 내용 종료 =='  
          slackWebHookURL: ${{ secrets.SLACK_WEBHOOK_URL }}
          specificBranchPattern: 'main'
          specificDeployEnvironment: 'Production'
```


## Example With extractionStartPoint and extractionEndPoint
``` markdown
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

위와 같은 본문이 있다고 가정하면, `extractionStartPoint`에 `## == 릴리즈 내용 시작 ==`를 넣고, `extractionEndPoint`에 `## == 릴리즈 내용 종료 ==`을 넣으면 아래와 같이 추출됩니다.

**`extractionStartPoint` 기점으로 다음 줄 부터 추출되게 됩니다.**

``` markdown
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

만약 `extractionEndPoint`에 값을 넣지 않는다면, `extractionStartPoint`부터 최하단까지 추출됩니다.


``` markdown
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


## 검토자가 알아야 할 사항
- 
-
```



## Note
- `extractionStartPoint`,`extractionEndPoint` 의 값은 본문에서 유니크한 값이라면 어떠한 값이든 상관없습니다.
   -  `extractionStartPoint` 에 명시된 기점을 제외한 본문이 추출됩니다. `Example With extractionStartPoint and extractionEndPoint`을 참고해주세요,
- 본 액션은 슬랙 https://app.slack.com/block-kit-builder 를 통해 제네레이팅 된 가이드라인을 따르고 있습니다.
- 본 액션은 deployment_status 이벤트를 통해 실행됩니다.
   - deployment_status 이벤트는 배포 상태가 변경될 때마다 트리거됩니다.
     - 배포 상태가 pending 이라면 종료됩니다.
- 각 ci/cd 플랫폼에 따라 environment 에 대한 값이 다를 수 있습니다. 각 플랫폼 혹은 action/deployments 를 확인해주세요.


## Flow Chart
![image](https://github.com/user-attachments/assets/2f15ebab-b429-4eb7-9108-008cce4ba321)



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

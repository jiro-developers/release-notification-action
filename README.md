# release-notification-action

----------------



## Usage

1. 메시지 전달을 위해 SLACK_WEBHOOK_URL 이름의 secret을 세팅하세요.
    2. Repo > Settings > Secrets > New repository secret

2. .github/workflow/release-notification-action.yml 파일을 생성하고 Example 같이 작성하세요.

## Inputs

| 값                    | 설명                                                                                   | 필수여부 |
|----------------------|--------------------------------------------------------------------------------------|------|
| token                | GitHub에서 제공하는 토큰                                                                     | O    |
| extractionStartPoint | 본문을 추출할 기점 해당 기점부터 최하단 정보를 전부 긁어옵니다.<br>e.g '## 리뷰대기'                                | O    |
| extractionEndPoint   | 해당 기점까지만 추출을 합니다. 만약 값이 없다면,extractionStartPoint 기점으로 모든 값을 긁어옵니다. <br>e.g '## 리뷰대기' | X    |
| slackWebhookURL      | slack bot을 통해 메시지를 보내기 위한 웹훅 URL                                                     | O    |


## Example

```
name: release-notification-action  
  
on:  
  [deployment_status]  
  
jobs:  
  release-notification-action:  
    runs-on: [ubuntu-latest]  
    steps:  
      - name: release-notification-action  
        uses: ./  
        with:  
          token: ${{ secrets.GITHUB_TOKEN }}  
          extractionStartPoint: '## 리뷰 요약 정보'
          slackWebHookURL: ${{ secrets.SLACK_WEBHOOK_URL }}
```


## Example With extractionStartPoint and extractionEndPoint
```
###### 기능 개발용 `downstream/feature-branch` to `upstream/dev`
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

위와 같은 본문이 있다고 가정하면, `extractionStartPoint`에 `## 리뷰 요약 정보`를 넣고, `extractionEndPoint`에 `## 검토자가 알아야 할 사항`을 넣으면 아래와 같이 추출됩니다.

```
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
- 본 액션은 슬랙 https://app.slack.com/block-kit-builder 를 통해 제네레이팅 된 가이드라인을 따르고 있습니다.
- 본 액션은 deployment_status 이벤트를 통해 실행됩니다.
   - deployment_status 이벤트는 배포 상태가 변경될 때마다 트리거됩니다.
     - 배포 상태가 pending 이라면 종료됩니다.


## Flow Chart
![image](https://private-user-images.githubusercontent.com/67212771/408598481-abd0e469-bd16-40a4-96d2-5af39aa6b056.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MzgzMzM1NTMsIm5iZiI6MTczODMzMzI1MywicGF0aCI6Ii82NzIxMjc3MS80MDg1OTg0ODEtYWJkMGU0NjktYmQxNi00MGE0LTk2ZDItNWFmMzlhYTZiMDU2LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTAxMzElMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwMTMxVDE0MjA1M1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTlmMDA2YWFhYzdlYTNiOWU1ODFiNzliMDVjYzk4MzJjNjlhY2U4OTQzNWZkMmZhMWU0OTFjYjJiYjhlZGM1NTYmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.YdARNKxWfw7EIflO8wfCovotbFUrGMemDq01Xmy4PTw)


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
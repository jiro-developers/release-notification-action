# release-notification-action

----------------

## Usage
1. 메시지 전달을 위해 SLACK_WEBHOOK_URL 이름의 secret을 세팅하세요.
    2. Repo > Settings > Secrets > New repository secret

2. .github/workflow/release-notification-action.yml 파일을 생성하고 Example 같이 작성하세요.




## Inputs

| 값               | 설명                                                    | 필수여부 |
|-----------------|-------------------------------------------------------|------|
| token           | GitHub에서 제공하는 토큰                                      | O    |
| extractionPoint | 본문을 추출할 기점 해당 기점부터 최하단 정보를 전부 긁어옵니다.<br>e.g '## 리뷰대기' | O    |
| slackWebhookURL | slack bot을 통해 메시지를 보내기 위한 웹훅 URL                      | O    |

## Example

```
name: release-notification-action  
  
on:  
  [deployment_status]  
  
jobs:  
  pr-action-body:  
    if: ${{ github.event_name == 'deployment_status' && github.event.deployment_status.state == 'success' }}  
    runs-on: [ubuntu-latest]  
    steps:  
      - name: release-notification-action  
        uses: ./  
        with:  
          token: ${{ secrets.GITHUB_TOKEN }}  
          extractionPoint: '## 리뷰 요약 정보'  
          slackWebHookURL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## License
```
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
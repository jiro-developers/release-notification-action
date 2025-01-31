/**
 * 액션에서 필수적으로 사용되는 입력되어야 할 키 값입니다.
 * **/
const ACTION_REQUIRED_INPUT_KEY = [
  'token', // GitHub Token
  'extractionPoint', // 본문을 추출할 기점 해당 기점 문자열 ex) "## 리뷰 요약 정보"
  'slackWebhookURL', // Slack Webhook URL
] as const;

export { ACTION_REQUIRED_INPUT_KEY };

import type { GithubDeploymentStatusState } from '../types';

/**
 * 액션에서 필수적으로 사용되는 입력되어야 할 키 값입니다.
 * **/
const ACTION_REQUIRED_INPUT_KEY = [
  'token', // GitHub Token
  'extractionPoint', // 본문을 추출할 기점 해당 기점 문자열 ex) "## 리뷰 요약 정보"
  'slackWebhookURL', // Slack Webhook URL
] as const;

/**
 * Slack 메시지의 최대 길이입니다.
 * @see https://api.slack.com/methods/chat.postMessage
 * ----------------------------------------------------
 * 추후 truncating 처리를 한다면 제거 될 상수입니다.
 * @see https://api.slack.com/methods/chat.postMessage#truncating
 * **/
const MAX_LENGTH_OF_SLACK_MESSAGE = 4_000;

const DEPLOY_ERROR_STATUS_LIST: GithubDeploymentStatusState[] = ['failure', 'error'];
const DEPLOY_SUCCEED_STATUS_LIST: GithubDeploymentStatusState[] = ['success'];

export { ACTION_REQUIRED_INPUT_KEY, MAX_LENGTH_OF_SLACK_MESSAGE, DEPLOY_ERROR_STATUS_LIST, DEPLOY_SUCCEED_STATUS_LIST };

import type {
  ActionInputKey,
  GithubDeploymentStatusState,
  OptionalActionInputKey,
  RequiredActionInputKey,
} from '@/types';

/**
 * 액션에서 필수적으로 사용되는 입력되어야 할 키 값입니다.
 * **/
const ACTION_REQUIRED_INPUT_KEY_LIST: RequiredActionInputKey[] = [
  'token', // GitHub Token
  'extractionStartPoint', // 본문을 추출할 기점 해당 기점 문자열 ex) "## 리뷰 요약 정보"
  'slackWebhookURL', // Slack Webhook URL
  'projectConfig', // 프로젝트 설정 정보
];

const ACTION_OPTIONAL_INPUT_KEY_LIST: OptionalActionInputKey[] = [
  'extractionEndPoint', // 본문을 추출할 종료 지점에 해당되는 문자열 ex) "## 리뷰 요약 정보"
] as const;

const ACTION_INPUT_KEY_LIST: ActionInputKey[] = [...ACTION_REQUIRED_INPUT_KEY_LIST, ...ACTION_OPTIONAL_INPUT_KEY_LIST];

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

export {
  ACTION_REQUIRED_INPUT_KEY_LIST,
  MAX_LENGTH_OF_SLACK_MESSAGE,
  DEPLOY_ERROR_STATUS_LIST,
  DEPLOY_SUCCEED_STATUS_LIST,
  ACTION_INPUT_KEY_LIST,
  ACTION_OPTIONAL_INPUT_KEY_LIST,
};

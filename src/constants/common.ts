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
  'autoLinkConfig', // 지라 등 특정 패스를 감지하여 링크로 변경해주기 위한 설정입니다.
] as const;

const ACTION_INPUT_KEY_LIST: ActionInputKey[] = [...ACTION_REQUIRED_INPUT_KEY_LIST, ...ACTION_OPTIONAL_INPUT_KEY_LIST];

/**
 * 3001자 까지 대응이 되지만 특수한 케이스로 인하여 짤리는 경우를 대비하여 2800자로 정합니다.
 * **/
const MAX_LENGTH_OF_SLACK_MESSAGE_FOR_ATTACHMENT = 2_800 as const;

const MAX_ATTACHMENT_BLOCK_COUNT = 100 as const;

const DEPLOY_ERROR_STATUS_LIST: GithubDeploymentStatusState[] = ['failure', 'error'];
const DEPLOY_SUCCEED_STATUS_LIST: GithubDeploymentStatusState[] = ['success'];

export {
  ACTION_REQUIRED_INPUT_KEY_LIST,
  DEPLOY_ERROR_STATUS_LIST,
  DEPLOY_SUCCEED_STATUS_LIST,
  ACTION_INPUT_KEY_LIST,
  ACTION_OPTIONAL_INPUT_KEY_LIST,
  MAX_LENGTH_OF_SLACK_MESSAGE_FOR_ATTACHMENT,
  MAX_ATTACHMENT_BLOCK_COUNT,
};

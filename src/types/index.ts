/**
 * @see https://docs.github.com/en/webhooks/webhook-events-and-payloads#deployment_status -> deployment_status -> state
 **/
type GithubDeploymentStatusState = 'pending' | 'success' | 'failure' | 'error';

type ActionInputKey =
  | 'token' // GitHub Token
  | 'extractionStartPoint' // 본문을 추출할 기점 해당 기점 문자열 ex) "## 리뷰 요약 정보"
  | 'slackWebhookURL' // Slack Webhook URL
  | 'extractionEndPoint'; // 해당 기점까지만 추출을 합니다. 만약 값이 없다면,extractionStartPoint 기점으로 모든 값을 긁어옵니다.

interface ProjectConfig {
  projectName: string;
  stage: string;
  triggerBranch: string;
  triggerFilePath: string;
  successReleaseTitle: string;
  failedReleaseTitle: string;
}

export type { GithubDeploymentStatusState, ActionInputKey, ProjectConfig };

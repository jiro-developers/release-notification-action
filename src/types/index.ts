/**
 * @see https://docs.github.com/en/webhooks/webhook-events-and-payloads#deployment_status -> deployment_status -> state
 **/
type GithubDeploymentStatusState = 'pending' | 'success' | 'failure' | 'error';

export type { GithubDeploymentStatusState };

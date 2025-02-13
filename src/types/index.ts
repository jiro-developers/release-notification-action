/**
 * @see https://docs.github.com/en/webhooks/webhook-events-and-payloads#deployment_status -> deployment_status -> state
 * @see   error, failure, inactive, in_progress, queued, pending, success -> deployment_status -> state
 **/
type GithubDeploymentStatusState = 'pending' | 'success' | 'failure' | 'error' | 'inactive' | 'in_progress' | 'queued';

export type { GithubDeploymentStatusState };

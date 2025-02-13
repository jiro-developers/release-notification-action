import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

/**
 * @see https://docs.github.com/ko/rest/deployments/statuses?apiVersion=2022-11-28#get-a-deployment-status
 **/
type GithubDeploymentStatusState = RestEndpointMethodTypes['repos']['getDeploymentStatus']['response']['data']['state'];

export type { GithubDeploymentStatusState };

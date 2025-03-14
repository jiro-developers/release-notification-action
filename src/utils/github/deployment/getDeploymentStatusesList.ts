import * as github from '@actions/github';
import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

import { getGithubContext } from '@/utils/github/context/getGithubContext';

const getDeploymentStatusesList = async (
  token: string,
  deployment_id: number,
  rest?: Omit<RestEndpointMethodTypes['repos']['listDeploymentStatuses']['parameters'], 'token' | 'owner' | 'repo'>
) => {
  const octokit = github.getOctokit(token);
  const {
    issue: { owner, repo },
  } = getGithubContext();

  return await octokit.rest.repos.listDeploymentStatuses({
    token,
    owner,
    repo,
    deployment_id,
    ...rest,
  });
};

export { getDeploymentStatusesList };

import * as github from '@actions/github';
import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

import { getGithubContext } from '@/utils/github/context/getGithubContext';

const getDeploymentList = async (
  token: string,
  rest?: Omit<RestEndpointMethodTypes['repos']['listDeployments']['parameters'], 'token' | 'owner' | 'repo'>
) => {
  const octokit = github.getOctokit(token);
  const {
    issue: { owner, repo },
  } = getGithubContext();

  return await octokit.rest.repos.listDeployments({
    token,
    per_page: 100,
    owner,
    repo,
    ...rest,
  });
};

export { getDeploymentList };

import * as github from '@actions/github';

import { getGithubContext } from '@/utils/github/context/getGithubContext';
import { logger } from '@/utils/github/logger';

const getDeploymentList = async (token: string) => {
  const octokit = github.getOctokit(token);
  const {
    issue: { owner, repo },
  } = getGithubContext();

  try {
    const deploymentListResponse = await octokit.rest.repos.listDeployments({
      token,
      per_page: 100,
      owner,
      repo,
    });

    return deploymentListResponse.data;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`[ERROR] Get Deployment List: ${error.message}`);
    }
  }
};

export { getDeploymentList };

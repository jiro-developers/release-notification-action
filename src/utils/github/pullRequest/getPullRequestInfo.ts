import * as core from '@actions/core';
import * as github from '@actions/github';
import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

import { getGithubContext } from '@/utils/github/context/getGithubContext';
import { logger } from '@/utils/github/logger';

/**
 * PR 정보를 가져옵니다.
 * @param token Github Token
 * @param pullRequestNumber
 * @returns PR 정보 Promise<RestEndpointMethodTypes["pulls"]["get"]["response"]>
 * **/
const getPullRequestInfo = async (
  token: string,
  pullRequestNumber: number
): Promise<RestEndpointMethodTypes['pulls']['get']['response']['data'] | null> => {
  const octokit = github.getOctokit(token);
  const { issue } = getGithubContext();
  const { owner, repo } = issue;

  try {
    const { data: pullRequestData } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: pullRequestNumber,
    });

    logger.info({
      owner,
      repo,
      pull_number: pullRequestNumber,
    });

    return pullRequestData;
  } catch (error) {
    logger.error({
      message: `Failed to get pull request info ${error}`,
      error: error instanceof Error ? error.message : String(error),
      owner,
      repo,
      pull_number: pullRequestNumber,
    });

    return null;
  }
};

export { getPullRequestInfo };

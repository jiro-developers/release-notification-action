import * as core from '@actions/core';
import * as github from '@actions/github';
import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

import { getGithubContext } from '@/utils/github/context/getGithubContext';
import { coreLogger } from '@/utils/github/coreLogger';

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

    coreLogger.info({
      owner,
      repo,
      pull_number: pullRequestNumber,
    });

    return pullRequestData;
  } catch {
    coreLogger.setFailed(`Failed to retrieve PR info`);

    return null;
  }
};

export { getPullRequestInfo };

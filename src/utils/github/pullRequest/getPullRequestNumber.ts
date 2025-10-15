import * as github from '@actions/github';

import { getGithubContext } from '@/utils/github/context/getGithubContext';
import { logger } from '@/utils/github/logger';
import { getPullRequestFromCommit } from '@/utils/github/pullRequest/getPullRequestFromCommit';

/**
 * 배포된 PR 번호를 가져옵니다.
 * @description 순서는 아래와 같습니다.
 * 1. context에서 PR 번호를 가져옵니다.
 * 2. PR 번호가 없을 경우 head SHA를 사용하여 PR을 찾습니다.
 * 3. PR을 찾지 못할 경우 커밋 API를 사용하여 PR을 찾습니다.
 * 4. PR을 찾지 못할 경우 에러를 발생시킵니다.
 * @param token Github Token
 * @returns PR 번호
 */
const getPullRequestNumber = async (token: string): Promise<number> => {
  const octokit = github.getOctokit(token);
  const {
    sha,
    payload: { pull_request },
    issue: { owner, repo, number },
  } = getGithubContext();

  const pullRequestNumberFromContext = pull_request?.number ?? number;

  if (pullRequestNumberFromContext) {
    logger.info(`Found PR number: ${pullRequestNumberFromContext} from context.`);
    return pullRequestNumberFromContext;
  }

  const { data: pullRequestList } = await octokit.rest.pulls.list({
    owner,
    repo,
    state: 'closed',
  });

  const matchingPR = pullRequestList.find((pr) => pr?.merge_commit_sha === sha);

  if (matchingPR) {
    logger.info(`Found PR number: ${matchingPR.number} using head SHA.`);
    return matchingPR.number;
  }

  logger.info(`No matching PR found with head SHA. Falling back to commit API.`);
  const pullRequestNumberFromCommit = await getPullRequestFromCommit(token).then((pr) => pr?.number);

  if (!pullRequestNumberFromCommit) {
    logger.error(`No PR found associated with commit SHA: ${sha}`);
    throw new Error(`Unable to find PR associated with commit SHA: ${sha}`);
  }

  logger.info(`Found PR number: ${pullRequestNumberFromCommit} using commit API.`);
  return pullRequestNumberFromCommit;
};

export { getPullRequestNumber };

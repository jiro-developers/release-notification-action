import * as github from '@actions/github';

import { getGithubContext } from '@/utils/github/context/getGithubContext';
import { logger } from '@/utils/github/logger';

/**
 * 커밋 SHA를 사용하여 API 호출 한 뒤 PR을 가져옵니다.
 * @param token Github Token
 * @returns PR 정보
 */
const getPullRequestFromCommit = async (token: string) => {
  const octokit = github.getOctokit(token);
  const {
    sha,
    issue: { owner, repo },
  } = getGithubContext();

  try {
    // 커밋을 포함하는 PR을 찾기 위해 커밋에서 PR을 조회
    const { data: prList } = await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
      owner,
      repo,
      commit_sha: sha,
    });

    if (prList.length > 0) {
      return prList[0];
    }

    logger.info('No associated PR found for this commit.');
    return null;
  } catch {
    logger.setFailed(`Failed to retrieve PR from commit`);
    return null;
  }
};

export { getPullRequestFromCommit };

import * as github from '@actions/github';

import { getGithubContext } from '@/utils/github/context/getGithubContext';

const getChangedFileListFromCommit = async (token: string, commitHash: string) => {
  const {
    issue: { owner, repo },
  } = getGithubContext();

  const octokit = github.getOctokit(token);

  const commit = await octokit.rest.repos.getCommit({
    ref: commitHash,
    owner,
    repo,
  });

  if (!commit) {
    return [];
  }

  if (!commit.data.files) {
    return [];
  }

  return commit.data.files;
};

export { getChangedFileListFromCommit };

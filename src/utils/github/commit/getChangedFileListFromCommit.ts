import * as github from '@actions/github';

import { getGithubContext } from '@/utils/github/context/getGithubContext';

const getChangedFileListFromCommit = async (token: string, commitHash: string) => {
  const {
    issue: { owner, repo },
  } = getGithubContext();

  const octokit = github.getOctokit(token);

  const data = await octokit.rest.repos.getCommit({
    ref: commitHash,
    owner,
    repo,
  });

  if (!data) {
    return [];
  }

  if (!data.data.files) {
    return [];
  }

  return data.data.files;
};

export { getChangedFileListFromCommit };

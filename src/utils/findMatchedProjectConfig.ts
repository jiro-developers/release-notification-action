import * as core from '@actions/core';
import { minimatch } from 'minimatch';

import type { ProjectConfig } from '@/types';
import { safeJsonParse } from '@/utils/common';
import { getChangedFileListFromCommit } from '@/utils/github/commit/getChangedFileListFromCommit';
import { coreLogger } from '@/utils/github/coreLogger';
import { getDeployInformationFromContext } from '@/utils/github/deployment/getDeployInformationFromContext';

interface FindMatchedProjectConfigProps {
  projectConfig: string;
  token: string;
  baseBranchName: string;
  commitSha: string;
}
const findMatchedProjectConfig = async ({
  projectConfig,
  token,
  baseBranchName,
  commitSha,
}: FindMatchedProjectConfigProps) => {
  const parsedProjects = safeJsonParse<ProjectConfig[]>(projectConfig);
  const { deployEnvironment } = getDeployInformationFromContext();

  if (!parsedProjects) {
    core.error('JSON parsing error occurred,');
    return;
  }

  const changedFileNameFromCommitHash = await getChangedFileListFromCommit(token, commitSha).then((files) => {
    return files.map((file) => file.filename);
  });

  // parse 된 프로젝트 설정 중 현재 열린 pullRequest 에 baseBranchName 에 해당하는 프로젝트를 찾습니다.
  return parsedProjects.find((projectConfig) => {
    const isMatchedBranch = minimatch(baseBranchName, projectConfig.triggerBranch, {
      nobrace: false,
    });

    const isMatchedFilePath = changedFileNameFromCommitHash.some((changedFileName) => {
      return minimatch(changedFileName, projectConfig.triggerFilePath);
    });

    const isMatchedDeployEnvironment = minimatch(deployEnvironment, projectConfig.stage, {
      nobrace: false,
      nocase: true,
    });

    coreLogger.info({
      isMatchedBranch,
      isMatchedFilePath,
      isMatchedDeployEnvironment,
      projectConfig,
    });

    return isMatchedBranch && isMatchedFilePath && isMatchedDeployEnvironment;
  });
};

export { findMatchedProjectConfig };

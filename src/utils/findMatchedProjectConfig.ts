import { minimatch } from 'minimatch';

import type { ProjectConfig } from '@/types';
import { getChangedFileListFromCommit } from '@/utils/github/commit/getChangedFileListFromCommit';
import { getDeployInformationFromContext } from '@/utils/github/deployment/getDeployInformationFromContext';
import { logger } from '@/utils/github/logger';

interface FindMatchedProjectConfigProps {
  parsedProjectConfig: ProjectConfig[];
  token: string;
  baseBranchName: string;
  commitSha: string;
}
const findMatchedProjectConfig = async ({
  parsedProjectConfig,
  token,
  baseBranchName,
  commitSha,
}: FindMatchedProjectConfigProps) => {
  const { deployEnvironment } = getDeployInformationFromContext();

  const changedFileNameFromCommitHash = await getChangedFileListFromCommit(token, commitSha).then((files) => {
    return files.map((file) => file.filename);
  });

  // parse 된 프로젝트 설정 중 현재 열린 pullRequest 에 baseBranchName 에 해당하는 프로젝트를 찾습니다.
  return parsedProjectConfig.find((projectConfig) => {
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

    logger.info({
      isMatchedBranch,
      isMatchedFilePath,
      isMatchedDeployEnvironment,
      changedFileNameFromCommitHash,
      projectConfig,
    });

    return isMatchedBranch && isMatchedFilePath && isMatchedDeployEnvironment;
  });
};

export { findMatchedProjectConfig };

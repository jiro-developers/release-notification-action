import type { GithubDeploymentStatusState } from '@/types';
import { getGithubContext } from '@/utils/github/context/getGithubContext';

const getDeployInformationFromContext = () => {
  const { payload } = getGithubContext();

  const deploymentStatus = payload.deployment_status?.state as GithubDeploymentStatusState;
  const deployEnvironment = payload?.deployment?.environment;
  const deployCommitSha = payload?.deployment?.sha;

  return {
    deploymentStatus,
    deployEnvironment,
    deployCommitSha,
  };
};

export { getDeployInformationFromContext };

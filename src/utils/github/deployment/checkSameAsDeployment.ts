import { getDeployInformationFromContext } from '@/utils/github/deployment/getDeployInformationFromContext';
import { getDeploymentList } from '@/utils/github/deployment/getDeploymentList';
import { logger } from '@/utils/github/logger';

interface CheckSameAsDeploymentProps {
  token: string;
}
const checkHasSameAsDeployment = async ({ token }: CheckSameAsDeploymentProps) => {
  const deploymentList = await getDeploymentList(token);
  const { deployEnvironment, deployCommitSha } = getDeployInformationFromContext();

  // 에러 시 true 를 return 후 로깅을 합니다.
  if (!deploymentList) {
    logger.error('Failed to get deployment list');
    return true;
  }

  const getInformationFromDeploymentList = deploymentList.map((deployment) => {
    return {
      sha: deployment.sha,
      environment: deployment.environment,
    };
  });

  const filteredDeploymentList = getInformationFromDeploymentList.filter((deployment) => {
    const isSameEnvironment = deployment.environment === deployEnvironment;
    const isSameSha = deployment.sha === deployCommitSha;

    return isSameEnvironment && isSameSha;
  });

  logger.info(`same SHA: ${filteredDeploymentList.map((deployment) => deployment.sha).join(', ')}`);

  return filteredDeploymentList.length >= 2;
};

export { checkHasSameAsDeployment };

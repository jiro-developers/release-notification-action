import { getDeployInformationFromContext } from '@/utils/github/deployment/getDeployInformationFromContext';
import { getDeploymentList } from '@/utils/github/deployment/getDeploymentList';
import { getDeploymentStatusesList } from '@/utils/github/deployment/getDeploymentStatusesList';
import { logger } from '@/utils/github/logger';

interface CheckSameAsDeploymentProps {
  token: string;
  maxCount?: number;
}

const MAX_DEPLOYMENT_COUNT = 2 as const;

const checkHasSameAsDeployment = async ({ token, maxCount = MAX_DEPLOYMENT_COUNT }: CheckSameAsDeploymentProps) => {
  const { deployEnvironment, deployCommitSha } = getDeployInformationFromContext();
  const { data: deploymentList } = await getDeploymentList(token, {
    environment: deployEnvironment,
    sha: deployCommitSha,
  });

  // 에러 시 true 를 return 후 로깅을 합니다.
  if (!deploymentList) {
    logger.error('Failed to get deployment list');
    return true;
  }

  // sha 와 env 를 필터링 한 결과물을 가져옵니다.
  const builtDeploymentList = deploymentList.map((deployment) => {
    return {
      id: deployment.id,
      sha: deployment.sha,
      environment: deployment.environment,
    };
  });

  // 해당 값으로 deploymentStatuses 를 가져옵니다.
  const deploymentStatuses = await Promise.all(
    builtDeploymentList.map(async (deployment) => await getDeploymentStatusesList(token, deployment.id))
  );

  // deploymentStatuses 를 flatMap 으로 평탄화 합니다.
  const flattenedDeploymentStatuses = deploymentStatuses.flatMap((res) => res.data);

  // deploymentStatuses 중 state 가 success 인 것을 가져옵니다.
  const isSameAsDeployment = flattenedDeploymentStatuses.filter((status) => status.state === 'success');

  // 만약 MAX_DEPLOYMENT_COUNT 개 이상인지 확인합니다.
  return isSameAsDeployment.length >= maxCount;
};

export { checkHasSameAsDeployment };

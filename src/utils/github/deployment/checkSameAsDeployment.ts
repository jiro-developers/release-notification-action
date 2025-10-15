import { getDeployInformationFromContext } from '@/utils/github/deployment/getDeployInformationFromContext';
import { getDeploymentList } from '@/utils/github/deployment/getDeploymentList';
import { getDeploymentStatusList } from '@/utils/github/deployment/getDeploymentStatusList';
import { logger } from '@/utils/github/logger';

interface CheckSameAsDeploymentProps {
  token: string;
  maxCount?: number;
}

type CheckSameAsDeploymentStateReturn =
  | { isError: true; isSameAsDeployment: null }
  | { isError: false; isSameAsDeployment: boolean };

const MAX_DEPLOYMENT_COUNT = 2 as const;

const checkHasSameAsDeployment = async ({
  token,
  maxCount = MAX_DEPLOYMENT_COUNT,
}: CheckSameAsDeploymentProps): Promise<CheckSameAsDeploymentStateReturn> => {
  const { deployEnvironment, deployCommitSha } = getDeployInformationFromContext();
  const { data: deploymentList } = await getDeploymentList(token, {
    environment: deployEnvironment,
    sha: deployCommitSha,
  });

  // 에러 시 isError 를 true 로 반환합니다. 또한 isSameAsDeployment 는 null 로 반환합니다.
  if (!deploymentList) {
    logger.error('Failed to get deployment list');
    return {
      isError: true,
      isSameAsDeployment: null,
    };
  }

  // sha 와 env 를 필터링 한 결과물을 가져옵니다.
  const builtDeploymentList = deploymentList.map((deployment) => {
    return {
      id: deployment.id,
      sha: deployment.sha,
      environment: deployment.environment,
    };
  });

  try {
    // 해당 값으로 deploymentStatusList 를 가져옵니다.
    const deploymentStatusList = await Promise.all(
      builtDeploymentList.map(async (deployment) => await getDeploymentStatusList(token, deployment.id))
    );

    // deploymentStatusList 를 flatMap 으로 평탄화 합니다.
    const flattenedDeploymentStatusList = deploymentStatusList.flatMap((res) => res.data);

    // deploymentStatusList 중 state 가 success 인 것을 가져옵니다.
    const isSameAsDeployment = flattenedDeploymentStatusList.filter((status) => status.state === 'success');

    // 만약 MAX_DEPLOYMENT_COUNT 개 이상인지 확인합니다.
    return {
      isError: false,
      isSameAsDeployment: isSameAsDeployment.length >= maxCount,
    };
  } catch (error) {
    logger.error({
      message: `Failed to get deployment status list ${error}`,
      error: error instanceof Error ? error.message : String(error),
      deployEnvironment,
      deployCommitSha,
    });

    return {
      isError: true,
      isSameAsDeployment: null,
    };
  }
};

export { checkHasSameAsDeployment };

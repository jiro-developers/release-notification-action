import { githubToSlack } from '@atomist/slack-messages';

import { DEPLOY_ERROR_STATUS_LIST, DEPLOY_SUCCEED_STATUS_LIST } from '@/constants/common';
import type { ProjectConfig } from '@/types';
import { safeJsonParse } from '@/utils/common';
import { extractSection } from '@/utils/extractSection';
import { findMatchedProjectConfig } from '@/utils/findMatchedProjectConfig';
import { getGithubContext } from '@/utils/github/context/getGithubContext';
import { getDeployInformationFromContext } from '@/utils/github/deployment/getDeployInformationFromContext';
import { getGithubCoreInput } from '@/utils/github/getGithubCoreInput';
import { logger } from '@/utils/github/logger';
import { getPullRequestInfo } from '@/utils/github/pullRequest/getPullRequestInfo';
import { getPullRequestNumber } from '@/utils/github/pullRequest/getPullRequestNumber';
import { buildSlackMessage } from '@/utils/slack/buildSlackMessage';
import { sendSlackMessage } from '@/utils/slack/sendSlackMessage';

const run = async (): Promise<void> => {
  try {
    logger.info('Start to run the action.');

    /**
     * [INFO] 해당 워크플로우에 필요한 인풋을 가져옵니다.
     * 내부적으로 core.getInput을 사용하여 필요한 인풋을 가져오며, 필요한 인풋이 없을 경우 에러를 발생시킵니다.
     * 만약 필수값이 없는 경우 null을 반환합니다.
     * **/
    const inputList = getGithubCoreInput();
    if (!inputList) {
      return;
    }

    const { token, extractionStartPoint, slackWebhookURL, extractionEndPoint, projectConfig } = inputList;

    /**------------------------ INPUT 검증 종료 -----------------------------**/

    const { deploymentStatus, deployCommitSha } = getDeployInformationFromContext();

    // [INFO] 배포 상태가 DEPLOY_SUCCEED_STATUS_LIST 와 DEPLOY_ERROR_STATUS_LIST 에 해당 되지 않을 경우 로딩 상태로 취급 하고 종료합니다.
    const isPendingStatus = ![...DEPLOY_SUCCEED_STATUS_LIST, ...DEPLOY_ERROR_STATUS_LIST].includes(deploymentStatus);
    if (isPendingStatus) {
      logger.info(`Deployment is loading. ${deploymentStatus}`);
      return;
    }
    /**------------------------ 배포 상태 검증 종료 -----------------------------**/

    const pullRequestNumber = await getPullRequestNumber(token);

    if (!pullRequestNumber) {
      logger.error('Could not find the Pull Request number');
      return;
    }

    // [INFO] 해당 PR의 정보를 가져옵니다.
    const pullRequestInfo = await getPullRequestInfo(token, pullRequestNumber);

    if (!pullRequestInfo) {
      logger.error('Could not find the Pull Request information.');
      return;
    }

    const {
      title,
      body,
      html_url,
      assignees,
      merge_commit_sha,
      user,
      base: { ref: baseBranchName },
    } = pullRequestInfo;

    // [ERROR] PR의 body가 없을 경우 에러를 발생시킵니다.
    if (!body) {
      logger.error('No body provided.');
      return;
    }

    // [INFO] PR의 body에서 divideSection에 해당하는 섹션을 추출합니다.
    const extractedSection = extractSection(body, extractionStartPoint, extractionEndPoint);

    // [ERROR] 추출된 섹션이 없을 경우 에러를 발생시킵니다.
    if (!extractedSection) {
      logger.error('Could not find the section.');
      return;
    }

    // 머지가 되지 않았더라면, 실행 시키지 않습니다.
    if (!merge_commit_sha) {
      logger.error(`#${pullRequestNumber} - This Pull Request was Not Merge`);
      return;
    }

    // 머지 커밋과 deploy sha 와 같지 않으면 실행 시키지 않습니다.
    if (merge_commit_sha !== deployCommitSha) {
      logger.error(
        `This Sha was Not Same deploySha \n merge_commit_sha: ${merge_commit_sha} \n deploy_sha:${deployCommitSha}`
      );
      return;
    }

    const parsedProjectConfig = safeJsonParse<ProjectConfig[]>(projectConfig);
    if (!parsedProjectConfig) {
      logger.error('JSON parsing error occurred,');
      return;
    }

    const matchedProject = await findMatchedProjectConfig({
      token,
      parsedProjectConfig,
      commitSha: merge_commit_sha,
      baseBranchName,
    });

    // [INFO] 해당 프로젝트 설정이 없을 경우 종료합니다.
    if (!matchedProject) {
      logger.error('No matching Condition found in the project settings');
      return;
    }

    const {
      issue: { number },
    } = getGithubContext();

    const safeAssignees = assignees?.map((assignee) => assignee.login) ?? [];
    const pullRequestOwner = [...new Set([user?.login, ...safeAssignees])].join(', ');

    const pullRequestInformation = {
      title: title,
      url: html_url,
      number: number ?? pullRequestNumber,
      owner: pullRequestOwner,
      baseBranchName: baseBranchName,
    };

    logger.info({
      pullRequestInformation,
    });

    // [INFO] 배포 상태가 DEPLOY_ERROR_STATUS_LIST 에 해당 되는 경우 배포 실패 메시지를 보내고 종료합니다.
    if (DEPLOY_ERROR_STATUS_LIST.includes(deploymentStatus)) {
      logger.info(`Deployment was Failure. ${deploymentStatus}`);

      await sendSlackMessage({
        webhookURL: slackWebhookURL,
        payload: buildSlackMessage({
          titleMessage: matchedProject.failedReleaseTitle,
          pullRequest: pullRequestInformation,
          deployStatus: 'fail',
        }),
      });

      return;
    }

    // [INFO] Slack 성공 메시지를 보냅니다.
    await sendSlackMessage({
      webhookURL: slackWebhookURL,
      payload: buildSlackMessage({
        titleMessage: matchedProject.successReleaseTitle,
        pullRequest: {
          ...pullRequestInformation,
          body: githubToSlack(extractedSection),
        },
      }),
    });
  } catch (error) {
    logger.setFailed(`Action failed: ${(error as Error).message}`);
  }
};

run();

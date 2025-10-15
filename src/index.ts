import { githubToSlack } from '@atomist/slack-messages';

import { DEPLOY_ERROR_STATUS_LIST, DEPLOY_SUCCEED_STATUS_LIST } from '@/constants/common';
import type { ProjectConfig } from '@/types';
import { type AutoLink, buildAutoLink } from '@/utils/buildAutoLink';
import { safeJsonParse } from '@/utils/common';
import { extractSection } from '@/utils/extractSection';
import { findMatchedProjectConfig } from '@/utils/findMatchedProjectConfig';
import { getGithubContext } from '@/utils/github/context/getGithubContext';
import { checkHasSameAsDeployment } from '@/utils/github/deployment/checkSameAsDeployment';
import { getDeployInformationFromContext } from '@/utils/github/deployment/getDeployInformationFromContext';
import { getGithubCoreInput } from '@/utils/github/getGithubCoreInput';
import { logger } from '@/utils/github/logger';
import { getPullRequestInfo } from '@/utils/github/pullRequest/getPullRequestInfo';
import { getPullRequestNumber } from '@/utils/github/pullRequest/getPullRequestNumber';
import { buildSlackMessage } from '@/utils/slack/buildSlackMessage';
import { sendSlackMessage } from '@/utils/slack/sendSlackMessage';

const run = async (): Promise<void> => {
  try {
    logger.info({ message: 'Release Notification Action started' });

    /**
     * [INFO] 해당 워크플로우에 필요한 인풋을 가져옵니다.
     * 내부적으로 core.getInput을 사용하여 필요한 인풋을 가져오며, 필요한 인풋이 없을 경우 에러를 발생시킵니다.
     * 만약 필수값이 없는 경우 null을 반환합니다.
     * **/
    logger.info({ message: 'Fetching GitHub Core Input...' });
    const inputList = getGithubCoreInput();

    if (!inputList) {
      logger.error({ message: 'Failed to fetch GitHub Core Input' });
      return;
    }

    const { token, extractionStartPoint, slackWebhookURL, extractionEndPoint, projectConfig, autoLinkConfig } =
      inputList;

    logger.info({
      message: 'GitHub Core Input fetched successfully',
      hasToken: !!token,
      extractionStartPoint,
      extractionEndPoint,
      hasSlackWebhookURL: !!slackWebhookURL,
      hasProjectConfig: !!projectConfig,
      hasAutoLinkConfig: !!autoLinkConfig,
    });

    /**------------------------ INPUT 검증 종료 -----------------------------**/

    logger.info({ message: 'Fetching deployment information...' });
    const { deploymentStatus, deployCommitSha } = getDeployInformationFromContext();

    logger.info({
      message: 'Deployment information fetched successfully',
      deploymentStatus,
      deployCommitSha,
      hasDeployCommitSha: !!deployCommitSha,
    });

    // [INFO] 배포 상태가 DEPLOY_SUCCEED_STATUS_LIST 와 DEPLOY_ERROR_STATUS_LIST 에 해당 되지 않을 경우 로딩 상태로 취급 하고 종료합니다.
    const isPendingStatus = ![...DEPLOY_SUCCEED_STATUS_LIST, ...DEPLOY_ERROR_STATUS_LIST].includes(deploymentStatus);

    logger.info({
      message: 'Validating deployment status',
      deploymentStatus,
      isPendingStatus,
      successStatusList: DEPLOY_SUCCEED_STATUS_LIST,
      errorStatusList: DEPLOY_ERROR_STATUS_LIST,
    });

    if (isPendingStatus) {
      logger.info({ message: `Deployment is in progress. Status: ${deploymentStatus}` });
      return;
    }
    /**------------------------ 배포 상태 검증 종료 -----------------------------**/

    logger.info({ message: 'Fetching Pull Request number...' });
    const pullRequestNumber = await getPullRequestNumber(token);

    logger.info({
      message: 'Pull Request number query result',
      pullRequestNumber,
      hasPullRequestNumber: !!pullRequestNumber,
    });

    if (!pullRequestNumber) {
      logger.error({ message: 'Could not find Pull Request number' });
      return;
    }

    // [INFO] 해당 PR의 정보를 가져옵니다.
    logger.info({ message: `Fetching Pull Request information... (PR #${pullRequestNumber})` });
    const pullRequestInfo = await getPullRequestInfo(token, pullRequestNumber);

    if (!pullRequestInfo) {
      logger.error({ message: `Could not find Pull Request information. (PR #${pullRequestNumber})` });
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

    logger.info({
      message: 'Pull Request information fetched successfully',
      title,
      hasBody: !!body,
      bodyLength: body?.length || 0,
      html_url,
      assigneesCount: assignees?.length || 0,
      assignees: assignees?.map((a) => a.login) || [],
      merge_commit_sha,
      hasMergeCommitSha: !!merge_commit_sha,
      user: user?.login,
      baseBranchName,
    });

    // [ERROR] PR의 body가 없을 경우 에러를 발생시킵니다.
    if (!body) {
      logger.error({ message: 'No PR body provided' });
      return;
    }

    // [INFO] PR의 body에서 divideSection에 해당하는 섹션을 추출합니다.
    logger.info({
      message: 'Starting section extraction...',
      extractionStartPoint,
      extractionEndPoint,
      bodyPreview: body.substring(0, 200) + (body.length > 200 ? '...' : ''),
    });

    const extractedSection = extractSection(body, extractionStartPoint, extractionEndPoint);

    logger.info({
      message: 'Section extraction result',
      hasExtractedSection: !!extractedSection,
      extractedSectionLength: extractedSection?.length || 0,
      extractedSectionPreview:
        extractedSection?.substring(0, 200) + (extractedSection && extractedSection.length > 200 ? '...' : ''),
    });

    // [ERROR] 추출된 섹션이 없을 경우 에러를 발생시킵니다.
    if (!extractedSection) {
      logger.error({
        message: 'Could not find the section to extract',
        extractionStartPoint,
        extractionEndPoint,
        bodyLength: body.length,
      });
      return;
    }

    // 머지가 되지 않았더라면, 실행 시키지 않습니다.
    logger.info({
      message: 'Validating merge status...',
      merge_commit_sha,
      hasMergeCommitSha: !!merge_commit_sha,
    });

    if (!merge_commit_sha) {
      logger.error({ message: `PR #${pullRequestNumber} - This Pull Request was not merged` });
      return;
    }

    // 머지 커밋과 deploy sha 와 같지 않으면 실행 시키지 않습니다.
    logger.info({
      message: 'Comparing commit SHAs...',
      merge_commit_sha,
      deployCommitSha,
      isMatching: merge_commit_sha === deployCommitSha,
    });

    if (merge_commit_sha !== deployCommitSha) {
      logger.error({
        message: 'Merge commit SHA does not match deployment SHA',
        merge_commit_sha,
        deployCommitSha,
      });
      return;
    }

    /**
     * 상위에서 merge_commit_sha 와 deployCommitSha 가 같은지 확인하였으므로, deployCommitSha 는 무조건 존재합니다.
     * 중복된 값이 2개 이상이라면 이미 배포알림이 진행되었으므로, 실행하지 않습니다.
     * **/
    logger.info({ message: 'Checking for duplicate deployment...' });
    const hasSameAsDeployment = await checkHasSameAsDeployment({ token });

    logger.info({
      message: 'Duplicate deployment check result',
      isError: hasSameAsDeployment.isError,
      isSameAsDeployment: hasSameAsDeployment.isSameAsDeployment,
    });

    if (hasSameAsDeployment.isError) {
      logger.error({ message: 'Failed to check deployment status' });
      return;
    }

    if (hasSameAsDeployment.isSameAsDeployment) {
      logger.error({
        message: 'Notification for this deployment has already been processed',
        merge_commit_sha,
        deployCommitSha,
      });
      return;
    }

    logger.info({ message: 'Parsing project configuration...' });
    const parsedProjectConfig = safeJsonParse<ProjectConfig[]>(projectConfig);

    if (!parsedProjectConfig) {
      logger.error({
        message: 'JSON parsing error occurred, please check the projectConfig input',
        projectConfig,
        projectConfigType: typeof projectConfig,
      });
      return;
    }

    logger.info({
      message: 'Project configuration parsed successfully',
      configCount: parsedProjectConfig.length,
      configs: parsedProjectConfig.map((config) => ({
        projectName: config.projectName,
        stage: config.stage,
        triggerBranch: config.triggerBranch,
        successReleaseTitle: config.successReleaseTitle,
        failedReleaseTitle: config.failedReleaseTitle,
      })),
    });

    logger.info({
      message: 'Finding matching project configuration...',
      commitSha: merge_commit_sha,
      baseBranchName,
      availableConfigsCount: parsedProjectConfig.length,
    });

    const matchedProject = await findMatchedProjectConfig({
      token,
      parsedProjectConfig,
      commitSha: merge_commit_sha,
      baseBranchName,
    });

    logger.info({
      message: 'Matching project result',
      hasMatchedProject: !!matchedProject,
      matchedProject: matchedProject
        ? {
            projectName: matchedProject.projectName,
            stage: matchedProject.stage,
            triggerBranch: matchedProject.triggerBranch,
            successReleaseTitle: matchedProject.successReleaseTitle,
            failedReleaseTitle: matchedProject.failedReleaseTitle,
          }
        : null,
    });

    // [INFO] 해당 프로젝트 설정이 없을 경우 종료합니다.
    if (!matchedProject) {
      logger.error({
        message: 'No matching condition found in the project settings',
        baseBranchName,
        commitSha: merge_commit_sha,
        availableConfigs: parsedProjectConfig.length,
      });
      return;
    }

    const {
      issue: { number },
    } = getGithubContext();

    logger.info({
      message: 'GitHub Context information',
      issueNumber: number,
    });

    const safeAssignees = assignees?.map((assignee) => assignee.login) ?? [];
    const pullRequestOwner = [...new Set([user?.login, ...safeAssignees])].join(', ');

    logger.info({
      message: 'Pull Request owner information',
      user: user?.login,
      assignees: safeAssignees,
      pullRequestOwner,
    });

    const pullRequestInformation = {
      title: title,
      url: html_url,
      number: number ?? pullRequestNumber,
      owner: pullRequestOwner,
      baseBranchName: baseBranchName,
    };

    logger.info({
      message: 'Pull Request information summary',
      pullRequestInformation,
    });

    // [INFO] 배포 상태가 DEPLOY_ERROR_STATUS_LIST 에 해당 되는 경우 배포 실패 메시지를 보내고 종료합니다.
    const isFailureStatus = DEPLOY_ERROR_STATUS_LIST.includes(deploymentStatus);

    logger.info({
      message: 'Final deployment status check',
      deploymentStatus,
      isFailureStatus,
      isSuccessStatus: DEPLOY_SUCCEED_STATUS_LIST.includes(deploymentStatus),
    });

    if (isFailureStatus) {
      logger.info({ message: `Deployment failed. Status: ${deploymentStatus}` });

      try {
        logger.info({
          message: 'Sending failure notification to Slack...',
          webhookURL: slackWebhookURL,
          titleMessage: matchedProject.failedReleaseTitle,
        });

        await sendSlackMessage({
          webhookURL: slackWebhookURL,
          payload: buildSlackMessage({
            titleMessage: matchedProject.failedReleaseTitle,
            pullRequest: pullRequestInformation,
            deployStatus: 'fail',
          }),
        });

        logger.info({ message: 'Failure notification sent to Slack successfully' });
      } catch (error) {
        logger.error({
          message: 'Failed to send failure notification to Slack',
          error: (error as Error).message,
          errorStack: (error as Error).stack,
        });
      }

      return;
    }

    logger.info({ message: 'Parsing AutoLink configuration...' });
    const parsedAutoLinkConfig = (autoLinkConfig ? safeJsonParse<AutoLink[]>(autoLinkConfig) : []) ?? [];

    logger.info({
      message: 'AutoLink configuration parsed successfully',
      hasAutoLinkConfig: !!autoLinkConfig,
      parsedAutoLinkCount: parsedAutoLinkConfig.length,
      parsedAutoLinkConfig: autoLinkConfig ? parsedAutoLinkConfig : 'AutoLinkConfig not provided',
    });

    try {
      // [INFO] Slack 성공 메시지를 보냅니다.
      logger.info({
        message: 'Sending success notification to Slack...',
        webhookURL: slackWebhookURL,
        titleMessage: matchedProject.successReleaseTitle,
        extractedSectionLength: extractedSection.length,
        autoLinkConfigCount: parsedAutoLinkConfig.length,
      });

      const autoLinkedContent = buildAutoLink(extractedSection, parsedAutoLinkConfig);
      const slackFormattedContent = githubToSlack(autoLinkedContent);

      logger.info({
        message: 'Message content processing completed',
        originalLength: extractedSection.length,
        autoLinkedLength: autoLinkedContent.length,
        slackFormattedLength: slackFormattedContent.length,
        autoLinkedPreview: autoLinkedContent.substring(0, 200) + (autoLinkedContent.length > 200 ? '...' : ''),
      });

      await sendSlackMessage({
        webhookURL: slackWebhookURL,
        payload: buildSlackMessage({
          titleMessage: matchedProject.successReleaseTitle,
          pullRequest: {
            ...pullRequestInformation,
            body: slackFormattedContent,
          },
        }),
      });

      logger.info({ message: `Success notification sent to Slack successfully: ${slackWebhookURL}` });
    } catch (error) {
      logger.error({
        message: 'Failed to send success notification to Slack',
        error: (error as Error).message,
        errorStack: (error as Error).stack,
        webhookURL: slackWebhookURL,
      });
    }

    logger.info({ message: 'Release Notification Action completed successfully' });
  } catch (error) {
    logger.error({
      message: 'Critical error occurred during Action execution',
      error: (error as Error).message,
      errorStack: (error as Error).stack,
      errorName: (error as Error).name,
    });
    logger.setFailed(`Action failed: ${(error as Error).message}`);
  }
};

run();

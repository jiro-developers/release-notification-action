import * as core from '@actions/core';
import { githubToSlack } from '@atomist/slack-messages';

import { ACTION_REQUIRED_INPUT_KEY } from './constants/common';
import { extractSection } from './utils/extractSection';
import { getGithubContext } from './utils/github/getGithubContext';
import { getPullRequestInfo } from './utils/github/getPullRequestInfo';
import { getPullRequestNumber } from './utils/github/getPullRequestNumber';
import { buildSlackMessage } from './utils/slack/buildSlackMessage';
import { sendSlackMessage } from './utils/slack/sendSlackMessage';

const run = async (): Promise<void> => {
  try {
    core.info('Start to run the action.');

    const {
      issue: { number, repo },
    } = getGithubContext();

    // [INFO] 해당 워크플로우에 필요한 인풋을 가져옵니다.
    const token = core.getInput('token');
    const extractionPoint = core.getInput('extractionPoint');
    const slackWebhookURL = core.getInput('slackWebhookURL');

    // [ERROR] ACTION_REQUIRED_INPUT_KEY 에 해당하는 인풋이 없을 경우 에러를 발생시킵니다.
    if (!token || !extractionPoint || !slackWebhookURL) {
      const missingInputs = ACTION_REQUIRED_INPUT_KEY.filter((input) => !core.getInput(input));
      core.error(`Missing required inputs: ${missingInputs.join(', ')}`);
      return;
    }

    const pullRequestNumber = await getPullRequestNumber(token);

    if (!pullRequestNumber) {
      core.error('No PR number found.');
      return;
    }

    // [INFO] 해당 PR의 정보를 가져옵니다.
    const pullRequestInfo = await getPullRequestInfo(token, pullRequestNumber);

    if (!pullRequestInfo) {
      core.error('No PR data found.');
      return;
    }

    const {
      title,
      body,
      html_url,
      head,
      user,
      assignees,
      base: { ref: baseBranchName },
    } = pullRequestInfo;
    const repositoryName = repo ?? head.repo?.name;
    const pullRequestOwner = assignees?.map((assignee) => assignee.login).join(', ') ?? user.login;

    // [ERROR] PR의 body가 없을 경우 에러를 발생시킵니다.
    if (!body) {
      core.error('No body provided.');
      return;
    }

    // [INFO] PR의 body에서 divideSection에 해당하는 섹션을 추출합니다.
    const extractedSection = extractSection(body, extractionPoint);

    // [ERROR] 추출된 섹션이 없을 경우 에러를 발생시킵니다.
    if (!extractedSection) {
      core.error('No section found.');
      return;
    }

    // [INFO] Slack 메시지를 보냅니다.
    await sendSlackMessage({
      webhookUrl: slackWebhookURL,
      payload: buildSlackMessage({
        repositoryName,
        pullRequestInformation: {
          pullRequestTitle: title,
          pullRequestURL: html_url,
          pullRequestNumber: number ?? pullRequestNumber,
          pullRequestBody: githubToSlack(extractedSection),
          pullRequestOwner: pullRequestOwner,
          pullRequestBaseBranchName: baseBranchName,
        },
      }),
    });
  } catch (error) {
    core.setFailed(`Action failed: ${(error as Error).message}`);
  }
};

run();

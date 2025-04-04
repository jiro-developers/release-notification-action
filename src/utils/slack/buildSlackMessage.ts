import { escape, url, user } from '@atomist/slack-messages';
import type { TextObject } from '@slack/types';
import type { IncomingWebhookSendArguments as SlackMessagePayload } from '@slack/webhook';

import { MAX_LENGTH_OF_SLACK_MESSAGE } from '@/constants/common';

interface BuildSlackMessageProps {
  pullRequest: {
    title: string;
    url: string;
    number: number;
    body?: string | null;
    owner: string;
    baseBranchName: string;
  };
  titleMessage: string;
  deployStatus?: 'success' | 'fail';
}

const buildSlackMessage = ({
  pullRequest: { title, url: pullRequestURL, number, body, owner, baseBranchName },
  titleMessage,
  deployStatus = 'success',
}: BuildSlackMessageProps): SlackMessagePayload => {
  const fields: TextObject[] = [
    {
      type: 'mrkdwn',
      text: `*merge 된 브랜치:* ${baseBranchName}`,
    },
    {
      type: 'mrkdwn',
      text: `*PR 담당자:* ${user(owner)}`,
    },
  ];

  const blocks: SlackMessagePayload['blocks'] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: titleMessage,
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      fields,
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: url(pullRequestURL, `${escape(title)} - #${number}`),
      },
    },
  ];

  // PR의 body가 존재하고 deployStatus 가 success 인 경우 body를 추가합니다.
  if (deployStatus === 'success' && body) {
    blocks.push(
      { type: 'divider' },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: body.slice(0, MAX_LENGTH_OF_SLACK_MESSAGE) },
      }
    );
  }

  return {
    username: 'ReleaseNotesBot',
    icon_emoji: ':dropshot:',
    text: titleMessage,
    blocks: blocks,
  };
};

export type { SlackMessagePayload, BuildSlackMessageProps };
export { buildSlackMessage };

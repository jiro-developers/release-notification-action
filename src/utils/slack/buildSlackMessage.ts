import { escape, url, user } from '@atomist/slack-messages';
import type { TextObject } from '@slack/types';
import type { AnyBlock } from '@slack/types/dist/block-kit/blocks';
import type { IncomingWebhookSendArguments as SlackMessagePayload } from '@slack/webhook';

import { buildAttachmentBlockList } from '@/utils/slack/buildAttachmentBlockList';

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
  const attachmentBlockList: AnyBlock[] = [];
  const fieldList: TextObject[] = [
    {
      type: 'mrkdwn',
      text: `*merge 된 브랜치:* ${baseBranchName}`,
    },
    {
      type: 'mrkdwn',
      text: `*PR 담당자:* ${user(owner)}`,
    },
  ];

  const blockList: SlackMessagePayload['blocks'] = [
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
      fields: fieldList,
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
    blockList.push({ type: 'divider' });
    attachmentBlockList.push(...buildAttachmentBlockList(body));
  }

  return {
    username: 'ReleaseNotesBot',
    icon_emoji: ':dropshot:',
    text: titleMessage,
    blocks: blockList,
    attachments: [
      {
        blocks: attachmentBlockList,
      },
    ],
  };
};

export type { SlackMessagePayload, BuildSlackMessageProps };
export { buildSlackMessage };

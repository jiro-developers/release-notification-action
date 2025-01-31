import type { DividerBlock, SectionBlock, TextObject } from '@atomist/slack-messages/lib/SlackMessages';

type Blocks = SectionBlock | DividerBlock;

type SlackMessagePayload = {
  text: string;
  username?: string;
  icon_emoji?: string;
  blocks: Blocks[];
};

interface BuildSlackMessageProps {
  pullRequest: {
    title: string;
    url: string;
    number: number;
    body?: string | null;
    owner: string;
    baseBranchName: string;
  };
  repositoryName: string;
  deployStatus?: 'success' | 'fail';
}

const buildSlackMessage = ({
  pullRequest: { title, url, number, body, owner, baseBranchName },
  repositoryName,
  deployStatus = 'success',
}: BuildSlackMessageProps): SlackMessagePayload => {
  const deployStatusMessage = deployStatus === 'fail' ? '실패' : '완료';
  const titleMessage = `${repositoryName}에서 배포가 ${deployStatusMessage}되었습니다.`;

  const fields: TextObject[] = [
    { type: 'mrkdwn', text: `*PR 담당자*:\n\n${owner}` },
    { type: 'mrkdwn', text: `*merge 된 브랜치*:\n\n${baseBranchName}` },
    { type: 'mrkdwn', text: `*PR*:\n\n<${url}|${title} - #${number}>` },
  ];

  const blocks: Blocks[] = [
    {
      type: 'section',
      text: { type: 'mrkdwn', text: titleMessage },
      fields,
    },
  ];

  // PR의 body가 존재하고 deployStatus 가 success 인 경우 body를 추가합니다.
  if (deployStatus === 'success' && body) {
    blocks.push(
      { type: 'divider' },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: body.slice(0, 4_000) },
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

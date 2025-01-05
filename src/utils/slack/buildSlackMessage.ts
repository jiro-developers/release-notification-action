type MarkdownText = {
  type: 'mrkdwn';
  text: string;
};

type SlackMessageBlock =
  | {
      type: 'section';
      text: MarkdownText;
      fields?: MarkdownText[];
    }
  | {
      type: 'divider';
    };

type SlackMessagePayload = {
  text: string;
  username?: string;
  icon_emoji?: string;
  blocks: SlackMessageBlock[];
};

interface BuildSlackMessageProps {
  pullRequestInformation: {
    pullRequestTitle: string;
    pullRequestURL: string;
    pullRequestNumber: number;
    pullRequestBody: string;
    pullRequestOwner: string;
    pullRequestBaseBranchName: string;
  };
  repositoryName: string;
}

const buildSlackMessage = ({
  pullRequestInformation: {
    pullRequestTitle,
    pullRequestURL,
    pullRequestNumber,
    pullRequestBody,
    pullRequestOwner,
    pullRequestBaseBranchName,
  },
  repositoryName,
}: BuildSlackMessageProps): SlackMessagePayload => {
  const fields: MarkdownText[] = [
    { type: 'mrkdwn', text: `*PR 담당자*:\n\n${pullRequestOwner}` },
    { type: 'mrkdwn', text: `*merge 된 브랜치 *:\n\n${pullRequestBaseBranchName}` },
    { type: 'mrkdwn', text: `*PR*:\n\n<${pullRequestURL}|${pullRequestTitle} - #${pullRequestNumber}>` },
  ];

  const titleMessage = `${repositoryName}에서 새롭게 배포가 완료되었습니다.`;

  return {
    text: titleMessage,
    username: 'ReleaseNotesBot',
    icon_emoji: ':dropshot:',
    blocks: [
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*${titleMessage}*` },
        fields,
      },
      { type: 'divider' },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: pullRequestBody },
      },
    ],
  };
};

export type { SlackMessagePayload, BuildSlackMessageProps };
export { buildSlackMessage };

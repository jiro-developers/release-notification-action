import * as core from '@actions/core';

import type { SlackMessagePayload } from './buildSlackMessage';

interface SendSlackMessageProps {
  webhookUrl: string;
  payload: SlackMessagePayload;
}
const sendSlackMessage = async ({ webhookUrl, payload }: SendSlackMessageProps) => {
  core.info(`Sending a message to Slack...${webhookUrl}`);

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorMessage = `status: ${response.status}`;
    throw new Error(errorMessage);
  }
};

export { sendSlackMessage };

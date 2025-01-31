import * as core from '@actions/core';

import type { SlackMessagePayload } from './buildSlackMessage';

interface SendSlackMessageProps {
  webhookURL: string;
  payload: SlackMessagePayload;
}
const sendSlackMessage = async ({ webhookURL, payload }: SendSlackMessageProps) => {
  core.info(`Sending a message to Slack...${webhookURL}`);

  const response = await fetch(webhookURL, {
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

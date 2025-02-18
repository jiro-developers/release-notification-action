import type { SlackMessagePayload } from './buildSlackMessage';

import { logger } from '@/utils/github/logger';

interface SendSlackMessageProps {
  webhookURL: string;
  payload: SlackMessagePayload;
}
const sendSlackMessage = async ({ webhookURL, payload }: SendSlackMessageProps) => {
  logger.info(`Sending a message to Slack...${webhookURL}`);

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

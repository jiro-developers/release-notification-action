import { IncomingWebhook } from '@slack/webhook';

import type { SlackMessagePayload } from './buildSlackMessage';

import { logger } from '@/utils/github/logger';

interface SendSlackMessageProps {
  webhookURL: string;
  payload: SlackMessagePayload;
}
const sendSlackMessage = async ({ webhookURL, payload }: SendSlackMessageProps) => {
  logger.info(`Sending a message to Slack...${webhookURL}`);
  const webhook = new IncomingWebhook(webhookURL);

  return await webhook.send(payload);
};

export { sendSlackMessage };

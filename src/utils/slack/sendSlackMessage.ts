import { IncomingWebhook } from '@slack/webhook';

import type { SlackMessagePayload } from './buildSlackMessage';

interface SendSlackMessageProps {
  webhookURL: string;
  payload: SlackMessagePayload;
}
const sendSlackMessage = async ({ webhookURL, payload }: SendSlackMessageProps) => {
  const webhook = new IncomingWebhook(webhookURL);

  return await webhook.send(payload);
};

export { sendSlackMessage };

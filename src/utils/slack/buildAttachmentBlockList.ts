import type { AnyBlock } from '@slack/types/dist/block-kit/blocks';

import { MAX_LENGTH_OF_SLACK_MESSAGE_FOR_ATTACHMENT } from '@/constants/common';
import { buildChunkListByText } from '@/utils/buildChunkListByText';

const buildAttachmentBlockList = (text: string): AnyBlock[] => {
  const builtChunkList = buildChunkListByText(text, MAX_LENGTH_OF_SLACK_MESSAGE_FOR_ATTACHMENT);

  return builtChunkList.map((text) => ({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text,
    },
  }));
};

export { buildAttachmentBlockList };

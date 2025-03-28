import type { AnyBlock } from '@slack/types/dist/block-kit/blocks';

import { MAX_ATTACHMENT_BLOCK_COUNT, MAX_LENGTH_OF_SLACK_MESSAGE_FOR_ATTACHMENT } from '@/constants/common';
import { buildChunkListByText } from '@/utils/buildChunkListByText';

const buildAttachmentBlockList = (text: string): AnyBlock[] => {
  const builtChunkList = buildChunkListByText(text, MAX_LENGTH_OF_SLACK_MESSAGE_FOR_ATTACHMENT);

  const builtAttachmentBlockList = builtChunkList.map((chunk) => ({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: chunk,
    },
  }));

  if (builtAttachmentBlockList.length <= MAX_ATTACHMENT_BLOCK_COUNT) {
    return builtAttachmentBlockList;
  }

  return builtAttachmentBlockList.slice(0, MAX_ATTACHMENT_BLOCK_COUNT);
};

export { buildAttachmentBlockList };

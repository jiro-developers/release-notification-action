import type { AnyBlock } from '@slack/types/dist/block-kit/blocks';

import { MAX_ATTACHMENT_BLOCK_COUNT, MAX_LENGTH_OF_SLACK_MESSAGE_FOR_ATTACHMENT } from '@/constants/common';
import { buildChunkListByText } from '@/utils/buildChunkListByText';

const buildAttachmentBlockList = (
  text: string
): {
  chunkedList: AnyBlock[];
  omittedList: AnyBlock[];
} => {
  const builtChunkList = buildChunkListByText(text, MAX_LENGTH_OF_SLACK_MESSAGE_FOR_ATTACHMENT);

  const builtAttachmentBlockList = builtChunkList.map((chunk) => ({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: chunk,
    },
  }));

  if (builtAttachmentBlockList.length <= MAX_ATTACHMENT_BLOCK_COUNT) {
    return {
      chunkedList: builtAttachmentBlockList,
      omittedList: [],
    };
  }

  return {
    chunkedList: builtAttachmentBlockList.slice(0, MAX_ATTACHMENT_BLOCK_COUNT),
    omittedList: builtAttachmentBlockList.slice(MAX_ATTACHMENT_BLOCK_COUNT, builtAttachmentBlockList.length),
  };
};

export { buildAttachmentBlockList };

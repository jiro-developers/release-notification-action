import { MAX_LENGTH_OF_SLACK_MESSAGE_FOR_ATTACHMENT } from '@/constants/common';

/**
 * 청크 사이즈에 따라 텍스트를 나누는 유틸리티 함수입니다.
 * 만약 청크 사이즈보다 작다면 그대로 반환합니다.
 * 청크 사이즈보다 크다면, 청크 사이즈에 맞게 텍스트를 나누어 반환합니다.
 * 청크 사이즈에 맞게 자른 뒤 재귀를 돌아 나누어 반환합니다.
 * **/
const buildChunkListByText = (
  text: string,
  maxChunkLength: number = MAX_LENGTH_OF_SLACK_MESSAGE_FOR_ATTACHMENT
): string[] => {
  if (!text) {
    return [];
  }

  const trimmedText = text.trim();

  const isTextShorterThanMaxLength = trimmedText.length <= maxChunkLength;
  if (isTextShorterThanMaxLength) {
    return [trimmedText];
  }

  const lastNewlineBeforeChunkLimit = trimmedText.lastIndexOf('\n', maxChunkLength);

  const chunkCutoffIndex = lastNewlineBeforeChunkLimit > 0 ? lastNewlineBeforeChunkLimit + 1 : maxChunkLength;

  return [
    trimmedText.slice(0, chunkCutoffIndex).trimEnd(),
    ...buildChunkListByText(trimmedText.slice(chunkCutoffIndex), maxChunkLength),
  ];
};

export { buildChunkListByText };

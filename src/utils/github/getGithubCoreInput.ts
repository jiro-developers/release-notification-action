import * as core from '@actions/core';

import { ACTION_INPUT_KEY_LIST, ACTION_REQUIRED_INPUT_KEY_LIST } from '@/constants/common';
import type { OptionalActionInputKey, RequiredActionInputKey } from '@/types';
import { logger } from '@/utils/github/logger';

const getGithubCoreInput = () => {
  const result = Object.fromEntries(ACTION_INPUT_KEY_LIST.map((key) => [key, core.getInput(key)]));

  logger.info(result);

  const missingInputKeyList = ACTION_REQUIRED_INPUT_KEY_LIST.filter((key) => !result[key]);

  if (missingInputKeyList.length) {
    logger.error(`Missing required inputs: ${missingInputKeyList.join(', ')}`);
    return null;
  }

  return result as {
    [key in RequiredActionInputKey]: string;
  } & {
    [key in OptionalActionInputKey]?: string;
  };
};

export { getGithubCoreInput };

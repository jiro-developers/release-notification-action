import * as core from '@actions/core';

import { ACTION_INPUT_KEY_LIST } from '@/constants/common';
import type { ActionInputKey, OptionalActionInputKey, RequiredActionInputKey } from '@/types';
import { logger } from '@/utils/github/logger';

const getGithubCoreInput = () => {
  const result = Object.fromEntries(ACTION_INPUT_KEY_LIST.map((key) => [key, core.getInput(key)])) as Record<
    ActionInputKey,
    string
  >;

  logger.info(result);

  const missingInputKeys = ACTION_INPUT_KEY_LIST.filter((key) => !result[key]);

  if (missingInputKeys.length) {
    logger.error(`Missing required inputs: ${missingInputKeys.join(', ')}`);
    return null;
  }

  return result as {
    [key in RequiredActionInputKey]: string;
  } & {
    [key in OptionalActionInputKey]?: string;
  };
};

export { getGithubCoreInput };

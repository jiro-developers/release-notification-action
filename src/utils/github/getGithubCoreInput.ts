import * as core from '@actions/core';

import { ACTION_INPUT_KEY_LIST } from '@/constants/common';
import { coreLogger } from '@/utils/github/coreLogger';

const getGithubCoreInput = () => {
  const result = Object.fromEntries(ACTION_INPUT_KEY_LIST.map((key) => [key, core.getInput(key)]));

  coreLogger.info(result);

  return result;
};

export { getGithubCoreInput };

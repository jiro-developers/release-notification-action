import * as core from '@actions/core';

import { ACTION_INPUT_KEY_LIST } from '@/constants/common';
import type { ProjectConfig } from '@/types';
import { safeJsonParse } from '@/utils/common';

const getGithubCoreInput = () => {
  const result = Object.fromEntries(ACTION_INPUT_KEY_LIST.map((key) => [key, core.getInput(key)]));

  core.info(JSON.stringify(result));

  return result;
};

const getProjectConfigFromInput = () => {
  const projectConfig = core.getInput('projectConfig');

  return safeJsonParse<ProjectConfig[]>(projectConfig);
};

export { getGithubCoreInput, getProjectConfigFromInput };

import * as github from '@actions/github';

/**
 * GitHub Context를 가져옵니다.
 * @returns Github Context
 */
const getGithubContext = () => github.context;

export { getGithubContext };

/**
 * 브랜치 이름을 추출합니다.
 * @param branchRef
 * @returns refs/heads/ 가 제거된 브랜치 이름
 */
const extractBranchName = (branchRef: string) => {
  return branchRef.replace('refs/heads/', '');
};

export { extractBranchName };

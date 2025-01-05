/**
 * @name extractSection
 * @description 정규식을 사용하여 특정 섹션을 추출하는 함수
 * @param input - 추출할 섹션을 포함한 전체 문자열
 * @param extractionPoint - 본문을 추출할 기점 해당 기점 문자열 ex) "## 리뷰 요약 정보"
 * **/
const extractSection = (input: string, extractionPoint: string): string | null => {
  const startIndex = input.indexOf(extractionPoint);

  return startIndex !== -1 ? input.slice(startIndex) : null;
};

export { extractSection };

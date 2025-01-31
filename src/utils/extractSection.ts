/**
 * @name extractSection
 * @description 정규식을 사용하여 특정 섹션을 추출하는 함수
 * @param input - 추출할 섹션을 포함한 전체 문자열
 * @param extractionStartPoint - 본문을 추출할 기점 해당 기점 문자열 ex) "## == 릴리즈 내용 시작 =="
 * @param extractionEndPoint - 본문을 추출할 종점 해당 종점 문자열 ex) "## == 릴리즈 내용 종료 =="
 * @returns 추출된 섹션 문자열 또는 null (섹션을 찾지 못한 경우)
 * **/
const extractSection = (input: string, extractionStartPoint: string, extractionEndPoint?: string): string | null => {
  // 시작점을 찾기 위해 정규식 사용
  const startRegex = new RegExp(`(${extractionStartPoint})`, 'g');
  const startMatch = startRegex.exec(input);

  // 시작점을 찾지 못한 경우 null 반환
  if (!startMatch) {
    return null;
  }

  // 시작점을 제외한 문자열을 반환하기 위해 시작점의 인덱스 계산
  const startIndex = startMatch.index + startMatch[0].length;

  // 종료점이 제공되지 않은 경우, 시작점부터 문자열 끝까지 반환
  if (!extractionEndPoint) {
    return input.slice(startIndex).trim();
  }

  // 종료점을 찾기 위해 정규식 사용
  const endRegex = new RegExp(`(${extractionEndPoint})`, 'g');
  const endMatch = endRegex.exec(input.slice(startIndex));

  // 종료점을 찾지 못한 경우 null 반환
  if (!endMatch) {
    return null;
  }

  const endIndex = startIndex + endMatch.index;

  return input.slice(startIndex, endIndex).trim();
};

export { extractSection };

interface AutoLink {
  targetURL: string;
  prefix: string;
}

/**
 * 상위에서 받게되는 text를 autoLinkConfig에 있는 prefix와 targetURL을 이용하여 마크다운 형식에 맞는 링크를 생성합니다.
 **/
const buildAutoLink = (text: string, autoLinkList: AutoLink[]): string => {
  return autoLinkList.reduce((updatedText, { prefix, targetURL }) => {
    // 이미 링크가 있는 패턴 (예: [DD-1234](http://example.com))
    const existingLinkPattern = `\\[${prefix}\\d+\\]\\([^)]+\\)`;

    // 링크로 변환할 수 있는 텍스트 패턴 (예: DD-1234)
    const linkableTextPattern = `${prefix}(\\d+)`;

    // 두 패턴을 모두 포함하는 정규식
    const autoLinkPattern = new RegExp(`(${existingLinkPattern})|(${linkableTextPattern})`, 'g');

    return updatedText.replace(autoLinkPattern, (match, existingLink, _, target) => {
      // 이미 링크가 있는 경우 그대로 반환
      if (existingLink) {
        return existingLink;
      }

      // 링크가 없는 경우 링크로 변환하여 반환
      return `[${prefix}${target}](${targetURL.replace('<target>', target)})`;
    });
  }, text);
};

export { buildAutoLink };
export type { AutoLink };

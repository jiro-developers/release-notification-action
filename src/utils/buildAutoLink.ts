interface AutoLink {
  targetURL: string;
  prefix: string;
}

/**
 * 상위에서 받게되는 text를 autoLinkConfig에 있는 prefix와 targetURL을 이용하여 마크다운 형식에 맞는 링크를 생성합니다.
 * **/
const buildAutoLink = (text: string, autoLinkList: AutoLink[]) => {
  return autoLinkList.reduce((updatedText, { prefix, targetURL }) => {
    const autoLinkPattern = new RegExp(`${prefix}(\\d+)`, 'g');

    return updatedText.replace(autoLinkPattern, (_, target) => {
      return `[${prefix}${target}](${targetURL.replace('<target>', target)})`;
    });
  }, text);
};

export { buildAutoLink };
export type { AutoLink };

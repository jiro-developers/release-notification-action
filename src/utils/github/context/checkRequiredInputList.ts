const checkRequiredInputList = (requiredInputList: string[]) => {
  return requiredInputList.some((input) => !input);
};

export { checkRequiredInputList };

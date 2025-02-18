import * as core from '@actions/core';

type Message = string | Record<string, unknown>;

const formatMessage = (value: unknown): string => {
  if (typeof value === 'object' && value !== null) {
    return Object.entries(value)
      .map(([key, nestedValue]) => `${key}: ${JSON.stringify(nestedValue, null, 2)}`)
      .join(',  \n');
  }

  return String(value);
};

const logger = {
  error: (message: Message, properties?: core.AnnotationProperties) => {
    core.error(formatMessage(message), properties);
  },
  info: (message: Message) => {
    core.info(formatMessage(message));
  },
  warning: (message: Message) => {
    core.warning(formatMessage(message));
  },
  setFailed: (message: Message) => {
    core.setFailed(formatMessage(message));
  },
};

export { logger };

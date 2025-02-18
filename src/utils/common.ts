const safeJsonParse = <T>(jsonString: string): T | null => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
};

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

const typedObjectEntries = <T extends object>(obj: T) => {
  return Object.entries(obj) as Entries<T>;
};

export { safeJsonParse, typedObjectEntries };

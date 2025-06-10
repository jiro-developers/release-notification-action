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

const chunk = <T>(array: T[], size: number): T[][] => {
  if (size <= 0) throw new Error('Size must be greater than 0');

  if (array.length === 0) return [];

  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, (index + 1) * size)
  );
};

export { safeJsonParse, typedObjectEntries, chunk };

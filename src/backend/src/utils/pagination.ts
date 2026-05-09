export const parsePositiveInt = (
  value: unknown,
  fallback: number,
  options?: { min?: number; max?: number },
): number => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  if (options?.min && parsed < options.min) {
    return options.min;
  }

  if (options?.max && parsed > options.max) {
    return options.max;
  }

  return parsed;
};

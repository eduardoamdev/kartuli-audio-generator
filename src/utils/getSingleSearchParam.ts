export const getSingleSearchParam = (
  value: string | string[] | undefined,
): string | null => {
  if (typeof value === "string") {
    return value;
  }

  return null;
};

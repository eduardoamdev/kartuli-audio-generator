import type { SearchParamValue } from "@/types/searchParams";

export const getSingleSearchParam = (
  value: SearchParamValue | undefined,
): string | null => {
  if (typeof value === "string") {
    return value;
  }

  return null;
};

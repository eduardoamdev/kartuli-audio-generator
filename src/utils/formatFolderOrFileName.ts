export const formatFolderOrFileName = (name: string): string =>
  name
    .replace(/\.json$/iu, "")
    .replace(/[-_]+/gu, " ")
    .trim()
    .split(/\s+/u)
    .filter(Boolean)
    .map((part) => part.charAt(0).toLocaleUpperCase() + part.slice(1))
    .join(" ");

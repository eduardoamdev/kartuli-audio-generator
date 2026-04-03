import { formatFolderOrFileName } from "./formatFolderOrFileName";

export const composePageTitle = (selectedFileName?: string | null): string =>
  selectedFileName
    ? `Words in ${formatFolderOrFileName(selectedFileName)}`
    : "";

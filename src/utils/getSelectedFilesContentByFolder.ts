import {
  getNamesOfDataFolders,
  getNamesOfFolderDataFiles,
} from "@/utils/getDataFoldersAndFiles";
import { readDataFile } from "@/utils/readDataFile";

import type { SupportedDataFile } from "@/types/data";

export type SelectedFilesByFolder = Record<string, string[]>;

export type SelectedFileContent = {
  fileName: string;
  content: SupportedDataFile;
};

export type SelectedFilesContentByFolder = Record<
  string,
  SelectedFileContent[]
>;

const getUniqueStringValues = (values: unknown): string[] => {
  if (!Array.isArray(values)) {
    return [];
  }

  return [
    ...new Set(
      values.filter((value): value is string => typeof value === "string"),
    ),
  ];
};

export const getSelectedFilesContentByFolder = async (
  selectedFilesByFolder: SelectedFilesByFolder,
): Promise<SelectedFilesContentByFolder> => {
  const folderNames = await getNamesOfDataFolders();

  const folderEntries = await Promise.all(
    folderNames.map(async (folderName) => {
      const availableFileNames = await getNamesOfFolderDataFiles(folderName);
      const selectedFileNames = getUniqueStringValues(
        selectedFilesByFolder[folderName],
      ).filter((fileName) => availableFileNames.includes(fileName));

      const selectedFiles = await Promise.all(
        selectedFileNames.map(async (fileName) => ({
          fileName,
          content: await readDataFile({
            folder: folderName,
            filename: fileName,
          }),
        })),
      );

      return [folderName, selectedFiles] as const;
    }),
  );

  return Object.fromEntries(folderEntries);
};

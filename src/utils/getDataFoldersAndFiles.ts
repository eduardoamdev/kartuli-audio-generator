import { readdir } from "node:fs/promises";
import path from "node:path";
import { DATA_DIRECTORY } from "@/utils/constants";

import type { DataNames } from "@/types/data";

export const getNamesOfFolderDataFiles = async (
  folderName: string,
): Promise<string[]> => {
  const folderPath = path.join(DATA_DIRECTORY, folderName);
  const folderEntries = await readdir(folderPath, { withFileTypes: true });

  return folderEntries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort();
};

export const getNamesOfDataFolders = async (): Promise<string[]> => {
  const dataEntries = await readdir(DATA_DIRECTORY, { withFileTypes: true });

  const folderNames = dataEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  return folderNames;
};

export const getNamesOfDataFoldersAndFiles = async (): Promise<DataNames> => {
  const folderNames = await getNamesOfDataFolders();

  const fileNamesByFolder = await Promise.all(
    folderNames.map((folderName) => getNamesOfFolderDataFiles(folderName)),
  );

  const fileNames = fileNamesByFolder.flat().sort();

  return {
    folderNames,
    fileNames,
  };
};

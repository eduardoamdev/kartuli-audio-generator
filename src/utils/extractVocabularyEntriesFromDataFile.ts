import { readDataFile } from "@/utils/readDataFile";

import type {
  DataFileRequest,
  VocabularyAndFunctionWordsData,
} from "@/types/data";

export const extractVocabularyEntriesFromDataFile = async (
  file: DataFileRequest,
): Promise<VocabularyAndFunctionWordsData> => {
  const parsedFileContent = await readDataFile(file);

  if (!Array.isArray(parsedFileContent)) {
    throw new Error("Expected a vocabulary or function-words data file.");
  }

  return parsedFileContent;
};

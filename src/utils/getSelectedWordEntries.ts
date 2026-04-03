import type { VocabularyAndFunctionWordsData } from "@/types/data";
import type { FilenameSearchParams } from "@/types/searchParams";
import { extractVocabularyEntriesFromDataFile } from "@/utils/extractVocabularyEntriesFromDataFile";
import { getNamesOfFolderDataFiles } from "@/utils/getDataFoldersAndFiles";
import { getSingleSearchParam } from "@/utils/getSingleSearchParam";

type GetSelectedWordEntriesOptions = {
  folder: string;
  searchParams: Promise<FilenameSearchParams>;
};

type SelectedWordEntries = {
  entries: VocabularyAndFunctionWordsData;
  selectedFileName: string | null;
};

export const getSelectedWordEntries = async ({
  folder,
  searchParams,
}: GetSelectedWordEntriesOptions): Promise<SelectedWordEntries> => {
  const [fileNames, resolvedSearchParams] = await Promise.all([
    getNamesOfFolderDataFiles(folder),
    searchParams,
  ]);

  const requestedFileName = getSingleSearchParam(resolvedSearchParams.filename);

  if (!requestedFileName || !fileNames.includes(requestedFileName)) {
    return {
      entries: [],
      selectedFileName: null,
    };
  }

  const entries = await extractVocabularyEntriesFromDataFile({
    folder,
    filename: requestedFileName,
  });

  return {
    entries,
    selectedFileName: requestedFileName,
  };
};

import type { SupportedDataFile } from "@/types/data";
import type { SelectedFilesContentByFolder } from "@/utils/getSelectedFilesContentByFolder";

const extractWordsFromDataFile = (dataFile: SupportedDataFile): string[] => {
  if (Array.isArray(dataFile)) {
    return dataFile
      .map((entry) => entry.ka)
      .filter((value): value is string => value.length > 0);
  }

  return Object.values(dataFile).flatMap((tense) =>
    Object.values(tense?.conjugation ?? {}).flatMap((person) =>
      typeof person?.ka === "string" && person.ka.length > 0 ? [person.ka] : [],
    ),
  );
};

export const buildSelectedWordsString = (
  selectedFilesContentByFolder: SelectedFilesContentByFolder,
): string =>
  Object.values(selectedFilesContentByFolder)
    .flatMap((selectedFiles) =>
      selectedFiles.flatMap(({ content }) => extractWordsFromDataFile(content)),
    )
    .join("\n");

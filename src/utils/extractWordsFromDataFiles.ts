import { readFile } from "node:fs/promises";
import path from "node:path";
import { DATA_DIRECTORY } from "@/utils/constants";
import { TEXT_FILE_ENCODING } from "@/utils/constants";

import type {
  DataTextInfo,
  VerbData,
  VerbTense,
  SupportedDataFile,
  DataFileRequest,
} from "@/types/data";

type LanguageCode = keyof DataTextInfo;

const extractWordsFromVerbTense = (
  tense: VerbTense,
  languageCode: LanguageCode,
) => [
  tense.name[languageCode],
  ...Object.values(tense.conjugation).map(
    (conjugation) => conjugation[languageCode],
  ),
];

const extractWordsFromVerbData = (
  verbData: VerbData,
  languageCode: LanguageCode,
) =>
  Object.values(verbData)
    .flatMap((tense) => extractWordsFromVerbTense(tense, languageCode))
    .filter((value): value is string => Boolean(value));

const extractWords = (
  parsedFileContent: SupportedDataFile,
  languageCode: LanguageCode,
) =>
  Array.isArray(parsedFileContent)
    ? parsedFileContent.map((entry) => entry[languageCode])
    : extractWordsFromVerbData(parsedFileContent, languageCode);

const readDataFile = async ({ folder, filename }: DataFileRequest) =>
  JSON.parse(
    await readFile(
      path.join(DATA_DIRECTORY, folder, filename),
      TEXT_FILE_ENCODING,
    ),
  ) as SupportedDataFile;

export const extractWordsFromDataFiles = async (
  files: DataFileRequest[],
  languageCode: LanguageCode = "ka",
): Promise<string[]> =>
  (await Promise.all(files.map(readDataFile))).flatMap((parsedFileContent) =>
    extractWords(parsedFileContent, languageCode),
  );

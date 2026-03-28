import { readFile } from "node:fs/promises";
import path from "node:path";
import { DATA_DIRECTORY } from "@/utils/constants";
import { TEXT_FILE_ENCODING } from "@/utils/constants";

import type {
  VerbData,
  VerbTense,
  SupportedDataFile,
  DataFileRequest,
} from "@/types/data";

const extractKaFromVerbTense = (tense: VerbTense) => [
  tense.name.ka,
  ...Object.values(tense.conjugation).map((conjugation) => conjugation.ka),
];

const extractKaFromVerbData = (verbData: VerbData) =>
  Object.values(verbData)
    .flatMap(extractKaFromVerbTense)
    .filter((value): value is string => Boolean(value));

const extractKaValues = (parsedFileContent: SupportedDataFile) =>
  Array.isArray(parsedFileContent)
    ? parsedFileContent.map((entry) => entry.ka)
    : extractKaFromVerbData(parsedFileContent);

const readDataFile = async ({ folder, filename }: DataFileRequest) =>
  JSON.parse(
    await readFile(
      path.join(DATA_DIRECTORY, folder, filename),
      TEXT_FILE_ENCODING,
    ),
  ) as SupportedDataFile;

export const extractKaValuesFromDataFiles = async (
  files: DataFileRequest[],
): Promise<string[]> =>
  (await Promise.all(files.map(readDataFile))).flatMap(extractKaValues);

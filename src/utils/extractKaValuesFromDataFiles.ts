import { readFile } from "node:fs/promises";
import path from "node:path";

const DATA_DIRECTORY = path.join(process.cwd(), "src", "data");

export type DataFileRequest = {
  folder: string;
  filename: string;
};

type JsonRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is JsonRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeFilename = (filename: string) =>
  filename.endsWith(".json") ? filename : `${filename}.json`;

const validateFolder = (folder: string) => {
  if (!/^[a-zA-Z0-9-]+$/.test(folder)) {
    throw new Error(`Invalid folder name: ${folder}`);
  }

  return folder;
};

const validateFilename = (filename: string) => {
  const normalizedFilename = normalizeFilename(filename);

  if (!/^[a-zA-Z0-9-]+\.json$/.test(normalizedFilename)) {
    throw new Error(`Invalid filename: ${filename}`);
  }

  return normalizedFilename;
};

const extractKaFromArrayEntries = (entries: unknown[]) =>
  entries.flatMap((entry) => {
    if (!isRecord(entry) || typeof entry.ka !== "string") {
      return [];
    }

    return [entry.ka];
  });

const extractKaFromNestedObject = (value: unknown): string[] => {
  if (!isRecord(value)) {
    return [];
  }

  const values = typeof value.ka === "string" ? [value.ka] : [];

  for (const nestedValue of Object.values(value)) {
    values.push(...extractKaFromNestedObject(nestedValue));
  }

  return values;
};

const extractKaValues = (parsedFileContent: unknown) => {
  if (Array.isArray(parsedFileContent)) {
    return extractKaFromArrayEntries(parsedFileContent);
  }

  if (isRecord(parsedFileContent)) {
    return extractKaFromNestedObject(parsedFileContent);
  }

  throw new Error("Unsupported JSON structure. Expected an array or object.");
};

const readDataFile = async ({ folder, filename }: DataFileRequest) => {
  const safeFolder = validateFolder(folder.trim());

  const safeFilename = validateFilename(filename.trim());

  const filePath = path.join(DATA_DIRECTORY, safeFolder, safeFilename);

  const fileContent = await readFile(filePath, "utf-8");

  return JSON.parse(fileContent) as unknown;
};

export const extractKaValuesFromDataFiles = async (
  files: DataFileRequest[],
) => {
  const valuesByFile = await Promise.all(
    files.map(async (fileInfo) =>
      extractKaValues(await readDataFile(fileInfo)),
    ),
  );

  return valuesByFile.flat();
};

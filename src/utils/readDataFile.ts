import { DATA_DIRECTORY } from "@/utils/constants";
import { TEXT_FILE_ENCODING } from "@/utils/constants";
import { readFile } from "node:fs/promises";
import path from "node:path";

import type { SupportedDataFile, DataFileRequest } from "@/types/data";

export const readDataFile = async ({
  folder,
  filename,
}: DataFileRequest): Promise<SupportedDataFile> =>
  JSON.parse(
    await readFile(
      path.join(DATA_DIRECTORY, folder, filename),
      TEXT_FILE_ENCODING,
    ),
  ) as SupportedDataFile;

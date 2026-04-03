import { NextResponse } from "next/server";

import {
  getNamesOfDataFolders,
  getNamesOfFolderDataFiles,
} from "@/utils/getDataFoldersAndFiles";

export const runtime = "nodejs";

export async function GET() {
  try {
    const folderNames = await getNamesOfDataFolders();
    const foldersWithFiles = await Promise.all(
      folderNames.map(async (folderName) => ({
        folderName,
        fileNames: await getNamesOfFolderDataFiles(folderName),
      })),
    );

    return NextResponse.json({ foldersWithFiles });
  } catch (error) {
    console.error("Failed to load audio generator data sources.", error);

    return NextResponse.json(
      { message: "Failed to load audio generator data sources." },
      { status: 500 },
    );
  }
}

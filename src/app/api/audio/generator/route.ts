import { NextResponse } from "next/server";

import { getSelectedFilesContentByFolder } from "@/utils/getSelectedFilesContentByFolder";
import { buildSelectedWordsString } from "../../../../utils/buildSelectedWordsString";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const selectedFilesContentByFolder = await getSelectedFilesContentByFolder(
      body.selectedFilesByFolder ?? {},
    );

    const selectedKaWordsString = buildSelectedWordsString(
      selectedFilesContentByFolder,
    );

    console.log("Selected ka words string:", selectedKaWordsString);

    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to process audio generation payload.", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process audio generation payload.",
      },
      { status: 500 },
    );
  }
}

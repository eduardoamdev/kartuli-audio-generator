import { NextResponse } from "next/server";

import { getSelectedFilesContentByFolder } from "@/utils/getSelectedFilesContentByFolder";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const selectedFilesContentByFolder = await getSelectedFilesContentByFolder(
      body.selectedFilesByFolder ?? {},
    );

    console.log(
      "Selected files content by folder:",
      selectedFilesContentByFolder,
    );

    return NextResponse.json(
      {
        success: true,
        info: body,
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

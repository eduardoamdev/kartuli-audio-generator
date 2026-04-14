import { NextResponse } from "next/server";

import { buildPrompt } from "@/prompts/audio";
import { callLLM } from "@/services/callLLM";
import { getSelectedFilesContentByFolder } from "@/utils/getSelectedFilesContentByFolder";
import { audioGeneratorTextValidator } from "@/utils/validators/audioGeneratorText";
import { buildSelectedWordsString } from "../../../../../utils/buildSelectedWordsString";

export async function POST(request: Request) {
  try {
    const parsedBody = audioGeneratorTextValidator(await request.json());

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid information provided for text generation.",
        },
        { status: 400 },
      );
    }

    const body = parsedBody.data;

    const selectedFilesContentByFolder = await getSelectedFilesContentByFolder(
      body.selectedFilesByFolder ?? {},
    );

    const selectedWordsString = buildSelectedWordsString(
      selectedFilesContentByFolder,
    );

    if (!selectedWordsString) {
      return NextResponse.json(
        {
          success: false,
          message: "No Georgian words found to generate the text.",
        },
        { status: 400 },
      );
    }

    const prompt = buildPrompt(
      selectedWordsString,
      body.age ?? "",
      body.level ?? "",
      body.details ?? "",
      body.typeOfSpeech,
    );

    const result = await callLLM(prompt);

    console.log("LLM response for text generation:", result);

    return NextResponse.json(
      {
        success: true,
        message: "Text generated successfully.",
        result,
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

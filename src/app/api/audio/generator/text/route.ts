import { NextResponse } from "next/server";

import { buildPrompt } from "@/prompts/audio";
import { callLLM } from "@/services/llm";
import { getSelectedFilesContentByFolder } from "@/utils/getSelectedFilesContentByFolder";
import { buildSelectedWordsString } from "../../../../../utils/buildSelectedWordsString";

type AudioGeneratorRequestBody = {
  age?: string;
  level?: string;
  details?: string;
  typeOfSpeech?: string;
  selectedFilesByFolder?: Record<string, string[]>;
};

const isValidSpeechType = (
  typeOfSpeech: string | undefined,
): typeOfSpeech is "dialogue" | "monologue" =>
  typeOfSpeech === "dialogue" || typeOfSpeech === "monologue";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AudioGeneratorRequestBody;

    if (!isValidSpeechType(body.typeOfSpeech)) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid type of speech is required.",
        },
        { status: 400 },
      );
    }

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
          message: "No Georgian words were extracted from the selected files.",
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

    return NextResponse.json(
      {
        success: true,
        message: JSON.stringify(result, null, 2),
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

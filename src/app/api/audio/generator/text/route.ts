import { NextResponse } from "next/server";

import { buildPrompt } from "@/prompts/audio";
import { callLLM } from "@/services/callLLM";
import type {
  GeneratedMessage,
  GeneratedTextResult,
} from "@/types/audioGenerator";
import { getSelectedFilesContentByFolder } from "@/utils/getSelectedFilesContentByFolder";
import { audioGeneratorTextValidator } from "@/utils/validators/audioGeneratorText";
import { buildSelectedWordsString } from "../../../../../utils/buildSelectedWordsString";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const formatGeneratedMessage = (
  message: GeneratedMessage | undefined,
): string => {
  if (!message) {
    return "";
  }

  return [message.ka, message.la, message.en]
    .filter(
      (value): value is string => typeof value === "string" && value.length > 0,
    )
    .join("\n\n");
};

const formatGeneratedTextResult = (result: unknown): string => {
  if (!isObject(result)) {
    return "";
  }

  const generatedResult = result as GeneratedTextResult;

  if (Array.isArray(generatedResult.conversation)) {
    return generatedResult.conversation
      .map((entry) => formatGeneratedMessage(entry.message))
      .filter((entry) => entry.length > 0)
      .join("\n\n\n");
  }

  if (isObject(generatedResult.monologue)) {
    return formatGeneratedMessage(generatedResult.monologue.message);
  }

  return "";
};

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
    const formattedText = formatGeneratedTextResult(result);

    return NextResponse.json(
      {
        success: true,
        message: formattedText || "Text generated successfully.",
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

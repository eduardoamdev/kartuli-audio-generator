import { NextResponse } from "next/server";
import { SPEECH_TYPES } from "@/utils/constants";

type SpeechType = (typeof SPEECH_TYPES)[keyof typeof SPEECH_TYPES];

type AudioGeneratorRequestBody = {
  age: string;
  level: string;
  typeOfSpeech: SpeechType;
  details: string;
  selectedFilesByFolder: Record<string, string[]>;
};

const isSpeechType = (value: unknown): value is SpeechType =>
  value === SPEECH_TYPES.dialogue || value === SPEECH_TYPES.monologue;

const isStringArrayRecord = (
  value: unknown,
): value is Record<string, string[]> => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return Object.values(value).every(
    (entry) =>
      Array.isArray(entry) && entry.every((item) => typeof item === "string"),
  );
};

const isAudioGeneratorRequestBody = (
  value: unknown,
): value is AudioGeneratorRequestBody => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<AudioGeneratorRequestBody>;

  return (
    typeof candidate.age === "string" &&
    typeof candidate.level === "string" &&
    isSpeechType(candidate.typeOfSpeech) &&
    typeof candidate.details === "string" &&
    isStringArrayRecord(candidate.selectedFilesByFolder)
  );
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;

    return NextResponse.json(
      {
        success: true,
        info: body,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to parse audio generation payload." },
      { status: 400 },
    );
  }
}

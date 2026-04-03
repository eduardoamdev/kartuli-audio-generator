import { NextResponse } from "next/server";

type AudioGeneratorRequestBody = {
  age: string;
  level: string;
  details: string;
  selectedFilesByFolder: Record<string, string[]>;
};

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
    typeof candidate.details === "string" &&
    isStringArrayRecord(candidate.selectedFilesByFolder)
  );
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;

    if (!isAudioGeneratorRequestBody(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid audio generation payload." },
        { status: 400 },
      );
    }

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

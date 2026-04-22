import { NextResponse } from "next/server";

import { generateMP3 } from "@/services/generateMP3";
import type { GeneratedTextResult } from "@/types/audioGenerator";

type AudioGeneratorMp3RequestBody = {
  result?: GeneratedTextResult;
};

const hasValidResultShape = (
  result: GeneratedTextResult | undefined,
): result is GeneratedTextResult => {
  return Boolean(
    result &&
    ((Array.isArray(result.conversation) && result.conversation.length > 0) ||
      result.monologue),
  );
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AudioGeneratorMp3RequestBody;

    if (!hasValidResultShape(body.result)) {
      return NextResponse.json(
        {
          success: false,
          message: "A generated dialogue or monologue result is required.",
        },
        { status: 400 },
      );
    }

    const mp3File = await generateMP3(body.result);
    const mp3ArrayBuffer = new ArrayBuffer(mp3File.byteLength);

    new Uint8Array(mp3ArrayBuffer).set(mp3File);

    return new NextResponse(mp3ArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'attachment; filename="audio-generator.mp3"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to process MP3 generation payload.", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to process MP3 generation payload.",
      },
      { status: 500 },
    );
  }
}

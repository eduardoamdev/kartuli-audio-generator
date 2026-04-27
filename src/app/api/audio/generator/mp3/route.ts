import { NextResponse } from "next/server";

import { generateMP3 } from "@/services/generateMP3";
import {
  audioGeneratorMp3Validator,
  type AudioGeneratorMp3RequestBody,
} from "@/utils/validators/audioGenerator/mp3";

export async function POST(request: Request) {
  try {
    const parsedBody = audioGeneratorMp3Validator(await request.json());

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A generated dialogue or monologue result with Georgian narration is required.",
        },
        { status: 400 },
      );
    }

    const body: AudioGeneratorMp3RequestBody = parsedBody.data;

    const mp3File = await generateMP3(body.result);

    return new NextResponse(mp3File, {
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

import { NextResponse } from "next/server";

import { generateMP3 } from "@/services/generateMP3";

export async function POST(request: Request) {
  try {
    const parsedBody = await request.json();

    const mp3File = await generateMP3(parsedBody.result.message);

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

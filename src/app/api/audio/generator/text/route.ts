import { NextResponse } from "next/server";
import { buildPrompt } from "@/prompts/audio";
import { callLLM } from "@/services/callLLM";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const prompt = buildPrompt(body ?? "");

    const result = await callLLM(prompt);

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

import { NextResponse } from "next/server";
import { buildPrompt } from "@/prompts/audio";
import { callLLM } from "@/services/callLLM";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("Received audio generation request with payload:", body);

    const prompt = buildPrompt(body ?? "");

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

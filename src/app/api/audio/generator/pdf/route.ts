import { NextResponse } from "next/server";

import { generatePDF } from "@/services/generatePDF";
import type { GeneratedTextResult } from "@/types/audioGenerator";

export const runtime = "nodejs";

type AudioGeneratorPdfRequestBody = {
  formattedText?: string;
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
    const body = (await request.json()) as AudioGeneratorPdfRequestBody;

    if (
      (typeof body.formattedText !== "string" || !body.formattedText.trim()) &&
      !hasValidResultShape(body.result)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "formattedText or a generated result is required.",
        },
        { status: 400 },
      );
    }

    const pdfFile = await generatePDF(body.formattedText ?? "", body.result);
    const pdfArrayBuffer = new ArrayBuffer(pdfFile.byteLength);

    new Uint8Array(pdfArrayBuffer).set(pdfFile);

    return new NextResponse(pdfArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="audio-generator.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to process PDF generation payload.", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process PDF generation payload.",
      },
      { status: 500 },
    );
  }
}

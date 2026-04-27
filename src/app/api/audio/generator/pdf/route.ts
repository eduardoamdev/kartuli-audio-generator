import { NextResponse } from "next/server";

import { generatePDF } from "@/services/generatePDF";
import {
  audioGeneratorPdfValidator,
  type AudioGeneratorPdfRequestBody,
} from "@/utils/validators/audioGenerator/pdf";

export async function POST(request: Request) {
  try {
    const parsedBody = audioGeneratorPdfValidator(await request.json());

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          success: false,
          message: "formattedText or a generated result is required.",
        },
        { status: 400 },
      );
    }

    const body: AudioGeneratorPdfRequestBody = parsedBody.data;

    const pdfFile = await generatePDF(body.formattedText ?? "", body.result);

    return new NextResponse(pdfFile, {
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

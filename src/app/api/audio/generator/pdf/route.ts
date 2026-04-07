import { NextResponse } from "next/server";

import { generatePDF } from "@/services/generatePDF";

export const runtime = "nodejs";

type AudioGeneratorPdfRequestBody = {
  formattedText?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AudioGeneratorPdfRequestBody;

    if (typeof body.formattedText !== "string" || !body.formattedText.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "formattedText is required.",
        },
        { status: 400 },
      );
    }

    console.log(
      "Received formattedText for PDF generation.",
      body.formattedText,
    );

    const pdfFile = await generatePDF(body.formattedText);
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

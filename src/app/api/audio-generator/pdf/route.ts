import { NextResponse } from "next/server";
import { generateAudioGeneratorPDF } from "@/services/generateAudioGeneratorPDF";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const pdfFile = await generateAudioGeneratorPDF(body);

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

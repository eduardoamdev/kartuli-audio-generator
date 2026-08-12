import { NextResponse } from "next/server";
import { generateVerbPDF } from "@/services/generateVerbPDF";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { verbName?: string };
    const verbName = typeof body?.verbName === "string" ? body.verbName : null;

    console.log("Verb PDF generator requested for:", verbName);

    if (!verbName) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing verbName in request body.",
        },
        { status: 400 },
      );
    }

    const pdfFile = await generateVerbPDF(verbName);
    const pdfBody = Buffer.from(pdfFile);

    return new NextResponse(pdfBody, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${verbName}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to process grammar pdf generation payload.", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to process grammar pdf generation payload.",
      },
      { status: 500 },
    );
  }
}

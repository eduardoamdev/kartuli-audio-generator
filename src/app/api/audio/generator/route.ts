import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;

    return NextResponse.json(
      {
        success: true,
        info: body,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to parse audio generation payload." },
      { status: 400 },
    );
  }
}

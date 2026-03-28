import { NextRequest, NextResponse } from "next/server";
import { generatePdf } from "@/lib/generate-pdf";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { markdown, type } = await req.json();

    if (!markdown || !type) {
      return NextResponse.json(
        { error: "markdown and type are required" },
        { status: 400 }
      );
    }

    if (type !== "cv" && type !== "cover_letter") {
      return NextResponse.json(
        { error: "type must be 'cv' or 'cover_letter'" },
        { status: 400 }
      );
    }

    const pdf = await generatePdf(markdown, type);
    const filename = type === "cv" ? "tailored-cv.pdf" : "cover-letter.pdf";

    return new NextResponse(pdf.buffer as ArrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("PDF export error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

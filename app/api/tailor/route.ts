import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPdf } from "@/lib/extract-pdf";
import { tailorApplication } from "@/lib/tailor-cv";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const jobDescription = formData.get("jobDescription") as string;
    const cvFile = formData.get("cv") as File | null;
    const cvText = formData.get("cvText") as string | null;

    if (!jobDescription?.trim()) {
      return NextResponse.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    let extractedCv: string;

    if (cvFile && cvFile.size > 0) {
      const buffer = Buffer.from(await cvFile.arrayBuffer());
      extractedCv = await extractTextFromPdf(buffer);
    } else if (cvText?.trim()) {
      extractedCv = cvText.trim();
    } else {
      return NextResponse.json(
        { error: "Please upload a CV file or paste your CV text" },
        { status: 400 }
      );
    }

    const result = await tailorApplication(extractedCv, jobDescription);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Tailor API error:", message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

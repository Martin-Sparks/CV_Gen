import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export interface TailoredApplication {
  tailored_cv: string;
  cover_letter: string;
}

const SYSTEM_PROMPT = `You are an expert CV and cover letter writer. Your job is to tailor a candidate's existing CV and write a targeted cover letter for a specific job description.

Rules:
- Do NOT invent experience, qualifications, or achievements that are not in the original CV
- Reorder and reframe existing experience to match the role's priorities
- Use keywords from the job description naturally
- Keep the CV in the same markdown structure as the original
- Write the cover letter in 3-4 concise paragraphs — compelling, specific, no generic openers
- Address the cover letter to a specific person if their name appears in the job description
- Match the seniority level implied by the job description
- Highlight measurable achievements where possible

Respond with valid JSON only, in this exact format:
{
  "tailored_cv": "...full markdown CV...",
  "cover_letter": "...full markdown cover letter..."
}`;

export async function tailorApplication(
  cvText: string,
  jobDescription: string
): Promise<TailoredApplication> {
  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Here is my CV:\n\n${cvText}\n\n---\n\nHere is the job description:\n\n${jobDescription}`,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  // Strip markdown code fences if Claude wrapped the JSON
  const raw = textBlock.text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();

  try {
    return JSON.parse(raw) as TailoredApplication;
  } catch {
    throw new Error("Failed to parse Claude response as JSON");
  }
}

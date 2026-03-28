@AGENTS.md

# CV Tailor — Claude Instructions

## Project Overview
A web app that lets users upload their CV and a job description, then uses Claude AI to generate a tailored CV and cover letter for download as PDFs.

## Tech Stack
- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **AI:** Anthropic SDK (`claude-sonnet-4-6`) via API routes
- **PDF Parsing:** `pdf-parse` (extract text from uploaded CV PDFs)
- **PDF Generation:** TBD — Puppeteer (server-side HTML → PDF) or `@react-pdf/renderer`
- **File Uploads:** `react-dropzone`
- **UI Components:** shadcn/ui (to be installed)
- **Auth:** TBD (Clerk or Supabase Auth — phase 2)
- **Storage:** TBD (S3 or Supabase Storage — phase 2)

## Project Structure
```
cv-tailor/
├── app/
│   ├── page.tsx              # Landing / upload page
│   ├── layout.tsx            # Root layout
│   └── api/
│       ├── tailor/
│       │   └── route.ts      # POST: receives CV text + JD, calls Claude, returns tailored markdown
│       └── export-pdf/
│           └── route.ts      # POST: renders tailored markdown → PDF download
├── components/
│   ├── UploadForm.tsx         # CV upload + JD paste form
│   ├── ResultPreview.tsx      # Preview tailored CV/cover letter markdown
│   └── DownloadButtons.tsx    # Trigger PDF export
├── lib/
│   ├── extract-pdf.ts         # pdf-parse wrapper
│   ├── tailor-cv.ts           # Claude API call logic
│   └── generate-pdf.ts        # PDF generation logic
├── styles/                    # CSS for PDF output styling
├── public/
├── CLAUDE.md                  # This file
└── package.json
```

## Core User Flow
1. User uploads CV (PDF or paste text) + pastes job description
2. App extracts text from PDF (server-side via `pdf-parse`)
3. API route calls Claude with CV text + JD → returns tailored CV markdown + cover letter markdown
4. User previews output in the browser
5. User clicks Download → PDFs generated server-side and returned

## Claude Prompt Strategy
- System prompt defines the tailoring rules (same logic as Career_claude project)
- User message includes: `[CV TEXT]` + `[JOB DESCRIPTION]`
- Response format: structured JSON with `tailored_cv` (markdown) and `cover_letter` (markdown) fields
- Model: `claude-sonnet-4-6`

## Key Conventions
- All API calls to Claude go through `lib/tailor-cv.ts` — never call the SDK directly from components
- PDF extraction happens server-side only (API route) — never expose raw file handling client-side
- Use absolute imports via `@/*` alias

## Environment Variables
```
ANTHROPIC_API_KEY=sk-...
```
Add to `.env.local` (never commit this file).

---

## Build Status

### Phase 1 — Foundation (current)
- [x] Project scaffolded (Next.js 14, TypeScript, Tailwind)
- [x] Core dependencies installed (`@anthropic-ai/sdk`, `pdf-parse`, `react-dropzone`)
- [ ] shadcn/ui installed and configured
- [ ] `.env.local` set up with `ANTHROPIC_API_KEY`
- [ ] `lib/extract-pdf.ts` — PDF text extraction utility
- [ ] `lib/tailor-cv.ts` — Claude tailoring logic
- [ ] `app/api/tailor/route.ts` — API route
- [ ] `components/UploadForm.tsx` — upload UI
- [ ] `components/ResultPreview.tsx` — output preview
- [ ] PDF export (Puppeteer or react-pdf)

### Phase 2 — Polish & Launch
- [ ] Auth (Clerk or Supabase)
- [ ] Usage limits / monetisation (Stripe)
- [ ] File storage (S3 / Supabase)
- [ ] iOS wrapper (Capacitor)

---

## Last Updated
2026-03-28 — Project scaffolded, dependencies installed, CLAUDE.md written.

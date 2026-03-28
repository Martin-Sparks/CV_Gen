@AGENTS.md

# CV Tailor — Claude Instructions

## Project Overview
A web app that lets users upload their CV and a job description, then uses Claude AI to generate a tailored CV and cover letter, rendered in a styled preview matching the original CV's visual style.

## Tech Stack
- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **AI:** Anthropic SDK (`claude-opus-4-6`) via API routes
- **PDF Parsing:** `pdf-parse` v2 (server-side, declared in `serverExternalPackages`)
- **Markdown Rendering:** `react-markdown` with custom component overrides
- **File Uploads:** `react-dropzone`
- **Auth:** TBD — Clerk (phase 2)
- **Database:** TBD — Supabase (phase 2)
- **Payments:** TBD — Stripe (phase 2)

## Project Structure
```
cv-tailor/
├── app/
│   ├── page.tsx                  # Main upload + results page (client component)
│   ├── layout.tsx                # Root layout
│   └── api/
│       └── tailor/
│           └── route.ts          # POST: extract PDF → call Claude → return JSON
├── components/
│   ├── UploadForm.tsx            # CV upload (PDF drag-drop or paste) + JD input
│   ├── ResultPreview.tsx         # Tabbed CV / cover letter output (Preview + Markdown tabs)
│   ├── CVPreview.tsx             # Styled markdown renderer matching blue banner CV style
│   └── ui/                       # shadcn/ui primitives
├── lib/
│   ├── extract-pdf.ts            # pdf-parse wrapper (Buffer → string)
│   ├── tailor-cv.ts              # Claude API call, system prompt, JSON parsing
│   └── utils.ts                  # shadcn cn() helper
├── CLAUDE.md                     # This file
└── package.json
```

## Core User Flow
1. User uploads CV (PDF drag-drop or paste text) + pastes job description
2. POST `/api/tailor` — extracts PDF text server-side, calls Claude, returns `{tailored_cv, cover_letter}` JSON
3. `ResultPreview` renders output in tabbed view (CV / Cover Letter)
4. Each tab has **Preview** (styled with blue banner template) and **Markdown** (raw, copyable) sub-tabs

## Claude Prompt Strategy
- Model: `claude-opus-4-6`
- System prompt instructs Claude to tailor without inventing experience, use JD keywords, preserve markdown structure
- Response must be JSON: `{ "tailored_cv": "...", "cover_letter": "..." }`
- Code fence stripping applied before `JSON.parse()` as a safety measure

## CV Preview Style (Blue Banner Template)
Matches `Career_claude/styles/cv.css` exactly:
- `h1` → blue banner (`#BECEE8`), uppercase, tracked name
- First `h2` after `h1` → role subtitle, still in blue banner
- First `p` after banner → white contact strip with bottom border (`#c5d0d8`)
- Subsequent `h2` → section headings, uppercase, top border
- `h3` → company/institution name
- `h4` → date/role line
- Body text: `#8A9898`, background: `#f4f6f8`

## Key Conventions
- All Claude API calls go through `lib/tailor-cv.ts` only
- `pdf-parse` runs server-side only — listed in `next.config.ts` `serverExternalPackages`
- Dev server runs with Turbopack (default): `npm run dev`
- Use absolute imports via `@/*` alias

## Environment Variables
```
ANTHROPIC_API_KEY=sk-ant-...
```
Add to `.env.local` — never commit.

---

## Build Status

### Phase 1 — Core MVP ✅ Complete
- [x] Project scaffolded (Next.js 16, TypeScript, Tailwind, shadcn/ui)
- [x] Core dependencies: `@anthropic-ai/sdk`, `pdf-parse`, `react-dropzone`, `react-markdown`
- [x] `.env.local` configured with `ANTHROPIC_API_KEY`
- [x] `lib/extract-pdf.ts` — PDF text extraction
- [x] `lib/tailor-cv.ts` — Claude tailoring logic
- [x] `app/api/tailor/route.ts` — API route
- [x] `components/UploadForm.tsx` — PDF upload + paste + JD input
- [x] `components/ResultPreview.tsx` — tabbed Preview/Markdown output
- [x] `components/CVPreview.tsx` — styled blue banner CV renderer

### Phase 2 — Next Features (priority order)
- [ ] **PDF export** — download tailored CV + cover letter as styled PDFs
- [ ] **Auth** — sign in with Google via Clerk
- [ ] **CV history** — save all generated applications per user (Supabase)
- [ ] **Style picker** — choose CV template (blue banner, minimal, classic)
- [ ] **Usage limits + billing** — free tier + Stripe for unlimited access

### Phase 3 — Growth
- [ ] Application tracker (track job applications with status)
- [ ] Email delivery of generated documents
- [ ] iOS app wrapper (Capacitor)

---

## Last Updated
2026-03-28 — Phase 1 complete. Core tailoring flow working end-to-end.

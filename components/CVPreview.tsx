"use client";

import ReactMarkdown from "react-markdown";

interface CVPreviewProps {
  content: string;
}

export function CVPreview({ content }: CVPreviewProps) {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-10 max-h-[700px] overflow-auto">
      <div className="cv-body max-w-[680px] mx-auto">
        <ReactMarkdown
          components={{
            // H1 — candidate name
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 text-center mb-1">
                {children}
              </h1>
            ),
            // H2 — section headings (Experience, Education, Skills etc.)
            h2: ({ children }) => (
              <div className="mt-6 mb-2">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  {children}
                </h2>
                <hr className="mt-1 border-gray-200" />
              </div>
            ),
            // H3 — job title / company
            h3: ({ children }) => (
              <h3 className="text-sm font-semibold text-gray-900 mt-3">
                {children}
              </h3>
            ),
            // H4 — dates / location sub-line
            h4: ({ children }) => (
              <h4 className="text-xs text-gray-500 mb-1">{children}</h4>
            ),
            // Paragraphs — contact line, summary etc.
            p: ({ children }) => (
              <p className="text-sm text-gray-700 leading-relaxed text-center mb-2 first:mt-1">
                {children}
              </p>
            ),
            // Bullet points — achievements
            ul: ({ children }) => (
              <ul className="mt-1 mb-2 space-y-0.5">{children}</ul>
            ),
            li: ({ children }) => (
              <li className="text-sm text-gray-700 leading-relaxed flex gap-2">
                <span className="text-gray-400 mt-0.5 shrink-0">·</span>
                <span>{children}</span>
              </li>
            ),
            // Bold — company names, tech stack
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-900">{children}</strong>
            ),
            // Horizontal rule — section separator fallback
            hr: () => <hr className="my-4 border-gray-100" />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

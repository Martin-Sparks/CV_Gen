"use client";

import ReactMarkdown from "react-markdown";

interface CVPreviewProps {
  content: string;
}

// Tracks rendering state so we can style h2 differently when it immediately follows h1
let isFirstH2 = false;

export function CVPreview({ content }: CVPreviewProps) {
  // Reset on each render
  let h1Seen = false;
  let contactSeen = false;

  return (
    <div
      style={{
        fontFamily: "'Lato', 'Trebuchet MS', Arial, sans-serif",
        fontSize: "10.5pt",
        lineHeight: 1.65,
        color: "#8A9898",
        background: "#f4f6f8",
        maxHeight: "700px",
        overflowY: "auto",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
      }}
    >
      <ReactMarkdown
        components={{
          // H1 — candidate name (blue banner)
          h1: ({ children }) => {
            h1Seen = true;
            return (
              <h1
                style={{
                  backgroundColor: "#BECEE8",
                  color: "#1a1a2e",
                  fontSize: "22pt",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textAlign: "center",
                  textTransform: "uppercase",
                  padding: "28px 40px 6px 40px",
                  margin: 0,
                }}
              >
                {children}
              </h1>
            );
          },

          // H2 — role subtitle (inside blue banner) OR section heading
          h2: ({ children }) => {
            if (h1Seen && !contactSeen) {
              // First h2 after h1 = role subtitle, still in blue banner
              return (
                <h2
                  style={{
                    backgroundColor: "#BECEE8",
                    color: "#2a2a3e",
                    fontSize: "9.5pt",
                    fontWeight: 400,
                    letterSpacing: "0.22em",
                    textAlign: "center",
                    textTransform: "uppercase",
                    padding: "0 40px 24px 40px",
                    margin: 0,
                    border: "none",
                  }}
                >
                  {children}
                </h2>
              );
            }
            // Subsequent h2s = section headings
            return (
              <h2
                style={{
                  fontSize: "11pt",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textAlign: "center",
                  textTransform: "uppercase",
                  color: "#1a1a2e",
                  background: "transparent",
                  padding: "22px 40px 10px 40px",
                  margin: 0,
                  borderTop: "1.5px solid #c5d0d8",
                }}
              >
                {children}
              </h2>
            );
          },

          // H3 — company / institution name
          h3: ({ children }) => (
            <h3
              style={{
                fontSize: "10.5pt",
                fontWeight: 700,
                color: "#1a2a3a",
                padding: "16px 40px 0 40px",
                margin: 0,
              }}
            >
              {children}
            </h3>
          ),

          // H4 — date / role line
          h4: ({ children }) => (
            <h4
              style={{
                fontSize: "10.5pt",
                fontWeight: 700,
                color: "#1a2a3a",
                padding: "2px 40px 0 40px",
                margin: 0,
              }}
            >
              {children}
            </h4>
          ),

          // Paragraphs
          p: ({ children }) => {
            if (h1Seen && !contactSeen) {
              // Contact line — white strip below banner
              contactSeen = true;
              return (
                <p
                  style={{
                    background: "#ffffff",
                    textAlign: "center",
                    fontSize: "10pt",
                    color: "#8A9898",
                    padding: "14px 40px",
                    margin: 0,
                    borderBottom: "1.5px solid #c5d0d8",
                  }}
                >
                  {children}
                </p>
              );
            }
            return (
              <p
                style={{
                  padding: "4px 40px",
                  margin: 0,
                  marginBottom: "4px",
                  color: "#8A9898",
                  fontSize: "10.5pt",
                }}
              >
                {children}
              </p>
            );
          },

          // Bullet lists
          ul: ({ children }) => (
            <ul
              style={{
                padding: "6px 40px 12px 60px",
                margin: 0,
              }}
            >
              {children}
            </ul>
          ),

          li: ({ children }) => (
            <li
              style={{
                marginBottom: "5px",
                fontSize: "10.5pt",
                color: "#8A9898",
                lineHeight: 1.6,
              }}
            >
              {children}
            </li>
          ),

          // Bold text — company, role, tech stack
          strong: ({ children }) => (
            <strong style={{ fontWeight: 700, color: "#1a2a3a" }}>
              {children}
            </strong>
          ),

          // Horizontal rule
          hr: () => (
            <hr
              style={{
                border: "none",
                borderTop: "1.5px solid #c5d0d8",
                margin: 0,
              }}
            />
          ),

          // Links
          a: ({ href, children }) => (
            <a href={href} style={{ color: "#8A9898", textDecoration: "underline" }}>
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

import puppeteer from "puppeteer";
import { marked } from "marked";

const CV_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Lato', 'Trebuchet MS', Arial, sans-serif;
    font-size: 10.5pt;
    line-height: 1.65;
    color: #8A9898;
    background: #f4f6f8;
  }

  h1 {
    background-color: #BECEE8;
    color: #1a1a2e;
    font-size: 24pt;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-align: center;
    text-transform: uppercase;
    padding: 28px 40px 6px 40px;
    margin: 0;
  }

  h1 + h2 {
    background-color: #BECEE8;
    color: #2a2a3e;
    font-size: 9.5pt;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-align: center;
    text-transform: uppercase;
    padding: 0 40px 24px 40px;
    margin: 0;
    border: none;
  }

  h1 + h2 + p {
    background: #ffffff;
    text-align: center;
    font-size: 10pt;
    color: #8A9898;
    padding: 14px 40px;
    margin: 0;
    border-bottom: 1.5px solid #c5d0d8;
  }

  h2 {
    font-size: 11pt;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-align: center;
    text-transform: uppercase;
    color: #1a1a2e;
    background: transparent;
    padding: 20px 40px 10px 40px;
    margin: 0;
    border-top: 1.5px solid #c5d0d8;
  }

  h3 {
    font-size: 10.5pt;
    font-weight: 700;
    color: #1a2a3a;
    padding: 16px 40px 0 40px;
    margin: 0;
  }

  h4 {
    font-size: 10.5pt;
    font-weight: 700;
    color: #1a2a3a;
    padding: 2px 40px 0 40px;
    margin: 0;
  }

  p {
    padding: 4px 40px;
    margin: 0 0 4px 0;
    color: #8A9898;
    font-size: 10.5pt;
  }

  ul {
    padding: 6px 40px 12px 60px;
    margin: 0;
  }

  li {
    margin-bottom: 5px;
    font-size: 10.5pt;
    color: #8A9898;
    line-height: 1.6;
  }

  strong { font-weight: 700; color: #1a2a3a; }
  a { color: #8A9898; text-decoration: underline; }
  hr { border: none; border-top: 1.5px solid #c5d0d8; margin: 0; }

  @page { margin: 0; size: A4; }
`;

const COVER_LETTER_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Lato', 'Trebuchet MS', Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.7;
    color: #3a3a3a;
    background: #ffffff;
    padding: 60px 72px;
    max-width: 740px;
    margin: 0 auto;
  }

  h1 {
    font-size: 18pt;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 4px;
    letter-spacing: 0.05em;
  }

  h2 {
    font-size: 10pt;
    font-weight: 400;
    color: #8A9898;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1.5px solid #c5d0d8;
  }

  p {
    margin-bottom: 16px;
    color: #3a3a3a;
  }

  strong { font-weight: 700; color: #1a1a2e; }
  a { color: #8A9898; }

  @page { margin: 0; size: A4; }
`;

function buildHtml(markdown: string, css: string): string {
  const body = marked(markdown) as string;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>${css}</style>
</head>
<body>${body}</body>
</html>`;
}

export async function generatePdf(
  markdown: string,
  type: "cv" | "cover_letter"
): Promise<Buffer> {
  const css = type === "cv" ? CV_CSS : COVER_LETTER_CSS;
  const html = buildHtml(markdown, css);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({ format: "A4", printBackground: true });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

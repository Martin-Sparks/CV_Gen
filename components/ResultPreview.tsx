"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CVPreview } from "@/components/CVPreview";
import { TailoredApplication } from "@/lib/tailor-cv";

interface ResultPreviewProps {
  result: TailoredApplication;
  onReset: () => void;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? "Copied ✓" : "Copy markdown"}
    </button>
  );
}

function DownloadButton({
  markdown,
  type,
  label,
}: {
  markdown: string;
  type: "cv" | "cover_letter";
  label: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown, type }),
      });
      if (!res.ok) throw new Error("PDF generation failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = type === "cv" ? "tailored-cv.pdf" : "cover-letter.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      size="sm"
      variant="outline"
      className="gap-1.5"
    >
      {loading ? (
        <>
          <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Generating…
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {label}
        </>
      )}
    </Button>
  );
}

function DocumentTabs({
  preview,
  markdown,
  type,
  downloadLabel,
}: {
  preview: React.ReactNode;
  markdown: string;
  type: "cv" | "cover_letter";
  downloadLabel: string;
}) {
  return (
    <Tabs defaultValue="preview">
      <div className="flex items-center justify-between mb-3">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="markdown">Markdown</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-3">
          <CopyButton text={markdown} />
          <DownloadButton markdown={markdown} type={type} label={downloadLabel} />
        </div>
      </div>
      <TabsContent value="preview">{preview}</TabsContent>
      <TabsContent value="markdown">
        <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground/80 p-6 bg-muted/30 rounded-lg border overflow-auto max-h-[700px]">
          {markdown}
        </pre>
      </TabsContent>
    </Tabs>
  );
}

export function ResultPreview({ result, onReset }: ResultPreviewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Your application is ready</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Preview, copy, or download as PDF
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset}>
          ← Start over
        </Button>
      </div>

      <Separator />

      <Tabs defaultValue="cv">
        <TabsList className="w-full">
          <TabsTrigger value="cv" className="flex-1">Tailored CV</TabsTrigger>
          <TabsTrigger value="cover" className="flex-1">Cover Letter</TabsTrigger>
        </TabsList>

        <TabsContent value="cv" className="mt-4">
          <DocumentTabs
            preview={<CVPreview content={result.tailored_cv} />}
            markdown={result.tailored_cv}
            type="cv"
            downloadLabel="Download PDF"
          />
        </TabsContent>

        <TabsContent value="cover" className="mt-4">
          <DocumentTabs
            preview={<CVPreview content={result.cover_letter} />}
            markdown={result.cover_letter}
            type="cover_letter"
            downloadLabel="Download PDF"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

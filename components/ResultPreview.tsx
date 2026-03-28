"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}

function MarkdownPreview({ content }: { content: string }) {
  return (
    <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground/80 p-6 bg-muted/30 rounded-lg border overflow-auto max-h-[600px]">
      {content}
    </pre>
  );
}

export function ResultPreview({ result, onReset }: ResultPreviewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Your application is ready</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Review below, then copy or download each document
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

        <TabsContent value="cv" className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Markdown</span>
            <CopyButton text={result.tailored_cv} />
          </div>
          <MarkdownPreview content={result.tailored_cv} />
        </TabsContent>

        <TabsContent value="cover" className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Markdown</span>
            <CopyButton text={result.cover_letter} />
          </div>
          <MarkdownPreview content={result.cover_letter} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

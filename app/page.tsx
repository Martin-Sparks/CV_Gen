"use client";

import { useState } from "react";
import { UploadForm } from "@/components/UploadForm";
import { ResultPreview } from "@/components/ResultPreview";
import { TailoredApplication } from "@/lib/tailor-cv";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [result, setResult] = useState<TailoredApplication | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-tight">CV Tailor</span>
            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">beta</span>
          </div>
          <span className="text-xs text-muted-foreground">Powered by Claude</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {!result ? (
          <div className="space-y-8">
            {/* Hero */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Land more interviews
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Upload your CV and paste a job description. We'll tailor your CV
                and write a cover letter matched to the role — in seconds.
              </p>
            </div>

            <Separator />

            {/* Loading state overlay */}
            {isLoading && (
              <div className="rounded-lg border bg-muted/30 p-6 text-center space-y-2">
                <div className="flex justify-center">
                  <svg className="animate-spin w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">Reading your CV and tailoring your application…</p>
                <p className="text-xs text-muted-foreground">This usually takes 20–40 seconds</p>
              </div>
            )}

            <UploadForm
              onResult={setResult}
              onLoading={setIsLoading}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <ResultPreview
            result={result}
            onReset={() => setResult(null)}
          />
        )}
      </main>
    </div>
  );
}

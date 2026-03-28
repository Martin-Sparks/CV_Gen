"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TailoredApplication } from "@/lib/tailor-cv";

interface UploadFormProps {
  onResult: (result: TailoredApplication) => void;
  onLoading: (loading: boolean) => void;
  isLoading: boolean;
}

export function UploadForm({ onResult, onLoading, isLoading }: UploadFormProps) {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");
  const [cvInputMode, setCvInputMode] = useState<"upload" | "paste">("upload");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setCvFile(acceptedFiles[0]);
      setError("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!jobDescription.trim()) {
      setError("Please paste a job description.");
      return;
    }
    if (cvInputMode === "upload" && !cvFile) {
      setError("Please upload your CV as a PDF.");
      return;
    }
    if (cvInputMode === "paste" && !cvText.trim()) {
      setError("Please paste your CV text.");
      return;
    }

    onLoading(true);
    try {
      const formData = new FormData();
      formData.append("jobDescription", jobDescription);
      if (cvInputMode === "upload" && cvFile) {
        formData.append("cv", cvFile);
      } else {
        formData.append("cvText", cvText);
      }

      const res = await fetch("/api/tailor", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      onResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      onLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* CV Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Your CV</Label>
          <div className="flex gap-1 rounded-md border p-0.5">
            <button
              type="button"
              onClick={() => setCvInputMode("upload")}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                cvInputMode === "upload"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Upload PDF
            </button>
            <button
              type="button"
              onClick={() => setCvInputMode("paste")}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                cvInputMode === "paste"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Paste text
            </button>
          </div>
        </div>

        {cvInputMode === "upload" ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-foreground bg-muted"
                : cvFile
                ? "border-foreground bg-muted/40"
                : "border-border hover:border-foreground/40"
            }`}
          >
            <input {...getInputProps()} />
            {cvFile ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">{cvFile.name}</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setCvFile(null); }}
                  className="text-muted-foreground hover:text-foreground ml-1 text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {isDragActive ? "Drop your CV here" : "Drag & drop your CV"}
                </p>
                <p className="text-xs text-muted-foreground">
                  or <span className="underline underline-offset-2">browse files</span> · PDF only
                </p>
              </div>
            )}
          </div>
        ) : (
          <Textarea
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            placeholder="Paste your CV here..."
            className="min-h-[180px] resize-none font-mono text-xs"
          />
        )}
      </div>

      {/* Job Description */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Job Description</Label>
        <Textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here..."
          className="min-h-[180px] resize-none text-sm"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Tailoring your application…
          </span>
        ) : (
          "Tailor my application →"
        )}
      </Button>
    </form>
  );
}
